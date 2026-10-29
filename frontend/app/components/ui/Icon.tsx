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
  User
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
    case 'horizontal_rule':
    case 'remove':
      return <Minus {...iconProps} />;
    case 'dashboard':
      return <LayoutDashboard {...iconProps} />;
    case 'show_chart':
      return <LineChart {...iconProps} />;
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
    case 'close':
    case 'x':
      return <X {...iconProps} />;
    case 'account_circle':
    case 'user':
      return <User {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
}
