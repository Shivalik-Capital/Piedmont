'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../ui/Icon';

export default function MobileNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Pulse', icon: 'dashboard' },
    { href: '/equities', label: 'Equities', icon: 'show_chart' },
    { href: '/equities/companies', label: 'Cos', icon: 'business' },
    { href: '/macro', label: 'Macro', icon: 'language' },
    { href: '/commodities', label: 'Commd', icon: 'oil_barrel' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md rounded-full bg-surface/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center py-2 px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant/60 hover:bg-white/5 hover:text-primary'
            }`}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
