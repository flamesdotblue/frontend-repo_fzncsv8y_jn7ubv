import React, { useEffect, useMemo, useState } from 'react';

const API = (import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000');

const MOCK_HEATMAP = [
  { pair: 'BTCUSDT', vol_pct: 4.2 },
  { pair: 'ETHUSDT', vol_pct: -2.8 },
  { pair: 'SOLUSDT', vol_pct: 6.7 },
  { pair: 'BNBUSDT', vol_pct: 1.9 },
  { pair: 'XRPUSDT', vol_pct: -4.1 },
  { pair: 'ADAUSDT', vol_pct: 2.5 },
  { pair: 'DOGEUSDT', vol_pct: 3.1 },
  { pair: 'ARBUSDT', vol_pct: -1.2 },
  { pair: 'OPUSDT', vol_pct: 0.8 },
  { pair: 'LINKUSDT', vol_pct: 5.4 }
];

function getColorFromVol(vol) {
  if (vol > 6) return 'bg-emerald-500/80 text-black';
  if (vol > 3) return 'bg-emerald-400/70 text-black';
  if (vol > 0) return 'bg-zinc-700 text-emerald-300';
  if (vol > -3) return 'bg-rose-900/60 text-rose-200';
  return 'bg-rose-600/80 text-black';
}

export default function Heatmap({ onSelectPair }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(10);

  const fetchHeatmap = async () => {
    try {
      const res = await fetch(`${API}/api/heatmap`);
      if (!res.ok) throw new Error('bad status');
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        throw new Error('bad payload');
      }
      setError('');
    } catch (e) {
      setData(MOCK_HEATMAP);
      setError('Showing demo heatmap while live API is unavailable.');
    }
  };

  useEffect(() => {
    fetchHeatmap();
    const id = setInterval(fetchHeatmap, 10000);
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => [...data].sort((a, b) => parseFloat(b.vol_pct) - parseFloat(a.vol_pct)).slice(0, limit), [data, limit]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-white">Volatility Heatmap</h2>
        <div className="flex items-center gap-2">
          <p className="text-xs text-white/50">Top</p>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1 text-xs">
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      {error && <div className="mb-3 text-xs text-amber-400">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {sorted.map((item) => {
          const volNum = parseFloat(item.vol_pct);
          return (
            <button
              type="button"
              onClick={() => onSelectPair && onSelectPair(item.pair)}
              key={item.pair}
              className={`text-left rounded-lg p-3 border border-white/10 ${getColorFromVol(volNum)} transition-colors hover:ring-1 hover:ring-white/20`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{item.pair}</span>
                <span className="text-xs font-semibold">{volNum > 0 ? '+' : ''}{Number.isFinite(volNum) ? volNum.toFixed(2) : '0.00'}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-black/20 overflow-hidden">
                <div
                  className="h-full bg-white/70"
                  style={{ width: `${Math.min(Math.abs(volNum) * 10, 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
