import React from 'react';

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', dark = false }) => {
  return (
    <div className={`flex items-baseline gap-1.5 select-none cursor-pointer ${className}`}>
      {/* Editorial High-contrast Typography style logo with Premium Blue Brand signature */}
      <span 
        className={`text-2xl font-bold tracking-tighter italic ${dark ? 'text-white' : 'text-slate-900'}`}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        uSTOM<span className="text-blue-600">.</span>
      </span>
      <span 
        className={`text-[9px] uppercase tracking-[0.25em] font-semibold ${dark ? 'text-blue-200/60' : 'text-blue-800/60'}`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Academy
      </span>
    </div>
  );
};
