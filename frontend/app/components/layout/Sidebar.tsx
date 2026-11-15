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
    { href: '/dashboard', label: 'Overview (F10)', icon: 'dashboard' },
    { href: '/intelligence', label: 'Signals Intelligence (F9)', icon: 'monitoring' },
    { href: '/replay', label: 'Replay Simulator (F8)', icon: 'history' },
    { href: '/portfolio', label: 'Portfolio Audit (F7)', icon: 'pie_chart' },
    { href: '/copilot', label: 'Copilot AI (F1)', icon: 'bot' },
    { href: '/screener', label: 'Screener (F3)', icon: 'filter_list' },
    { href: '/macro', label: 'Macro Radar (F4)', icon: 'language' },
    { href: '/commodities', label: 'Commodities (F6)', icon: 'oil_barrel' },
    { href: '/calendar', label: 'Calendar (F5)', icon: 'calendar' },
    { href: '/watchlist', label: 'Watchlist', icon: 'star' },
    { href: '/equities', label: 'Equities (F2)', icon: 'show_chart' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-50 flex flex-col py-margin bg-[#0b0b0b] w-20 hover:w-64 transition-all duration-300 border-r border-[#262626] group overflow-x-hidden">
      <div className="flex flex-col items-center justify-center mb-margin px-gutter overflow-hidden whitespace-nowrap">
        <div className="w-10 h-10 rounded-full bg-[#191919] flex items-center justify-center mb-unit shrink-0 overflow-hidden border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <img src="/icon.svg" className="w-8 h-8 object-cover" alt="Piedmont Logo" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center h-0 group-hover:h-auto overflow-hidden">
          <span className="font-bold text-white tracking-[-0.053em] text-sm">Piedmont</span>
          <span className="font-mono-data text-[10px] text-[#868f97] uppercase tracking-widest">Terminal</span>
        </div>
      </div>

      {/* AI Copilot Quick Launch Button (Fey Pill) */}
      {onOpenCopilot && (
        <div className="px-unit mb-3 w-full">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-gutter p-2 rounded-full transition-all duration-200 w-full bg-[#479ffa]/10 hover:bg-[#479ffa]/20 border border-[#479ffa]/30 text-[#479ffa] hover:text-white"
            title="Launch AI Copilot (F1 or Cmd+K)"
          >
            <div className="w-10 flex items-center justify-center shrink-0">
              <Icon name="bot" className="text-[#479ffa]" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold text-xs uppercase tracking-wide">
              Copilot (F1)
            </span>
          </button>
        </div>
      )}
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 px-unit w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-gutter p-2 rounded-full transition-all duration-200 w-full ${
                isActive 
                  ? 'bg-white/10 border border-white/20 text-white font-semibold' 
                  : 'text-[#868f97] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="w-10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} filled={isActive} className={isActive ? 'text-[#479ffa]' : 'text-current'} />
              </div>
              <span className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs ${isActive ? 'font-bold text-white' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
