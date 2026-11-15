'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  LayoutDashboard,
  LineChart,
  Building2,
  SlidersHorizontal,
  Globe,
  Fuel,
  Landmark,
  Database,
  Clock,
  Activity,
  Search,
  CheckCircle,
  AlertCircle,
  Calendar,
  Star,
  History,
  Bot,
  X,
  User,
  Sun,
  Moon,
  Play,
  Pause,
  PieChart,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  CandlestickChart,
  BarChart3,
  GraduationCap,
  BookOpen,
  Shield,
  ChevronsUp,
  ChevronsDown,
  ArrowRight
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export default function Icon({ name, className = '', size = 16 }: IconProps) {
  const iconProps = {
    size,
    className: `inline-block shrink-0 ${className}`
  };

  switch (name) {
    case 'trending_up':
      return <TrendingUp {...iconProps} />;
    case 'trending_down':
      return <TrendingDown {...iconProps} />;
    case 'arrow_drop_up':
    case 'arrow_upward':
    case 'arrow_up':
      return <ArrowUp {...iconProps} />;
    case 'arrow_drop_down':
    case 'arrow_downward':
    case 'arrow_down':
      return <ArrowDown {...iconProps} />;
    case 'keyboard_double_arrow_up':
    case 'chevrons_up':
      return <ChevronsUp {...iconProps} />;
    case 'keyboard_double_arrow_down':
    case 'chevrons_down':
      return <ChevronsDown {...iconProps} />;
    case 'arrow_forward':
    case 'arrow_right':
      return <ArrowRight {...iconProps} />;
    case 'chevron_left':
      return <ChevronLeft {...iconProps} />;
    case 'chevron_right':
      return <ChevronRight {...iconProps} />;
    case 'horizontal_rule':
    case 'remove':
      return <Minus {...iconProps} />;
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'show_chart':
      return <LineChart {...iconProps} />;
    case 'candlestick_chart':
      return <CandlestickChart {...iconProps} />;
    case 'bar_chart':
      return <BarChart3 {...iconProps} />;
    case 'business':
      return <Building2 {...iconProps} />;
    case 'tune':
    case 'filter_list':
      return <SlidersHorizontal {...iconProps} />;
    case 'language':
    case 'public':
      return <Globe {...iconProps} />;
    case 'oil_barrel':
      return <Fuel {...iconProps} />;
    case 'account_balance':
      return <Landmark {...iconProps} />;
    case 'database':
      return <Database {...iconProps} />;
    case 'schedule':
      return <Clock {...iconProps} />;
    case 'monitoring':
    case 'activity':
      return <Activity {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'check':
      return <CheckCircle {...iconProps} />;
    case 'alert':
      return <AlertCircle {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'calendar':
    case 'event':
      return <Calendar {...iconProps} />;
    case 'history':
    case 'replay':
      return <History {...iconProps} />;
    case 'bot':
    case 'ai':
    case 'copilot':
      return <Bot {...iconProps} />;
    case 'school':
    case 'learn':
    case 'education':
      return <GraduationCap {...iconProps} />;
    case 'book':
      return <BookOpen {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'close':
    case 'x':
      return <X {...iconProps} />;
    case 'account_circle':
    case 'user':
      return <User {...iconProps} />;
    case 'light_mode':
    case 'sun':
      return <Sun {...iconProps} />;
    case 'dark_mode':
    case 'moon':
      return <Moon {...iconProps} />;
    case 'play_arrow':
    case 'play':
      return <Play {...iconProps} />;
    case 'pause':
      return <Pause {...iconProps} />;
    case 'pie_chart':
      return <PieChart {...iconProps} />;
    case 'visibility':
    case 'eye':
      return <Eye {...iconProps} />;
    case 'send':
      return <Send {...iconProps} />;
    default:
      return null;
  }
}
