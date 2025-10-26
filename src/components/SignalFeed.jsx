import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Rocket, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || '';

function ConfidenceDial({ value }) {
  const angle = (value / 100) * 270;
  const color = value > 80 ? 'text-emerald-400' : value > 65 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <path d="M10 70 A40 40 0 1 1 90 70" fill="none" stroke="#27272a" strokeWidth="10" strokeLinecap="round" />
        <path d="M10 70 A40 40 0 1 1 90 70" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(angle/270)*126} 200`} />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-semibold ${color}`}>{value}%</span>
      </div>
    </div>
  );
}

function MiniSpark({ color = '#34d399' }) {
  const [pts, setPts] = useState(() => Array.from({ length: 24 }, () => 50 + Math.random() * 10));
  useEffect(() => {
    const id = setInterval(() => {
      setPts((p) => [...p.slice(1), Math.max(30, Math.min(70, p[p.length - 1] + (Math.random() * 6 - 3)))]);
    }, 1200);
    return () => clearInterval(id);
  }, []);
  const w = 160, h = 48, step = w / (pts.length - 1);
  const max = Math.max(...pts), min = Math.min(...pts);
  const norm = (v) => ((v - min) / (max - min || 1)) * (h - 8) + 4;
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - norm(p)}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-90">
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function SignalCard({ s }) {
  const isLong = s.type === 'LONG';
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${isLong ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <p className="text-sm text-white/60">{new Date(s.timestamp).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {isLong ? <ArrowUpRight className="h-4 w-4 text-emerald-400" /> : <ArrowDownRight className="h-4 w-4 text-rose-400" />}
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{s.type}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2 flex items-center gap-4">
          <div className="min-w-[80px]">
            <p className="text-white font-semibold">{s.pair}</p>
            <p className="text-white/60 text-sm">Price {Number(s.price).toLocaleString()}</p>
          </div>
          <div className="hidden sm:block">
            <MiniSpark color={isLong ? '#34d399' : '#fb7185'} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ConfidenceDial value={s.confidence} />
          <div>
            <p className="text-xs text-white/50">Size</p>
            <p className="text-white font-medium">${s.size_usdt} @ {s.leverage}x</p>
            <p className="text-xs text-white/50 mt-1">Risk ${s.risk_usdt} • Projected ROI {s.projected_roi_pct}%</p>
          </div>
        </div>
        <div className="text-xs text-white/70">
          <p><span className="text-white/50">Entry:</span> {s.entry_low} – {s.entry_high}</p>
          <p><span className="text-white/50">TP:</span> {s.tp1} / {s.tp2} / {s.tp3}</p>
          <p><span className="text-white/50">SL:</span> {s.sl}</p>
        </div>
      </div>

      <p className="text-sm text-emerald-300/90">Quick Alpha: {s.reason}</p>
    </div>
  );
}

export default function SignalFeed() {
  const [signals, setSignals] = useState([]);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  const fetchSignals = async () => {
    try {
      const res = await fetch(`${API}/api/signals`);
      const json = await res.json();
      if (Array.isArray(json)) setSignals(json);
      setError('');
    } catch (e) {
      setError('Live data unavailable. Retrying...');
    }
  };

  useEffect(() => {
    fetchSignals();
    const id = setInterval(fetchSignals, 5000);
    return () => clearInterval(id);
  }, []);

  const summary = useMemo(() => {
    const long = signals.filter((s) => s.type === 'LONG').length;
    const short = signals.length - long;
    const confAvg = Math.round(signals.reduce((a, b) => a + (b.confidence || 0), 0) / (signals.length || 1));
    return { long, short, confAvg };
  }, [signals]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-emerald-400" />
          <h2 className="text-lg font-medium text-white">Live Signal Feed</h2>
        </div>
        <p className="text-xs text-white/50">L {summary.long} · S {summary.short} · Avg Conf {summary.confAvg}%</p>
      </div>
      {error && <div className="mb-3 text-xs text-amber-400">{error}</div>}
      <div ref={listRef} className="flex flex-col gap-3 max-h-[560px] overflow-auto pr-1">
        {signals.map((s) => (
          <SignalCard key={`${s.pair}-${s.timestamp}`} s={s} />
        ))}
      </div>
    </section>
  );
}
