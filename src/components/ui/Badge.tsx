import React from 'react';
import { CourseLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'level' | 'outline' | 'success' | 'danger';
  level?: CourseLevel;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  level, 
  className = '' 
}) => {
  let styles = '';

  if (variant === 'level' && level) {
    switch (level) {
      case CourseLevel.BEGINNER:
        styles = 'bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50';
        break;
      case CourseLevel.INTERMEDIATE:
        styles = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
        break;
      case CourseLevel.ADVANCED:
        styles = 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
        break;
      case CourseLevel.EXPERT:
        styles = 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50';
        break;
    }
  } else {
    switch (variant) {
      case 'primary':
        styles = 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40';
        break;
      case 'secondary':
        styles = 'bg-slate-50 text-slate-700 border border-slate-200/60 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60';
        break;
      case 'accent':
        styles = 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
        break;
      case 'success':
        styles = 'bg-green-500/10 text-green-600 border border-green-500/20';
        break;
      case 'danger':
        styles = 'bg-red-500/10 text-red-600 border border-red-500/20';
        break;
      case 'outline':
        styles = 'border border-slate-300 text-slate-600 bg-transparent dark:border-slate-700 dark:text-slate-400';
        break;
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${styles} ${className}`}>
      {children}
    </span>
  );
};
