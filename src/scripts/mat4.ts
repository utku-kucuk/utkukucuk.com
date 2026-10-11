/** Minimal column-major 4×4 matrix helpers (gl-matrix compatible layout). */
export type Mat4 = Float32Array;
export type Vec3 = [number, number, number];

function create(): Mat4 {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

function identity(out: Mat4): Mat4 {
  out.fill(0);
  out[0] = out[5] = out[10] = out[15] = 1;
  return out;
}

function perspective(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function translate(out: Mat4, a: Mat4, [x, y, z]: Vec3): Mat4 {
  if (out !== a) out.set(a);
  out[12] = a[0]! * x + a[4]! * y + a[8]! * z + a[12]!;
  out[13] = a[1]! * x + a[5]! * y + a[9]! * z + a[13]!;
  out[14] = a[2]! * x + a[6]! * y + a[10]! * z + a[14]!;
  out[15] = a[3]! * x + a[7]! * y + a[11]! * z + a[15]!;
  return out;
}

function rotateX(out: Mat4, a: Mat4, rad: number): Mat4 {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const [a10, a11, a12, a13, a20, a21, a22, a23] = [
    a[4]!,
    a[5]!,
    a[6]!,
    a[7]!,
    a[8]!,
    a[9]!,
    a[10]!,
    a[11]!,
  ];
  if (out !== a) out.set(a);
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

function rotateY(out: Mat4, a: Mat4, rad: number): Mat4 {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const [a00, a01, a02, a03, a20, a21, a22, a23] = [
    a[0]!,
    a[1]!,
    a[2]!,
    a[3]!,
    a[8]!,
    a[9]!,
    a[10]!,
    a[11]!,
  ];
  if (out !== a) out.set(a);
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

export const mat4 = { create, identity, perspective, translate, rotateX, rotateY };
