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
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

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
          e.preventDefault();
          router.push('/calendar');
          break;
        case 'F6':
          e.preventDefault();
          router.push('/commodities');
          break;
        case 'F7':
          e.preventDefault();
          router.push('/portfolio');
          break;
        case 'F8':
          e.preventDefault();
          router.push('/replay');
          break;
        case 'F9':
          e.preventDefault();
          router.push('/intelligence');
          break;
        case 'F10':
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
    { key: 'F1', label: 'COPILOT', actionName: 'help', action: onOpenCopilot },
    { key: 'F2', label: 'EQUITIES', actionName: 'equities', href: '/equities' },
    { key: 'F3', label: 'SCREENER', actionName: 'screener', href: '/screener' },
    { key: 'F4', label: 'MACRO', actionName: 'macro', href: '/macro' },
    { key: 'F5', label: 'CALENDAR', actionName: 'calendar', href: '/calendar' },
    { key: 'F6', label: 'COMMODITIES', actionName: 'commodities', href: '/commodities' },
    { key: 'F7', label: 'PORTFOLIO', actionName: 'portfolio', href: '/portfolio' },
    { key: 'F8', label: 'REPLAY', actionName: 'replay', href: '/replay' },
    { key: 'F9', label: 'SIGNALS', actionName: 'intelligence', href: '/intelligence' },
    { key: 'F10', label: 'OVERVIEW', actionName: 'dashboard', href: '/dashboard' },
  ];

  return (
    <div className="hidden lg:flex fixed top-0 left-0 right-0 z-40 bg-[#0b0b0b]/95 backdrop-blur-md border-b border-[#262626] h-7 items-center justify-between px-3 text-[10px] select-none">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[#868f97] font-mono-data tracking-wider uppercase text-[9px] mr-2">
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
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all ${
                isActive
                  ? 'bg-[#479ffa]/15 border border-[#479ffa]/50 text-white font-medium'
                  : 'bg-[#131313] hover:bg-[#191919] border border-[#262626] text-[#868f97] hover:text-white'
              }`}
              title={`Press ${item.key} or click to open ${item.label}`}
            >
              <span className="font-mono-data font-bold text-[#ffa16c] text-[9px] bg-[#ffa16c]/10 px-1 rounded-full">
                {item.key}
              </span>
              <span className="tracking-tight uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0 text-[#868f97]">
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
