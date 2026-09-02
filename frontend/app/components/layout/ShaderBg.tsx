'use client';

import { useEffect, useRef } from 'react';

export default function ShaderBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    // Minimal, elegant ambient background — no mouse tracking
    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
  // Very subtle dark gradient — almost imperceptible movement
  float t = u_time * 0.05;
  
  // Base: pure black to very dark grey
  vec3 base = vec3(0.0);
  
  // Extremely subtle blue-tinted orb that drifts slowly
  vec2 center1 = vec2(0.7 + 0.15 * sin(t), 0.3 + 0.1 * cos(t * 0.7));
  float glow1 = smoothstep(0.9, 0.0, distance(uv, center1));
  
  vec2 center2 = vec2(0.3 + 0.1 * cos(t * 0.5), 0.7 + 0.15 * sin(t * 0.3));
  float glow2 = smoothstep(0.8, 0.0, distance(uv, center2));
  
  // Extremely restrained — just enough to prevent pure flat black
  vec3 accent = vec3(0.04, 0.13, 0.40); // Deep muted blue
  vec3 finalColor = base + accent * glow1 * 0.06 + accent * glow2 * 0.04;
  
  // Subtle film grain for texture
  float noise = fract(sin(dot(uv + u_time * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor -= noise * 0.015;
  
  gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type)!;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      return s;
    }

    const glCtx = gl as WebGLRenderingContext;
    const prog = glCtx.createProgram()!;
    glCtx.attachShader(prog, createShader(glCtx, glCtx.VERTEX_SHADER, vs));
    glCtx.attachShader(prog, createShader(glCtx, glCtx.FRAGMENT_SHADER, fs));
    glCtx.linkProgram(prog);
    glCtx.useProgram(prog);

    const buf = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glCtx.STATIC_DRAW);
    const pos = glCtx.getAttribLocation(prog, 'a_position');
    glCtx.enableVertexAttribArray(pos);
    glCtx.vertexAttribPointer(pos, 2, glCtx.FLOAT, false, 0, 0);

    const uTime = glCtx.getUniformLocation(prog, 'u_time');
    const uRes = glCtx.getUniformLocation(prog, 'u_resolution');

    let animId: number;
    function render(t: number) {
      if (!canvas) return;
      glCtx.viewport(0, 0, canvas.width, canvas.height);
      
      if (uTime) glCtx.uniform1f(uTime, t * 0.001);
      if (uRes) glCtx.uniform2f(uRes, canvas.width, canvas.height);
      
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
