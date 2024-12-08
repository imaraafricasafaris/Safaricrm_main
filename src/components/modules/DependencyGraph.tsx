import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getDependencyGraph } from '../../lib/api/dependencies';

interface DependencyGraphProps {
  moduleId: string;
}

export default function DependencyGraph({ moduleId }: DependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadDependencyGraph();
  }, [moduleId]);

  const loadDependencyGraph = async () => {
    try {
      const graph = await getDependencyGraph();
      if (canvasRef.current) {
        drawGraph(graph);
      }
    } catch (error) {
      console.error('Error loading dependency graph:', error);
    }
  };

  const drawGraph = (graph: Record<string, string[]>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set colors based on theme
    const textColor = isDarkMode ? '#fff' : '#000';
    const lineColor = isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';

    // Draw nodes and edges
    const nodes = Object.keys(graph);
    const radius = 30;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * 150;
      const y = centerY + Math.sin(angle) * 150;

      // Draw edges
      graph[node].forEach(target => {
        const targetIndex = nodes.indexOf(target);
        const targetAngle = (targetIndex / nodes.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(targetAngle) * 150;
        const targetY = centerY + Math.sin(targetAngle) * 150;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = lineColor;
        ctx.stroke();
      });

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node === moduleId ? '#9EFF00' : isDarkMode ? '#374151' : '#f3f4f6';
      ctx.fill();
      ctx.strokeStyle = lineColor;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, x, y);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full"
    />
  );
}