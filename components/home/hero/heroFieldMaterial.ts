import * as THREE from "three"

/**
 * Abstract flowing grain field for the Hero background. Deliberately not
 * photographic — there's no real project photography in this repo to
 * distort, so the WebGL layer works the brand's own colors and the
 * logo-mark's organic curve language instead of faking imagery.
 *
 * Three color stops (bg / fg / accent) come from the active theme's CSS
 * variables, so light and dark get genuinely different compositions, not
 * an inverted palette — see HeroScene's theme uniform updates.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uScroll;
  uniform float uAspect;
  uniform vec3 uColorBg;
  uniform vec3 uColorFg;
  uniform vec3 uColorAccent;

  // Ashima Arts / Stefan Gustavson simplex noise (public domain).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 2.05;
      amplitude *= 0.55;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uAspect, 1.0);

    // Slow ambient drift, gently pushed downward as the page scrolls.
    vec2 drift = vec2(uTime * 0.035, uTime * 0.02 - uScroll * 0.18);
    float field = fbm(p * 1.6 + drift);

    // Pointer ripple: falls off with distance, nudges the sampled field.
    vec2 mouseP = uMouse * vec2(uAspect, 1.0);
    float distToMouse = distance(p, mouseP);
    float ripple = smoothstep(0.6, 0.0, distToMouse) * uMouseStrength;
    field += ripple * 0.5 * sin(distToMouse * 14.0 - uTime * 1.8);

    float t = smoothstep(-0.6, 0.7, field);
    vec3 color = mix(uColorBg, uColorAccent, t);

    // Vignette toward the foreground color, grounding the corners.
    float vignette = smoothstep(0.95, 0.15, distance(uv, vec2(0.5)));
    color = mix(uColorFg * 0.06 + uColorBg * 0.94, color, vignette + 0.15);

    // Film grain.
    float grain = fract(sin(dot(uv * (uTime * 0.5 + 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.025;

    gl_FragColor = vec4(color, 1.0);
  }
`

export class HeroFieldMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseStrength: { value: 0 },
        uScroll: { value: 0 },
        uAspect: { value: 1 },
        uColorBg: { value: new THREE.Color("#030812") },
        uColorFg: { value: new THREE.Color("#fbf9e4") },
        uColorAccent: { value: new THREE.Color("#0a84ff") },
      },
    })
  }
}
