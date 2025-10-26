import React, { useState } from 'react';
import { Bell, Settings, X, Shield, Flame } from 'lucide-react';
import HeroCover3D from './components/HeroCover3D';
import SignalFeed from './components/SignalFeed';
import Heatmap from './components/Heatmap';
import AnalyticsPanel from './components/AnalyticsPanel';

export default function App() {
  const [selectedPair, setSelectedPair] = useState('');
  const [safetyPaused, setSafetyPaused] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500" />
            <div>
              <p className="text-xs text-white/50 leading-none">AI Quant Cockpit</p>
              <h1 className="text-lg font-semibold leading-none tracking-tight">AlphaDesk</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">
              <Bell className="h-4 w-4" /> Alerts
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">
              <Settings className="h-4 w-4" /> Settings
            </button>
          </div>
        </div>

        {/* Hero cover */}
        <HeroCover3D />

        {/* Filters / status */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {selectedPair && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs">
              Pair filter: <strong className="font-medium text-emerald-300">{selectedPair}</strong>
              <button
                aria-label="Clear pair filter"
                className="rounded p-1 hover:bg-zinc-800"
                onClick={() => setSelectedPair('')}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => setSafetyPaused((s) => !s)}
            className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs ${
              safetyPaused ? 'bg-rose-600/20 text-rose-300' : 'bg-zinc-900 text-white/80 hover:bg-zinc-800'
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> {safetyPaused ? 'Safety Mode: Paused (no new signals)' : 'Safety Mode: Active'}
          </button>
          <span className="ml-auto inline-flex items-center gap-2 text-xs text-white/50">
            <Flame className="h-3.5 w-3.5 text-emerald-400" /> Live alpha scans 24/7
          </span>
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SignalFeed selectedPair={selectedPair} safetyPaused={safetyPaused} />
            <AnalyticsPanel />
          </div>
          <div className="flex flex-col gap-6">
            <Heatmap onSelectPair={setSelectedPair} />
            {/* Safety Notice */}
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
              <p className="text-sm text-white/80 font-medium">Safety Mode</p>
              <p className="mt-1 text-xs text-white/60">If volatility exceeds threshold, new signals pause and position sizing reduces automatically.</p>
              <div className="mt-3 h-2 w-full rounded bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: '36%' }} />
              </div>
              <p className="mt-1 text-xs text-white/40">Market Stress Index: 36%</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/40">
          Built for elite traders • Demo-friendly UI with live API hooks. Configure your backend URL to go live.
        </div>
      </div>
    </div>
  );
}
