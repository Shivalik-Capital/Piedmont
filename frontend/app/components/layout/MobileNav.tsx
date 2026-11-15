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
    { href: '/dashboard', label: 'Overview', icon: 'dashboard' },
    { href: '/intelligence', label: 'Signals', icon: 'monitoring' },
    { href: '/replay', label: 'Replay', icon: 'history' },
    { href: '/portfolio', label: 'Portfolio', icon: 'pie_chart' },
    { href: '/screener', label: 'Screen', icon: 'tune' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md rounded-full bg-[#141414]/95 backdrop-blur-2xl border border-[#262626] shadow-[0_0_44px_rgba(0,0,0,0.9)] flex justify-around items-center py-1.5 px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-[#222222] text-white font-medium border border-[#333333]'
                : 'text-[#868f97] hover:text-white'
            }`}
          >
            <Icon name={item.icon} filled={isActive} className={`w-4 h-4 ${isActive ? 'text-[#479ffa]' : 'text-current'}`} />
            <span className="text-[9px] font-medium mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      {/* Floating Copilot Button on Mobile */}
      {onOpenCopilot && (
        <button
          onClick={onOpenCopilot}
          className="flex flex-col items-center justify-center px-3 py-1 rounded-full text-[#479ffa] hover:bg-[#1a1a1a] transition-colors"
          title="Open AI Copilot"
        >
          <Icon name="bot" className="w-4 h-4 text-[#479ffa]" />
          <span className="text-[9px] font-medium mt-0.5 tracking-tight text-[#479ffa]">AI</span>
        </button>
      )}
    </nav>
  );
}
