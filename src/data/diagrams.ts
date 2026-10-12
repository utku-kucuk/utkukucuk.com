/**
 * Architecture diagrams for project cards and case studies.
 * Coordinates live in a 400×240 viewBox; edges animate a "request" dot from → to.
 */
export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  kind?: 'client' | 'service' | 'data' | 'edge';
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** optional dashed boundary, e.g. a Docker host */
  group?: { label: string; x: number; y: number; w: number; h: number };
}

export const diagrams: Record<string, Diagram> = {
  commerce: {
    group: { label: 'target · docker compose', x: 128, y: 14, w: 262, h: 212 },
    nodes: [
      { id: 'client', label: 'Client', sub: 'REST', x: 10, y: 98, w: 92, kind: 'client' },
      {
        id: 'auth',
        label: 'Spring Security',
        sub: 'JWT · RBAC',
        x: 142,
        y: 98,
        w: 104,
        kind: 'edge',
      },
      { id: 'catalog', label: 'Catalog', sub: 'service', x: 270, y: 30, w: 104, kind: 'service' },
      { id: 'cart', label: 'Cart', sub: 'service', x: 270, y: 98, w: 104, kind: 'service' },
      { id: 'order', label: 'Order', sub: 'service', x: 270, y: 166, w: 104, kind: 'service' },
    ],
    edges: [
      { from: 'client', to: 'auth' },
      { from: 'auth', to: 'catalog' },
      { from: 'auth', to: 'cart' },
      { from: 'auth', to: 'order' },
    ],
  },
  viducate: {
    group: { label: 'linux · docker', x: 116, y: 14, w: 274, h: 212 },
    nodes: [
      { id: 'browser', label: 'Browser', sub: 'video player', x: 6, y: 98, w: 82, kind: 'client' },
      { id: 'nginx', label: 'Nginx', sub: 'TLS · proxy', x: 132, y: 98, w: 80, kind: 'edge' },
      {
        id: 'api',
        label: 'Express API',
        sub: 'JWT · RBAC',
        x: 232,
        y: 30,
        w: 100,
        kind: 'service',
      },
      { id: 'ffmpeg', label: 'FFmpeg', sub: 'thumbnails', x: 232, y: 166, w: 100, kind: 'service' },
      { id: 'db', label: 'PostgreSQL', sub: 'metadata', x: 300, y: 98, w: 84, kind: 'data' },
    ],
    edges: [
      { from: 'browser', to: 'nginx' },
      { from: 'nginx', to: 'api' },
      { from: 'api', to: 'ffmpeg' },
      { from: 'api', to: 'db' },
    ],
  },
  ironecho: {
    group: { label: 'self-hosted · compose', x: 150, y: 14, w: 240, h: 212 },
    nodes: [
      {
        id: 'app',
        label: 'Mobile app',
        sub: 'Realm (offline)',
        x: 10,
        y: 60,
        w: 110,
        kind: 'client',
      },
      {
        id: 'queue',
        label: 'Write queue',
        sub: 'replay on reconnect',
        x: 10,
        y: 150,
        w: 110,
        kind: 'client',
      },
      {
        id: 'sync',
        label: 'Sync API',
        sub: 'conflict resolution',
        x: 166,
        y: 98,
        w: 112,
        kind: 'service',
      },
      { id: 'ws', label: 'Socket.io', sub: 'live updates', x: 296, y: 30, w: 84, kind: 'edge' },
      { id: 'mongo', label: 'MongoDB', sub: 'workouts', x: 296, y: 166, w: 84, kind: 'data' },
    ],
    edges: [
      { from: 'app', to: 'queue' },
      { from: 'queue', to: 'sync' },
      { from: 'sync', to: 'mongo' },
      { from: 'sync', to: 'ws' },
      { from: 'ws', to: 'app' },
    ],
  },
  smarthome: {
    group: { label: 'home server · docker', x: 196, y: 50, w: 194, h: 140 },
    nodes: [
      {
        id: 'blind',
        label: 'Smart blind',
        sub: 'ESP32 · NEMA17',
        x: 10,
        y: 20,
        w: 110,
        kind: 'client',
      },
      { id: 'lamp', label: 'Smart lamp', sub: 'ESP32 · LED', x: 10, y: 98, w: 110, kind: 'client' },
      {
        id: 'climate',
        label: 'Climate',
        sub: 'ESP32 · DHT22',
        x: 10,
        y: 176,
        w: 110,
        kind: 'client',
      },
      { id: 'mqtt', label: 'MQTT', sub: 'broker', x: 210, y: 98, w: 72, kind: 'edge' },
      {
        id: 'ha',
        label: 'Home Assistant',
        sub: 'automations',
        x: 296,
        y: 98,
        w: 84,
        kind: 'service',
      },
    ],
    edges: [
      { from: 'blind', to: 'mqtt' },
      { from: 'lamp', to: 'mqtt' },
      { from: 'climate', to: 'mqtt' },
      { from: 'mqtt', to: 'ha' },
    ],
  },
  hirehub: {
    group: { label: 'browser · spa', x: 116, y: 14, w: 274, h: 212 },
    nodes: [
      { id: 'user', label: 'Browser', sub: '3 roles', x: 6, y: 98, w: 86, kind: 'client' },
      {
        id: 'router',
        label: 'React Router',
        sub: 'protected routes',
        x: 130,
        y: 98,
        w: 108,
        kind: 'edge',
      },
      { id: 'ctx', label: 'Context', sub: 'auth · jobs', x: 270, y: 30, w: 110, kind: 'service' },
      { id: 'svc', label: 'services/', sub: 'REST-shaped', x: 270, y: 98, w: 110, kind: 'service' },
      { id: 'store', label: 'Mock API', sub: 'localStorage', x: 270, y: 166, w: 110, kind: 'data' },
    ],
    edges: [
      { from: 'user', to: 'router' },
      { from: 'router', to: 'ctx' },
      { from: 'ctx', to: 'svc' },
      { from: 'svc', to: 'store' },
    ],
  },
  colorexplorer: {
    group: { label: 'browser · static', x: 116, y: 14, w: 274, h: 212 },
    nodes: [
      { id: 'input', label: 'Input', sub: 'any CSS colour', x: 6, y: 98, w: 92, kind: 'client' },
      { id: 'culori', label: 'culori', sub: 'parse · gamut', x: 130, y: 98, w: 100, kind: 'edge' },
      { id: 'lib', label: 'lib/', sub: 'unit-tested', x: 262, y: 30, w: 118, kind: 'service' },
      {
        id: 'ui',
        label: 'React UI',
        sub: 'palette · WCAG',
        x: 262,
        y: 98,
        w: 118,
        kind: 'service',
      },
      {
        id: 'hash',
        label: 'URL hash',
        sub: 'shareable state',
        x: 262,
        y: 166,
        w: 118,
        kind: 'data',
      },
    ],
    edges: [
      { from: 'input', to: 'culori' },
      { from: 'culori', to: 'lib' },
      { from: 'lib', to: 'ui' },
      { from: 'ui', to: 'hash' },
    ],
  },
};
