import React from "react";

interface SdgIconTileProps {
  number: number;
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SdgOfficialSymbol: React.FC<{ number: number; className?: string; color?: string }> = ({ 
  number, 
  className = "w-10 h-10",
  color 
}) => {
  switch (number) {
    case 4: // Quality Education
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Open Book Pages */}
          <path d="M30 46C20 42 12 43 6 46V19C12 16 20 16 30 19V46Z" fill="white" />
          <path d="M34 46C44 42 52 43 58 46V19C52 16 44 16 34 19V46Z" fill="white" />
          <path d="M30 48.5C20 44.5 12 45.5 6 48.5V50C12 47 20 46 30 50V48.5Z" fill="white" opacity="0.65" />
          <path d="M34 48.5C44 44.5 52 45.5 58 48.5V50C52 47 44 46 34 50V48.5Z" fill="white" opacity="0.65" />
          {/* Angled Pencil pointing into page */}
          <g transform="translate(37, 7) rotate(38)">
            <polygon points="0,0 5,0 5,16 2.5,21 0,16" fill="white" />
            <polygon points="0,16 5,16 2.5,21" fill="white" opacity="0.8" />
          </g>
        </svg>
      );
    case 7: // Affordable & Clean Energy
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Sun center circle with power symbol */}
          <circle cx="32" cy="32" r="11.5" stroke="white" strokeWidth="2.8" />
          <path d="M32 23.5V30.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M26.5 28A7 7 0 1 0 37.5 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Sun rays */}
          <line x1="32" y1="8" x2="32" y2="15" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="32" y1="49" x2="32" y2="56" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="8" y1="32" x2="15" y2="32" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="49" y1="32" x2="56" y2="32" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="15" y1="15" x2="20" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="44" y1="44" x2="49" y2="49" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="49" x2="20" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="44" y1="20" x2="49" y2="15" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 9: // Industry, Innovation & Infrastructure
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Top cube */}
          <path d="M32 10L42 16L32 22L22 16L32 10Z" fill="white" />
          <path d="M22 16.5L32 22.5V34L22 28V16.5Z" fill="white" opacity="0.88" />
          <path d="M42 16.5L32 22.5V34L42 28V16.5Z" fill="white" opacity="0.72" />

          {/* Bottom left cube */}
          <path d="M20 31L30 37L20 43L10 37L20 31Z" fill="white" />
          <path d="M10 37.5L20 43.5V55L10 49V37.5Z" fill="white" opacity="0.88" />
          <path d="M30 37.5L20 43.5V55L30 49V37.5Z" fill="white" opacity="0.72" />

          {/* Bottom right cube */}
          <path d="M44 31L54 37L44 43L34 37L44 31Z" fill="white" />
          <path d="M34 37.5L44 43.5V55L34 49V37.5Z" fill="white" opacity="0.88" />
          <path d="M54 37.5L44 43.5V55L54 49V37.5Z" fill="white" opacity="0.72" />
        </svg>
      );
    case 11: // Sustainable Cities & Communities
      const bg11 = color || "#FD9D24";
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Ground line */}
          <rect x="6" y="52" width="52" height="3" fill="white" rx="1.5" />
          {/* Left House */}
          <path d="M10 52V36L18 30L26 36V52H10Z" fill="white" />
          <rect x="15" y="42" width="6" height="10" fill={bg11} />
          {/* Center Tall Building */}
          <rect x="25" y="20" width="16" height="32" fill="white" />
          {/* Building windows */}
          <rect x="28" y="24" width="3.5" height="3.5" fill={bg11} />
          <rect x="34.5" y="24" width="3.5" height="3.5" fill={bg11} />
          <rect x="28" y="30.5" width="3.5" height="3.5" fill={bg11} />
          <rect x="34.5" y="30.5" width="3.5" height="3.5" fill={bg11} />
          <rect x="28" y="37" width="3.5" height="3.5" fill={bg11} />
          <rect x="34.5" y="37" width="3.5" height="3.5" fill={bg11} />
          <rect x="28" y="43.5" width="3.5" height="3.5" fill={bg11} />
          <rect x="34.5" y="43.5" width="3.5" height="3.5" fill={bg11} />
          {/* Right Building */}
          <rect x="40.5" y="29" width="13.5" height="23" fill="white" opacity="0.9" />
          <rect x="43.5" y="33" width="3" height="3" fill={bg11} />
          <rect x="48" y="33" width="3" height="3" fill={bg11} />
          <rect x="43.5" y="39" width="3" height="3" fill={bg11} />
          <rect x="48" y="39" width="3" height="3" fill={bg11} />
        </svg>
      );
    case 12: // Responsible Consumption & Production
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Infinity Loop */}
          <path 
            d="M21 23C15 23 10 27.5 10 32.5C10 37.5 15 42 21 42C26.5 42 30.5 38 33.5 34.5L28.5 29.5C26.5 32 24 34.5 21 34.5C18 34.5 16 33.5 16 32.5C16 31.5 18 30.5 21 30.5C24 30.5 27 32.5 30.5 36.5L35.5 31.5C31.5 26.5 26.5 23 21 23Z" 
            fill="white" 
          />
          <path 
            d="M43 23C37.5 23 33.5 27 30.5 30.5L35.5 35.5C37.5 33 40 30.5 43 30.5C46 30.5 48 31.5 48 32.5C48 33.5 46 34.5 43 34.5C40 34.5 37 32.5 33.5 28.5L28.5 33.5C32.5 38.5 37.5 42 43 42C49 42 54 37.5 54 32.5C54 27.5 49 23 43 23Z" 
            fill="white" 
          />
          {/* Arrowhead top left */}
          <polygon points="12,25 18,21 17,29" fill="white" />
          {/* Arrowhead bottom right */}
          <polygon points="52,39 46,43 47,35" fill="white" />
        </svg>
      );
    case 13: // Climate Action
      const bg13 = color || "#3F7E44";
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Eye Outline */}
          <path d="M6 32C14 19 23 13 32 13C41 13 50 19 58 32C50 45 41 51 32 51C23 51 14 45 6 32Z" stroke="white" strokeWidth="3" fill="none" />
          {/* Globe Center */}
          <circle cx="32" cy="32" r="11" fill="white" />
          <ellipse cx="32" cy="32" rx="5" ry="11" stroke={bg13} strokeWidth="1.8" fill="none" />
          <line x1="21" y1="32" x2="43" y2="32" stroke={bg13} strokeWidth="1.8" />
          {/* Climate action speed waves */}
          <path d="M46 18C50 21 53 26 55 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M43 13C49 17 54 23 57 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        </svg>
      );
    default:
      return null;
  }
};

const OFFICIAL_SDG_TITLES: Record<number, string> = {
  4: "QUALITY EDUCATION",
  7: "AFFORDABLE & CLEAN ENERGY",
  9: "INDUSTRY, INNOVATION & INFRASTRUCTURE",
  11: "SUSTAINABLE CITIES & COMMUNITIES",
  12: "RESPONSIBLE CONSUMPTION & PRODUCTION",
  13: "CLIMATE ACTION"
};

export const SdgIconTile: React.FC<SdgIconTileProps> = ({
  number,
  name,
  color,
  size = "md",
  className = "",
}) => {
  const displayTitle = OFFICIAL_SDG_TITLES[number] || name;

  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16 p-1.5 rounded-xl",
    md: "w-24 h-24 p-2 rounded-2xl",
    lg: "w-28 h-28 p-2.5 rounded-2xl"
  }[size];

  const numberClasses = {
    sm: "text-base font-black",
    md: "text-2xl font-black",
    lg: "text-3xl font-black"
  }[size];

  const textClasses = {
    sm: "text-[6px] leading-[7px] max-w-[40px]",
    md: "text-[7.5px] leading-[9px] max-w-[54px]",
    lg: "text-[9px] leading-[10.5px] max-w-[64px]"
  }[size];

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  }[size];

  return (
    <div 
      className={`${sizeClasses} text-white flex flex-col justify-between shadow-md shrink-0 relative overflow-hidden select-none transition-transform group-hover:scale-105 duration-300 ${className}`}
      style={{ backgroundColor: color }}
      title={`UN Sustainable Development Goal ${number}: ${name}`}
    >
      {/* Top row: Number and Official Upper Case Title */}
      <div className="flex items-start justify-between leading-none w-full gap-1">
        <span className={`${numberClasses} font-display tracking-tight leading-none shrink-0`}>
          {number}
        </span>
        <span className={`${textClasses} font-extrabold uppercase font-sans tracking-tight text-right font-display opacity-95`}>
          {displayTitle}
        </span>
      </div>

      {/* Center/Bottom: Official UN Symbol */}
      <div className="flex items-center justify-center my-auto pt-1">
        <SdgOfficialSymbol number={number} color={color} className={iconSizes} />
      </div>
    </div>
  );
};
