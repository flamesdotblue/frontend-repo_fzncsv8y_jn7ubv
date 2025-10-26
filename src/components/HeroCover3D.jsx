import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover3D() {
  return (
    <section className="relative w-full h-[340px] overflow-hidden rounded-xl border border-white/10 bg-black">
      <Spline
        scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Gradient + Title Overlay (non-blocking) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-end p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            AlphaDesk • Real‑Time Crypto Futures Signals
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
            Self-learning AI scans price action, order flow, and sentiment every second to deliver execution‑ready setups.
          </p>
        </div>
      </div>
    </section>
  );
}
