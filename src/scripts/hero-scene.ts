/**
 * Hero background: an interactive "service graph".
 * Clusters of nodes (services) wired to hubs, with request packets
 * travelling along the edges and lighting up the nodes they reach.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';

interface Options {
  reducedMotion: boolean;
}

interface Edge {
  a: number;
  b: number;
}

interface Packet {
  edge: number;
  forward: boolean;
  t: number;
  speed: number;
}

const pointVertex = /* glsl */ `
  attribute float size;
  attribute float energy;
  uniform float uPixelRatio;
  varying float vEnergy;
  void main() {
    vEnergy = energy;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (1.0 + energy * 1.6) * uPixelRatio * (40.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vEnergy;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 1.6) * uOpacity;
    if (alpha < 0.01) discard;
    vec3 color = mix(uColor, uHot, clamp(vEnergy, 0.0, 1.0));
    gl_FragColor = vec4(color, alpha);
  }
`;

function cssColor(name: string): Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color(value || '#ffffff');
}

function gaussian(): number {
  // Box–Muller; good enough for scattering nodes around a hub
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function initHeroScene(canvas: HTMLCanvasElement, { reducedMotion }: Options) {
  const isSmall = window.matchMedia('(max-width: 767px)').matches;
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  const pixelRatio = Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const graph = new Group();
  scene.add(graph);
  let raf = 0;

  // ---------- Topology ----------
  const clusterCount = isSmall ? 5 : 7;
  const perCluster = isSmall ? 7 : 11;
  const positions: Vector3[] = [new Vector3(0, 0, 0)]; // gateway
  const sizes: number[] = [3.2];
  const edges: Edge[] = [];
  const hubs: number[] = [];

  for (let c = 0; c < clusterCount; c++) {
    // hubs spread on a sphere (golden-angle distribution)
    const y = 1 - (c / (clusterCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = c * 2.39996;
    const hubPos = new Vector3(Math.cos(theta) * r, y * 0.7, Math.sin(theta) * r).multiplyScalar(
      3.4,
    );
    const hub = positions.push(hubPos) - 1;
    sizes.push(2.4);
    hubs.push(hub);
    edges.push({ a: 0, b: hub });

    const members: number[] = [];
    for (let i = 0; i < perCluster; i++) {
      const p = hubPos
        .clone()
        .add(new Vector3(gaussian(), gaussian(), gaussian()).multiplyScalar(0.75));
      const idx = positions.push(p) - 1;
      sizes.push(1 + Math.random() * 0.8);
      members.push(idx);
      edges.push({ a: hub, b: idx });
    }
    // a few intra-cluster links between services
    for (let i = 0; i < Math.floor(perCluster / 3); i++) {
      const a = members[Math.floor(Math.random() * members.length)]!;
      const b = members[Math.floor(Math.random() * members.length)]!;
      if (a !== b) edges.push({ a, b });
    }
  }
  // hub ring
  hubs.forEach((h, i) => edges.push({ a: h, b: hubs[(i + 1) % hubs.length]! }));

  const nodeCount = positions.length;
  const adjacency: number[][] = Array.from({ length: nodeCount }, () => []);
  edges.forEach((e, i) => {
    adjacency[e.a]!.push(i);
    adjacency[e.b]!.push(i);
  });

  // ---------- Nodes ----------
  const nodeGeometry = new BufferGeometry();
  const nodePos = new Float32Array(nodeCount * 3);
  positions.forEach((p, i) => p.toArray(nodePos, i * 3));
  const nodeEnergy = new Float32Array(nodeCount);
  nodeGeometry.setAttribute('position', new BufferAttribute(nodePos, 3));
  nodeGeometry.setAttribute('size', new BufferAttribute(new Float32Array(sizes), 1));
  nodeGeometry.setAttribute('energy', new BufferAttribute(nodeEnergy, 1));

  const nodeMaterial = new ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color() },
      uHot: { value: new Color() },
      uOpacity: { value: isSmall ? 0.7 : 0.95 },
      uPixelRatio: { value: pixelRatio },
    },
  });
  graph.add(new Points(nodeGeometry, nodeMaterial));

  // ---------- Edges ----------
  const edgeGeometry = new BufferGeometry();
  const edgePos = new Float32Array(edges.length * 6);
  edges.forEach((e, i) => {
    positions[e.a]!.toArray(edgePos, i * 6);
    positions[e.b]!.toArray(edgePos, i * 6 + 3);
  });
  edgeGeometry.setAttribute('position', new BufferAttribute(edgePos, 3));
  const edgeMaterial = new LineBasicMaterial({
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  graph.add(new LineSegments(edgeGeometry, edgeMaterial));

  // ---------- Packets ----------
  const packetCount = isSmall ? 18 : 36;
  const packets: Packet[] = Array.from({ length: packetCount }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    forward: Math.random() > 0.5,
    t: Math.random(),
    speed: 0.25 + Math.random() * 0.45,
  }));
  const packetGeometry = new BufferGeometry();
  const packetPos = new Float32Array(packetCount * 3);
  packetGeometry.setAttribute('position', new BufferAttribute(packetPos, 3));
  packetGeometry.setAttribute(
    'size',
    new BufferAttribute(new Float32Array(packetCount).fill(1.3), 1),
  );
  packetGeometry.setAttribute(
    'energy',
    new BufferAttribute(new Float32Array(packetCount).fill(1), 1),
  );
  const packetMaterial = nodeMaterial.clone();
  packetMaterial.uniforms.uPixelRatio!.value = pixelRatio;
  graph.add(new Points(packetGeometry, packetMaterial));

  const tmp = new Vector3();
  function updatePackets(dt: number) {
    packets.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const edge = edges[p.edge]!;
        const arrived = p.forward ? edge.b : edge.a;
        nodeEnergy[arrived] = 1;
        const options = adjacency[arrived]!;
        p.edge = options[Math.floor(Math.random() * options.length)]!;
        p.forward = edges[p.edge]!.a === arrived;
        p.t = 0;
      }
      const edge = edges[p.edge]!;
      const from = positions[p.forward ? edge.a : edge.b]!;
      const to = positions[p.forward ? edge.b : edge.a]!;
      tmp.lerpVectors(from, to, p.t).toArray(packetPos, i * 3);
    });
    packetGeometry.attributes.position!.needsUpdate = true;

    for (let i = 0; i < nodeCount; i++) nodeEnergy[i] = Math.max(0, nodeEnergy[i]! - dt * 1.8);
    nodeGeometry.attributes.energy!.needsUpdate = true;
  }

  // ---------- Theme ----------
  function applyTheme() {
    const dark = document.documentElement.dataset.theme !== 'light';
    const fg = cssColor('--fg');
    const accent = cssColor('--accent');
    const accent2 = cssColor('--accent-2');
    nodeMaterial.uniforms.uColor!.value.copy(dark ? fg.clone().lerp(accent, 0.35) : accent);
    nodeMaterial.uniforms.uHot!.value.copy(accent2);
    packetMaterial.uniforms.uColor!.value.copy(accent2);
    packetMaterial.uniforms.uHot!.value.copy(accent2);
    edgeMaterial.color.copy(dark ? accent : fg);
    edgeMaterial.opacity = (dark ? 0.2 : 0.12) * (isSmall ? 0.6 : 1);
    const blending = dark ? AdditiveBlending : NormalBlending;
    nodeMaterial.blending = packetMaterial.blending = blending;
    nodeMaterial.needsUpdate = packetMaterial.needsUpdate = true;
    if (!raf) renderer.render(scene, camera);
  }
  applyTheme();
  window.addEventListener('themechange', applyTheme);

  // ---------- Layout ----------
  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the graph to the right on wide screens, centred behind text on small ones
    graph.position.x = w > 1024 ? 2.6 : 0;
    camera.position.z = w < 768 ? 14 : 11;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // ---------- Interaction ----------
  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let scrollProgress = 0;
  const setScrollProgress = (value: number) => {
    scrollProgress = value;
  };

  // ---------- Loop ----------
  let visible = true;
  let last = performance.now();
  let spin = 0;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spin += dt * 0.06;
    graph.rotation.y += (spin + pointer.x * 0.35 - graph.rotation.y) * 0.04;
    graph.rotation.x += (pointer.y * 0.18 + scrollProgress * 0.4 - graph.rotation.x) * 0.04;
    camera.position.y = -scrollProgress * 2;
    updatePackets(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || reducedMotion || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) start();
    else stop();
  });
  io.observe(canvas);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  if (reducedMotion) {
    // a single, static frame
    graph.rotation.set(0.15, 0.6, 0);
    updatePackets(0);
    renderer.render(scene, camera);
  } else {
    start();
  }

  canvas.dataset.ready = 'true';

  return {
    setScrollProgress,
    destroy() {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('themechange', applyTheme);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
    },
  };
}
