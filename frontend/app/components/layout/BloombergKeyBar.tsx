'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface FunctionKeyAction {
  key: string;
  label: string;
  actionName: string;
  href?: string;
  action?: () => void;
}

interface BloombergKeyBarProps {
  onOpenCopilot?: () => void;
}

export default function BloombergKeyBar({ onOpenCopilot }: BloombergKeyBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Handle function keys F1 through F9
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          if (onOpenCopilot) onOpenCopilot();
          break;
        case 'F2':
          e.preventDefault();
          router.push('/equities');
          break;
        case 'F3':
          e.preventDefault();
          router.push('/screener');
          break;
        case 'F4':
          e.preventDefault();
          router.push('/macro');
          break;
        case 'F5':
          // Only intercept F5 if not inside input to allow terminal navigation
          e.preventDefault();
          router.push('/calendar');
          break;
        case 'F6':
          e.preventDefault();
          router.push('/commodities');
          break;
        case 'F7':
          e.preventDefault();
          router.push('/watchlist');
          break;
        case 'F8':
          e.preventDefault();
          router.push('/replay');
          break;
        case 'F9':
          e.preventDefault();
          router.push('/dashboard');
          break;
        case 'k':
        case 'K':
          if ((e.metaKey || e.ctrlKey) && !isInput) {
            e.preventDefault();
            if (onOpenCopilot) onOpenCopilot();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, onOpenCopilot]);

  const keys: FunctionKeyAction[] = [
    { key: 'F1', label: 'AI COPILOT', actionName: 'help', action: onOpenCopilot },
    { key: 'F2', label: 'EQUITIES', actionName: 'equities', href: '/equities' },
    { key: 'F3', label: 'SCREENER', actionName: 'screener', href: '/screener' },
    { key: 'F4', label: 'MACRO', actionName: 'macro', href: '/macro' },
    { key: 'F5', label: 'CALENDAR', actionName: 'calendar', href: '/calendar' },
    { key: 'F6', label: 'COMMODITIES', actionName: 'commodities', href: '/commodities' },
    { key: 'F7', label: 'WATCH & P&L', actionName: 'watchlist', href: '/watchlist' },
    { key: 'F8', label: 'REPLAY', actionName: 'replay', href: '/replay' },
    { key: 'F9', label: 'PULSE', actionName: 'dashboard', href: '/dashboard' },
  ];

  return (
    <div className="hidden lg:flex fixed top-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-b border-[#1c2840] h-7 items-center justify-between px-3 text-[10px] select-none">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[#64748b] font-mono-data tracking-wider uppercase text-[9px] mr-2">
          TERMINAL COMMANDS:
        </span>
        {keys.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.action) item.action();
                else if (item.href) router.push(item.href);
              }}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                isActive
                  ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/50 text-white font-medium'
                  : 'bg-[#0f1520] hover:bg-[#1c2840] border border-[#1c2840] text-[#cbd5e1]'
              }`}
              title={`Press ${item.key} or click to open ${item.label}`}
            >
              <span className="font-mono-data font-bold text-[#f59e0b] text-[9px] bg-[#f59e0b]/10 px-1 rounded">
                {item.key}
              </span>
              <span className="tracking-tight uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0 text-[#64748b]">
        <span className="font-mono-data text-[9px]">CMD+K / F1 COPILOT</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-white transition-colors"
          title="Toggle Command Bar Visibility"
        >
          {collapsed ? 'SHOW' : 'HIDE'}
        </button>
      </div>
    </div>
  );
}
