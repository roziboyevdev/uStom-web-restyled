import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', dark = false }) => {
  return (
    <div className={`flex items-baseline gap-1.5 select-none cursor-pointer ${className}`}>
      {/* Editorial High-contrast Typography style logo */}
      <span 
        className={`text-2xl font-bold tracking-tighter italic ${dark ? 'text-white' : 'text-[#1C1C1C]'}`}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        uSTOM.
      </span>
      <span 
        className={`text-[9px] uppercase tracking-[0.25em] font-semibold ${dark ? 'text-stone-400' : 'text-stone-500'}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Academy
      </span>
    </div>
  );
};
