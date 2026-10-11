/**
 * Hero background: an interactive "service graph".
 * Clusters of nodes (services) wired to hubs, with request packets
 * travelling along the edges and lighting up the nodes they reach.
 *
 * Written against raw WebGL (no 3D library) so it stays a few kB and
 * costs almost nothing on the main thread.
 */
import { mat4, type Mat4, type Vec3 } from './mat4';

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

type RGB = [number, number, number];

const POINT_VS = `
  attribute vec3 aPosition;
  attribute float aSize;
  attribute float aEnergy;
  uniform mat4 uModelView;
  uniform mat4 uProjection;
  uniform float uPixelRatio;
  varying float vEnergy;
  void main() {
    vEnergy = aEnergy;
    vec4 mv = uModelView * vec4(aPosition, 1.0);
    gl_PointSize = aSize * (1.0 + aEnergy * 1.6) * uPixelRatio * (40.0 / -mv.z);
    gl_Position = uProjection * mv;
  }
`;

const POINT_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vEnergy;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.6) * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uHot, clamp(vEnergy, 0.0, 1.0)) * alpha, alpha);
  }
`;

const LINE_VS = `
  attribute vec3 aPosition;
  uniform mat4 uModelView;
  uniform mat4 uProjection;
  void main() {
    gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
  }
`;

const LINE_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor * uOpacity, uOpacity);
  }
`;

/** Resolve a CSS custom property to normalised RGB via the browser's colour parser. */
function cssColor(name: string): RGB {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  document.body.appendChild(probe);
  const [r = 255, g = 255, b = 255] =
    getComputedStyle(probe)
      .color.match(/\d+(\.\d+)?/g)
      ?.map(Number) ?? [];
  probe.remove();
  return [r / 255, g / 255, b / 255];
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

function gaussian(): number {
  // Box–Muller; good enough for scattering nodes around a hub
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const program = gl.createProgram()!;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? 'WebGL program failed to link');
  }
  return {
    program,
    uniform: (name: string) => gl.getUniformLocation(program, name),
    attrib: (name: string) => gl.getAttribLocation(program, name),
  };
}

export function initHeroScene(canvas: HTMLCanvasElement, { reducedMotion }: Options) {
  const gl = canvas.getContext('webgl', {
    antialias: true,
    alpha: true,
  });
  if (!gl) return null;

  const isSmall = window.matchMedia('(max-width: 767px)').matches;
  const pixelRatio = Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2);

  // ---------- Topology ----------
  const clusterCount = isSmall ? 5 : 7;
  const perCluster = isSmall ? 7 : 11;
  const positions: Vec3[] = [[0, 0, 0]]; // gateway
  const sizes: number[] = [3.2];
  const edges: Edge[] = [];
  const hubs: number[] = [];

  for (let c = 0; c < clusterCount; c++) {
    // hubs spread on a sphere (golden-angle distribution)
    const y = 1 - (c / (clusterCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = c * 2.39996;
    const hubPos: Vec3 = [Math.cos(theta) * r * 3.4, y * 0.7 * 3.4, Math.sin(theta) * r * 3.4];
    const hub = positions.push(hubPos) - 1;
    sizes.push(2.4);
    hubs.push(hub);
    edges.push({ a: 0, b: hub });

    const members: number[] = [];
    for (let i = 0; i < perCluster; i++) {
      const idx =
        positions.push([
          hubPos[0] + gaussian() * 0.75,
          hubPos[1] + gaussian() * 0.75,
          hubPos[2] + gaussian() * 0.75,
        ]) - 1;
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

  const packetCount = isSmall ? 18 : 36;
  const packets: Packet[] = Array.from({ length: packetCount }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    forward: Math.random() > 0.5,
    t: Math.random(),
    speed: 0.25 + Math.random() * 0.45,
  }));

  // ---------- GPU resources ----------
  const pointProgram = compile(gl, POINT_VS, POINT_FS);
  const lineProgram = compile(gl, LINE_VS, LINE_FS);

  const buffer = (data: Float32Array, usage: number = gl.STATIC_DRAW) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    return b;
  };

  const nodeEnergy = new Float32Array(nodeCount);
  const packetPos = new Float32Array(packetCount * 3);
  const edgePos = new Float32Array(edges.length * 6);
  edges.forEach((e, i) => {
    edgePos.set(positions[e.a]!, i * 6);
    edgePos.set(positions[e.b]!, i * 6 + 3);
  });

  const nodePosBuf = buffer(new Float32Array(positions.flat()));
  const nodeSizeBuf = buffer(new Float32Array(sizes));
  const nodeEnergyBuf = buffer(nodeEnergy, gl.DYNAMIC_DRAW);
  const edgePosBuf = buffer(edgePos);
  const packetPosBuf = buffer(packetPos, gl.DYNAMIC_DRAW);
  const packetSizeBuf = buffer(new Float32Array(packetCount).fill(1.3));
  const packetEnergyBuf = buffer(new Float32Array(packetCount).fill(1));

  const bindAttrib = (location: number, buf: WebGLBuffer, size: number) => {
    if (location < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  };

  // ---------- Simulation ----------
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
      packetPos[i * 3] = from[0] + (to[0] - from[0]) * p.t;
      packetPos[i * 3 + 1] = from[1] + (to[1] - from[1]) * p.t;
      packetPos[i * 3 + 2] = from[2] + (to[2] - from[2]) * p.t;
    });
    for (let i = 0; i < nodeCount; i++) nodeEnergy[i] = Math.max(0, nodeEnergy[i]! - dt * 1.8);
  }

  // ---------- Theme ----------
  const palette = {
    dark: true,
    node: [1, 1, 1] as RGB,
    hot: [1, 1, 1] as RGB,
    edge: [1, 1, 1] as RGB,
    edgeOpacity: 0.2,
  };

  // ---------- Camera ----------
  const projection: Mat4 = mat4.create();
  const modelView: Mat4 = mat4.create();
  const view = { graphX: 0, camZ: 11, rotX: 0, rotY: 0, scroll: 0 };

  // ---------- Render ----------
  function render() {
    if (!gl) return;
    mat4.identity(modelView);
    mat4.translate(modelView, modelView, [view.graphX, view.scroll * 2, -view.camZ]);
    mat4.rotateX(modelView, modelView, view.rotX);
    mat4.rotateY(modelView, modelView, view.rotY);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // shaders output premultiplied colour; additive glow in dark, normal "over" in light
    if (palette.dark) gl.blendFunc(gl.ONE, gl.ONE);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // edges
    gl.useProgram(lineProgram.program);
    gl.uniformMatrix4fv(lineProgram.uniform('uModelView'), false, modelView);
    gl.uniformMatrix4fv(lineProgram.uniform('uProjection'), false, projection);
    gl.uniform3fv(lineProgram.uniform('uColor'), palette.edge);
    gl.uniform1f(lineProgram.uniform('uOpacity'), palette.edgeOpacity);
    bindAttrib(lineProgram.attrib('aPosition'), edgePosBuf, 3);
    gl.drawArrays(gl.LINES, 0, edges.length * 2);

    // nodes + packets share the point program
    gl.useProgram(pointProgram.program);
    gl.uniformMatrix4fv(pointProgram.uniform('uModelView'), false, modelView);
    gl.uniformMatrix4fv(pointProgram.uniform('uProjection'), false, projection);
    gl.uniform1f(pointProgram.uniform('uPixelRatio'), pixelRatio);
    gl.uniform1f(pointProgram.uniform('uOpacity'), isSmall ? 0.7 : 0.95);
    const aPos = pointProgram.attrib('aPosition');
    const aSize = pointProgram.attrib('aSize');
    const aEnergy = pointProgram.attrib('aEnergy');

    gl.uniform3fv(pointProgram.uniform('uColor'), palette.node);
    gl.uniform3fv(pointProgram.uniform('uHot'), palette.hot);
    gl.bindBuffer(gl.ARRAY_BUFFER, nodeEnergyBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, nodeEnergy);
    bindAttrib(aPos, nodePosBuf, 3);
    bindAttrib(aSize, nodeSizeBuf, 1);
    bindAttrib(aEnergy, nodeEnergyBuf, 1);
    gl.drawArrays(gl.POINTS, 0, nodeCount);

    gl.uniform3fv(pointProgram.uniform('uColor'), palette.hot);
    gl.bindBuffer(gl.ARRAY_BUFFER, packetPosBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, packetPos);
    bindAttrib(aPos, packetPosBuf, 3);
    bindAttrib(aSize, packetSizeBuf, 1);
    bindAttrib(aEnergy, packetEnergyBuf, 1);
    gl.drawArrays(gl.POINTS, 0, packetCount);
  }

  // ---------- Loop ----------
  let raf = 0;
  let visible = true;
  let last = 0;
  let spin = 0;
  const pointer = { x: 0, y: 0 };

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spin += dt * 0.06;
    view.rotY += (spin + pointer.x * 0.35 - view.rotY) * 0.04;
    view.rotX += (pointer.y * 0.18 + view.scroll * 0.4 - view.rotX) * 0.04;
    updatePackets(dt);
    render();
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

  // ---------- Events ----------
  function applyTheme() {
    const dark = document.documentElement.dataset.theme !== 'light';
    const fg = cssColor('--fg');
    const accent = cssColor('--accent');
    palette.dark = dark;
    palette.node = dark ? mix(fg, accent, 0.35) : accent;
    palette.hot = cssColor('--accent-2');
    palette.edge = dark ? accent : fg;
    palette.edgeOpacity = (dark ? 0.2 : 0.12) * (isSmall ? 0.6 : 1);
    if (!raf) render();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || !gl) return;
    canvas.width = Math.round(w * pixelRatio);
    canvas.height = Math.round(h * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    mat4.perspective(projection, (45 * Math.PI) / 180, w / h, 0.1, 100);
    // keep the graph to the right on wide screens, centred behind text on small ones
    view.graphX = w > 1024 ? 2.6 : 0;
    view.camZ = w < 768 ? 14 : 11;
    if (!raf) render();
  }

  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onContextLost = (e: Event) => {
    e.preventDefault();
    stop();
    canvas.removeAttribute('data-ready');
  };
  const resizeObserver = new ResizeObserver(resize);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) start();
    else stop();
  });

  if (reducedMotion) {
    // a single, static frame
    view.rotX = 0.15;
    view.rotY = 0.6;
    updatePackets(0);
  }
  applyTheme();
  resize();
  resizeObserver.observe(canvas);
  io.observe(canvas);
  window.addEventListener('themechange', applyTheme);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);
  start();
  canvas.dataset.ready = 'true';

  return {
    setScrollProgress(value: number) {
      view.scroll = value;
    },
    destroy() {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('themechange', applyTheme);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
    },
  };
}
