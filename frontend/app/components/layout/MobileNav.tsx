'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../ui/Icon';

interface MobileNavProps {
  onOpenCopilot?: () => void;
}

export default function MobileNav({ onOpenCopilot }: MobileNavProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', label: 'Pulse', icon: 'dashboard' },
    { href: '/screener', label: 'Screen', icon: 'tune' },
    { href: '/replay', label: 'Replay', icon: 'history' },
    { href: '/watchlist', label: 'Watch', icon: 'star' },
    { href: '/macro', label: 'Macro', icon: 'language' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md rounded-full bg-[#121212]/95 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex justify-around items-center py-1.5 px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-white/15 text-white font-medium'
                : 'text-[#868f97] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="w-4 h-4 text-current" />
            <span className="text-[9px] font-medium mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      {/* Floating Copilot Button on Mobile */}
      {onOpenCopilot && (
        <button
          onClick={onOpenCopilot}
          className="flex flex-col items-center justify-center px-2 py-1 rounded-full text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
          title="Open AI Copilot"
        >
          <Icon name="bot" className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tight text-[#3b82f6]">AI</span>
        </button>
      )}
    </nav>
  );
}
