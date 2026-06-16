import React from 'react';
import type { BookingStatus } from '../../types';

type BadgeVariant = BookingStatus | 'info' | 'success' | 'warning' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  default: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const dotColors: Record<BadgeVariant, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  default: 'bg-slate-400',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />
      {children}
    </span>
  );
};

export default Badge;
