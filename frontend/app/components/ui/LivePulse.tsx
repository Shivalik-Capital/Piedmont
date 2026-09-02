'use client';

import { useState, useEffect } from 'react';
import { getGlobalSessionName } from '../../lib/market-helpers';

export function ActiveDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="relative flex h-2 w-2 ml-2 items-center justify-center">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
    </span>
  );
}

export default function LivePulse() {
  const [session, setSession] = useState<{label: string, active: boolean}>({ label: 'MARKET: ACTIVE', active: true });

  useEffect(() => {
    const update = () => setSession(getGlobalSessionName());
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!session.active) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <span className="text-[12px] text-on-surface-variant uppercase tracking-[0.2em] font-semibold">
          {session.label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary pulse-active" />
      </span>
      <span className="text-[12px] text-primary uppercase tracking-[0.2em] font-semibold">
        {session.label}
      </span>
    </div>
  );
}
