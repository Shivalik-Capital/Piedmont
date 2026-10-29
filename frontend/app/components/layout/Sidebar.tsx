'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../ui/Icon';

interface SidebarProps {
  onOpenCopilot?: () => void;
}

export default function Sidebar({ onOpenCopilot }: SidebarProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard (F9)', icon: 'dashboard' },
    { href: '/screener', label: 'Screener (F3)', icon: 'filter_list' },
    { href: '/watchlist', label: 'Watchlist & P&L (F7)', icon: 'star' },
    { href: '/calendar', label: 'Calendar (F5)', icon: 'calendar' },
    { href: '/replay', label: 'Replay Simulator (F8)', icon: 'history' },
    { href: '/equities', label: 'Equities (F2)', icon: 'show_chart' },
    { href: '/equities/companies', label: 'Companies', icon: 'business' },
    { href: '/macro', label: 'Macro (F4)', icon: 'language' },
    { href: '/commodities', label: 'Commodities (F6)', icon: 'oil_barrel' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-50 flex flex-col py-margin bg-surface w-20 hover:w-64 transition-all duration-300 border-r border-outline-variant group overflow-x-hidden">
      <div className="flex flex-col items-center justify-center mb-margin px-gutter overflow-hidden whitespace-nowrap">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-unit shrink-0 overflow-hidden border border-white/5">
          <img src="/icon.svg" className="w-10 h-10 object-cover" alt="Piedmont Logo" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center h-0 group-hover:h-auto overflow-hidden">
          <span className="font-semibold text-on-surface">Piedmont</span>
          <span className="font-mono-data text-xs text-on-surface-variant uppercase tracking-widest">Terminal</span>
        </div>
      </div>

      {/* AI Copilot Quick Launch Button */}
      {onOpenCopilot && (
        <div className="px-unit mb-3 w-full">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-gutter p-2 rounded-full transition-all duration-200 w-full bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#3b82f6] hover:text-white"
            title="Launch AI Copilot (F1 or Cmd+K)"
          >
            <div className="w-10 flex items-center justify-center shrink-0">
              <Icon name="bot" className="text-[#3b82f6]" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold text-xs uppercase tracking-wide">
              Copilot (F1)
            </span>
          </button>
        </div>
      )}
      
      <nav className="flex flex-col gap-unit px-unit w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-gutter p-2 rounded-full transition-all duration-200 w-full ${
                isActive 
                  ? 'bg-on-surface text-surface font-bold scale-100' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant scale-95 hover:scale-100'
              }`}
            >
              <div className="w-10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} filled={isActive} className={isActive ? 'text-surface' : ''} />
              </div>
              <span className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
