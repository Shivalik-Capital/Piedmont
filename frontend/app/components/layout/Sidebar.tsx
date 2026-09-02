'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../ui/Icon';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'dashboard' },
    { href: '/screener', label: 'Screener', icon: 'filter_list' },
    { href: '/equities', label: 'Equities', icon: 'show_chart' },
    { href: '/equities/companies', label: 'Companies', icon: 'business' },
    { href: '/macro', label: 'Macro', icon: 'language' },
    { href: '/commodities', label: 'Commodities', icon: 'oil_barrel' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-50 flex flex-col py-margin bg-surface w-20 hover:w-64 transition-all duration-300 border-r border-outline-variant group overflow-x-hidden">
      <div className="flex flex-col items-center justify-center mb-margin px-gutter overflow-hidden whitespace-nowrap">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-unit shrink-0">
          <span className="font-semibold text-lg text-on-surface">P</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center h-0 group-hover:h-auto overflow-hidden">
          <span className="font-semibold text-on-surface">Piedmont</span>
          <span className="font-mono-data text-xs text-on-surface-variant uppercase tracking-widest">Terminal</span>
        </div>
      </div>
      
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
