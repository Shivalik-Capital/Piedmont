'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../ui/Icon';

export default function MobileNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', label: 'Pulse', icon: 'dashboard' },
    { href: '/screener', label: 'Screen', icon: 'tune' },
    { href: '/watchlist', label: 'Watch', icon: 'star' },
    { href: '/calendar', label: 'Events', icon: 'calendar' },
    { href: '/macro', label: 'Macro', icon: 'language' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-md rounded-full bg-[#121212]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex justify-around items-center py-2 px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-white/15 text-white font-medium'
                : 'text-[#868f97] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="w-5 h-5 text-current" />
            <span className="text-[10px] font-medium mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
