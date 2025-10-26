import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      {sub ? <p className="mt-1 text-xs text-white/40">{sub}</p> : null}
    </div>
  );
}

export default function AnalyticsPanel() {
  const [stats, setStats] = useState({ winRate: 62, rr: 1.8, avgRoi: 14.2, weekly: 7.1 });
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => ({
        winRate: Math.min(95, Math.max(35, s.winRate + (Math.random() * 2 - 1))),
        rr: Math.max(0.8, Math.min(3.5, s.rr + (Math.random() * 0.2 - 0.1))),
        avgRoi: Math.max(-10, Math.min(40, s.avgRoi + (Math.random() * 1.5 - 0.75))),
        weekly: Math.max(-20, Math.min(60, s.weekly + (Math.random() * 2 - 1))),
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-emerald-400" />
        <h2 className="text-lg font-medium text-white">Performance Analytics</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} sub="last 200 trades" />
        <Stat label="Avg Risk/Reward" value={`${stats.rr.toFixed(2)}R`} sub="net of fees" />
        <Stat label="Avg ROI" value={`${stats.avgRoi.toFixed(1)}%`} sub="per closed signal" />
        <Stat label="This Week" value={`${stats.weekly.toFixed(1)}%`} sub="PnL (simulated)" />
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900 p-4">
        <p className="text-xs text-white/60">Equity Curve (simulated)</p>
        <EquitySparkline />
      </div>
    </section>
  );
}

function EquitySparkline() {
  const [points, setPoints] = useState(() => Array.from({ length: 40 }, () => 50 + Math.random() * 20));
  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1), Math.max(20, Math.min(120, prev[prev.length - 1] + (Math.random() * 8 - 4)))];
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const width = 560;
  const height = 120;
  const step = width / (points.length - 1);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = (v) => ((v - min) / (max - min || 1)) * (height - 20) + 10;
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - norm(p)}`).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mt-2">
      <path d={d} fill="none" stroke="url(#g)" strokeWidth="2" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
