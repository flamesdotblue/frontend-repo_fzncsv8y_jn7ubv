import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || '';

const MOCK_ANALYTICS = { win_rate: 61.3, rr: 1.85, avg_roi: 1.4, weekly: 3.2 };

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
  const [stats, setStats] = useState(MOCK_ANALYTICS);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/analytics`);
      if (!res.ok) throw new Error('bad status');
      const json = await res.json();
      setStats(json);
      setError('');
    } catch (e) {
      setStats(MOCK_ANALYTICS);
      setError('Showing demo analytics while live API is unavailable.');
    }
  };

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 15000);
    return () => clearInterval(id);
  }, []);

  const win = `${Number(stats.win_rate || 0).toFixed(1)}%`;
  const rr = `${Number(stats.rr || 0).toFixed(2)}R`;
  const avg = `${Number(stats.avg_roi || 0).toFixed(1)}%`;
  const wk = `${Number(stats.weekly || 0).toFixed(1)}%`;

  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-emerald-400" />
        <h2 className="text-lg font-medium text-white">Performance Analytics</h2>
      </div>
      {error && <div className="mb-3 text-xs text-amber-400">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Win Rate" value={win} sub="last 200 trades" />
        <Stat label="Avg Risk/Reward" value={rr} sub="net of fees" />
        <Stat label="Avg ROI" value={avg} sub="per closed signal" />
        <Stat label="This Week" value={wk} sub="PnL" />
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900 p-4">
        <p className="text-xs text-white/60">Equity Curve (live refresh)</p>
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
        const next = [...prev.slice(1), Math.max(20, Math.min(120, prev[prev.length - 1] + (Math.random() * 8 - 4)))] ;
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
