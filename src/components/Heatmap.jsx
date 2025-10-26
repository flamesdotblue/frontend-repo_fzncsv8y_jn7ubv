import React, { useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL || '';

function getColorFromVol(vol) {
  if (vol > 6) return 'bg-emerald-500/80 text-black';
  if (vol > 3) return 'bg-emerald-400/70 text-black';
  if (vol > 0) return 'bg-zinc-700 text-emerald-300';
  if (vol > -3) return 'bg-rose-900/60 text-rose-200';
  return 'bg-rose-600/80 text-black';
}

export default function Heatmap() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const fetchHeatmap = async () => {
    try {
      const res = await fetch(`${API}/api/heatmap`);
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
      setError('');
    } catch (e) {
      setError('Heatmap live data unavailable.');
    }
  };

  useEffect(() => {
    fetchHeatmap();
    const id = setInterval(fetchHeatmap, 10000);
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => [...data].sort((a, b) => parseFloat(b.vol_pct) - parseFloat(a.vol_pct)), [data]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-white">Volatility Heatmap</h2>
        <p className="text-xs text-white/50">Top 10 movers</p>
      </div>
      {error && <div className="mb-3 text-xs text-amber-400">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {sorted.map((item) => {
          const volNum = parseFloat(item.vol_pct);
          return (
            <div
              key={item.pair}
              className={`rounded-lg p-3 border border-white/10 ${getColorFromVol(volNum)} transition-colors`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{item.pair}</span>
                <span className="text-xs font-semibold">{volNum > 0 ? '+' : ''}{volNum.toFixed(2)}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-black/20 overflow-hidden">
                <div
                  className="h-full bg-white/70"
                  style={{ width: `${Math.min(Math.abs(volNum) * 10, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
