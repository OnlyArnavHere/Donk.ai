"use client";

import React, { useEffect, useRef } from "react";

export  function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Target gaze and micro-movement state
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetGazeRef = useRef({ x: 0, y: 0 });
  const currentGazeRef = useRef({ x: 0, y: 0 });

  // Monochrome shading palette
  const chars = " ░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let blinkTimer = 0;
    let isBlinking = false;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      // Position face in the upper section of the canvas
      const scale = Math.min(width, height) * 0.35;
      const centerY = Math.max(scale * 0.85, height * 0.32);

      // Smooth gaze tracking towards cursor
      currentGazeRef.current.x += (targetGazeRef.current.x - currentGazeRef.current.x) * 0.08;
      currentGazeRef.current.y += (targetGazeRef.current.y - currentGazeRef.current.y) * 0.08;

      const gazeX = currentGazeRef.current.x;
      const gazeY = currentGazeRef.current.y;

      // Gentle breathing animation offset
      const breathY = Math.sin(time * 1.5) * 4;
      const scanLineY = (Math.sin(time * 1.2) * 0.45 + 0.5) * scale * 0.8;

      // Blinking animation logic
      blinkTimer += 0.02;
      if (blinkTimer > 3.5) {
        isBlinking = true;
        if (blinkTimer > 3.7) {
          isBlinking = false;
          blinkTimer = 0;
        }
      }

      const points: {
        x: number;
        y: number;
        char: string;
        alpha: number;
        glow?: boolean;
      }[] = [];

      // 1. Agent Head Silhouette & Helmet Contour
      const headHeight = 1.3;
      for (let a = -Math.PI * 0.85; a <= Math.PI * 0.85; a += 0.04) {
        const radX = 0.62 * (1 - 0.08 * Math.cos(a * 2));
        const radY = radX * headHeight;

        const x = Math.sin(a) * radX * scale + centerX + gazeX * 5;
        const y = -Math.cos(a) * radY * scale + centerY + breathY + gazeY * 5;

        points.push({
          x,
          y,
          char: "█",
          alpha: 0.35,
        });
      }

      // 2. Cybernetic Visor / Eye Array
      const visorWidth = 0.52;
      const visorHeight = 0.14;
      const visorY = -0.08 * scale + centerY + breathY + gazeY * 12;

      for (let vx = -visorWidth; vx <= visorWidth; vx += 0.025) {
        for (let vy = -visorHeight; vy <= visorHeight; vy += 0.035) {
          // Visor curved contour
          const distFromCenter = Math.abs(vx / visorWidth);
          const curvature = (1 - Math.pow(distFromCenter, 2)) * 0.02;

          const px = centerX + (vx + gazeX * 0.12) * scale;
          const py = visorY + (vy - curvature + gazeY * 0.1) * scale;

          if (isBlinking && Math.abs(vy) > 0.03) continue;

          // Scanning line effect on visor
          const isScan = Math.abs(py - (centerY - scale * 0.2 + scanLineY)) < 4;
          const char = isScan ? "█" : vx > -0.15 && vx < 0.15 ? "▓" : "▒";

          points.push({
            x: px,
            y: py,
            char,
            alpha: isScan ? 1.0 : 0.75 + Math.sin(time * 4 + vx * 10) * 0.2,
            glow: isScan,
          });
        }
      }

      // 3. Glowing AI Pupils / Core Sensors
      if (!isBlinking) {
        [-0.22, 0.22].forEach((eyeXOffset) => {
          for (let r = 0; r <= 0.04; r += 0.012) {
            for (let da = 0; da < Math.PI * 2; da += Math.PI / 4) {
              const px = centerX + (eyeXOffset + gazeX * 0.18 + r * Math.cos(da)) * scale;
              const py = visorY + (gazeY * 0.15 + r * Math.sin(da)) * scale;

              points.push({
                x: px,
                y: py,
                char: "█",
                alpha: 1.0,
                glow: true,
              });
            }
          }
        });
      }

      // 4. Angular Jawline and Chintrap
      for (let j = -0.38; j <= 0.38; j += 0.03) {
        const jx = centerX + j * scale + gazeX * 4;
        const jy = centerY + (0.52 + Math.pow(Math.abs(j), 1.3) * 0.35) * scale + breathY + gazeY * 4;

        points.push({
          x: jx,
          y: jy,
          char: "░",
          alpha: 0.45,
        });
      }

      // 5. Forehead Neural Core Matrix / HUD Brackets
      const foreheadY = centerY - 0.42 * scale + breathY + gazeY * 8;
      for (let fx = -0.18; fx <= 0.18; fx += 0.04) {
        const pulse = Math.sin(time * 3 + fx * 20) > 0 ? "█" : "┬";
        points.push({
          x: centerX + fx * scale + gazeX * 6,
          y: foreheadY,
          char: pulse,
          alpha: 0.8,
        });
      }

      // 6. Voice Wave / Audio Node Indicator (Lower Mouth area)
      const mouthY = centerY + 0.32 * scale + breathY + gazeY * 6;
      for (let mx = -0.15; mx <= 0.15; mx += 0.025) {
        const waveHeight = Math.sin(time * 6 + mx * 35) * 0.02;
        points.push({
          x: centerX + mx * scale + gazeX * 5,
          y: mouthY + waveHeight * scale,
          char: "─",
          alpha: 0.65,
        });
      }

      // 7. Tactical Frame Corner HUD Brackets
      const bracketSize = scale * 0.65;
      const brackets = [
        { x: centerX - bracketSize, y: centerY - bracketSize, c: "╭" },
        { x: centerX + bracketSize, y: centerY - bracketSize, c: "╮" },
        { x: centerX - bracketSize, y: centerY + bracketSize, c: "╰" },
        { x: centerX + bracketSize, y: centerY + bracketSize, c: "╯" },
      ];

      brackets.forEach((b) => {
        points.push({
          x: b.x,
          y: b.y,
          char: b.c,
          alpha: 0.35,
        });
      });

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      points.forEach((p) => {
        if (p.glow) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(240, 240, 240, ${Math.min(1, Math.max(0.05, p.alpha))})`;
          ctx.shadowBlur = 0;
        }
        ctx.fillText(p.char, p.x, p.y);
      });

      time += 0.025;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetGazeRef.current = { x: x * 25, y: y * 20 };
  };

  return (
    <div className="w-full h-screen bg-transparent overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full block cursor-default"
      />
    </div>
  );
}