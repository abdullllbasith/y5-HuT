import React from 'react';

interface DeviceGraphicProps {
  deviceType: 'phone' | 'earbuds' | 'charger' | 'case' | 'cable' | 'smartwatch' | 'powerbank';
  colorHex?: string;
  className?: string;
  brand?: string;
}

export const DeviceGraphic: React.FC<DeviceGraphicProps> = ({
  deviceType,
  colorHex = '#1E293B',
  className = 'w-full h-full',
  brand,
}) => {
  if (deviceType === 'phone') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 200 380"
          className="w-full max-h-56 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phone Outer Chassis / Titanium Frame */}
          <rect
            x="10"
            y="10"
            width="180"
            height="360"
            rx="36"
            fill={colorHex}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Side Antenna Bands */}
          <line x1="9" y1="60" x2="11" y2="60" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="9" y1="320" x2="11" y2="320" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="189" y1="60" x2="191" y2="60" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="189" y1="320" x2="191" y2="320" stroke="#CBD5E1" strokeWidth="2" />

          {/* OLED Screen Bezel */}
          <rect
            x="16"
            y="16"
            width="168"
            height="348"
            rx="30"
            fill="#090D16"
          />

          {/* Screen Content Graphic */}
          <defs>
            <linearGradient id={`screenGrad-${colorHex.replace('#', '')}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <rect
            x="18"
            y="18"
            width="164"
            height="344"
            rx="28"
            fill={`url(#screenGrad-${colorHex.replace('#', '')})`}
          />

          {/* Glass Specular Sheen Reflection */}
          <path
            d="M 18 18 L 140 18 L 40 360 L 18 360 Z"
            fill="url(#sheen)"
          />

          {/* Dynamic Island / Punch Hole */}
          <rect
            x="76"
            y="26"
            width="48"
            height="14"
            rx="7"
            fill="#000000"
          />
          <circle cx="112" cy="33" r="3" fill="#1E293B" />

          {/* Time & Lockscreen */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize="30"
            fontFamily="system-ui, sans-serif"
            fontWeight="300"
            letterSpacing="-1"
          >
            09:41
          </text>
          <text
            x="100"
            y="114"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="9"
            fontFamily="system-ui, sans-serif"
            fontWeight="500"
          >
            y5Hut.lk 5G · Colombo
          </text>

          {/* Brand mark subtle */}
          <text
            x="100"
            y="320"
            textAnchor="middle"
            fill="#64748B"
            fontSize="8"
            fontFamily="sans-serif"
            fontWeight="bold"
            letterSpacing="1"
          >
            {brand || 'y5Hut.lk'}
          </text>

          {/* Home Bar */}
          <rect
            x="75"
            y="348"
            width="50"
            height="3"
            rx="1.5"
            fill="#94A3B8"
          />
        </svg>
      </div>
    );
  }

  if (deviceType === 'smartwatch') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 200 280"
          className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Watch Straps */}
          <rect x="75" y="10" width="50" height="60" rx="6" fill="#334155" />
          <rect x="75" y="210" width="50" height="60" rx="6" fill="#334155" />

          {/* Watch Case */}
          <rect
            x="50"
            y="60"
            width="100"
            height="120"
            rx="28"
            fill={colorHex}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Digital Crown */}
          <rect x="151" y="85" width="6" height="24" rx="2" fill="#E2E8F0" />
          <rect x="151" y="125" width="4" height="20" rx="1.5" fill="#64748B" />

          {/* AMOLED Display */}
          <rect x="56" y="66" width="88" height="108" rx="22" fill="#090D16" />

          {/* Activity Rings */}
          <circle cx="100" cy="115" r="32" stroke="#E11D48" strokeWidth="4" strokeDasharray="160 40" />
          <circle cx="100" cy="115" r="24" stroke="#10B981" strokeWidth="4" strokeDasharray="120 30" />
          <circle cx="100" cy="115" r="16" stroke="#0EA5E9" strokeWidth="4" strokeDasharray="80 20" />

          <text
            x="100"
            y="119"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            10:09
          </text>
        </svg>
      </div>
    );
  }

  if (deviceType === 'powerbank') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 220 220"
          className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Anker/Baseus Power Bank Brick */}
          <rect
            x="50"
            y="30"
            width="120"
            height="160"
            rx="16"
            fill={colorHex}
            stroke="#64748B"
            strokeWidth="1.5"
          />
          {/* Top Panel with USB-C and USB-A Ports */}
          <rect x="65" y="38" width="90" height="20" rx="6" fill="#0F172A" />
          <rect x="75" y="44" width="14" height="8" rx="2" fill="#38BDF8" />
          <rect x="100" y="44" width="14" height="8" rx="2" fill="#38BDF8" />
          <rect x="125" y="44" width="20" height="8" rx="2" fill="#94A3B8" />

          {/* Smart Digital LED Display Screen */}
          <rect x="70" y="75" width="80" height="34" rx="6" fill="#020617" stroke="#334155" />
          <text
            x="110"
            y="98"
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="16"
            fontFamily="monospace"
            fontWeight="bold"
          >
            98%
          </text>

          {/* Specs & Capacity Label */}
          <text
            x="110"
            y="145"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            24,000 mAh
          </text>
          <text
            x="110"
            y="160"
            textAnchor="middle"
            fill="#64748B"
            fontSize="8"
            fontFamily="sans-serif"
          >
            140W GaN Fast Charge
          </text>
        </svg>
      </div>
    );
  }

  if (deviceType === 'earbuds') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 240 220"
          className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Open Charging Case Base */}
          <rect
            x="40"
            y="85"
            width="160"
            height="110"
            rx="40"
            fill={colorHex}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Inner Cavity */}
          <path
            d="M 50 85 C 50 65 190 65 190 85 Z"
            fill="#0F172A"
          />
          {/* Case LED indicator */}
          <circle cx="120" cy="140" r="3.5" fill="#10B981" />

          {/* Left Earbud */}
          <g transform="translate(68, 40)">
            <ellipse cx="20" cy="20" rx="15" ry="17" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <rect x="16" y="32" width="7" height="35" rx="3.5" fill="#334155" />
            <ellipse cx="10" cy="20" rx="8" ry="12" fill="#020617" />
            <circle cx="20" cy="20" r="4" fill="#E11D48" opacity="0.6" />
          </g>

          {/* Right Earbud */}
          <g transform="translate(132, 40)">
            <ellipse cx="20" cy="20" rx="15" ry="17" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <rect x="17" y="32" width="7" height="35" rx="3.5" fill="#334155" />
            <ellipse cx="30" cy="20" rx="8" ry="12" fill="#020617" />
            <circle cx="20" cy="20" r="4" fill="#E11D48" opacity="0.6" />
          </g>

          <text
            x="120"
            y="170"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="8"
            letterSpacing="1"
            fontWeight="600"
          >
            Hi-Res Wireless ANC
          </text>
        </svg>
      </div>
    );
  }

  if (deviceType === 'charger') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 240 240"
          className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Stand Pad */}
          <ellipse cx="120" cy="200" rx="80" ry="24" fill="#334155" stroke="#64748B" strokeWidth="1" />
          <ellipse cx="120" cy="196" rx="76" ry="20" fill={colorHex} />

          {/* Stand Arm */}
          <path d="M 116 195 L 116 100 L 124 100 L 124 195 Z" fill="#94A3B8" />

          {/* Magnetic Charging Puck */}
          <circle cx="120" cy="90" r="48" fill={colorHex} stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="120" cy="90" r="36" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="14 4" />
          <circle cx="120" cy="90" r="14" fill="#0F172A" />

          <path
            d="M 122 80 L 114 91 L 120 91 L 118 100 L 126 89 L 120 89 Z"
            fill="#FFFFFF"
          />

          <text
            x="120"
            y="218"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="8"
            fontWeight="600"
          >
            15W Qi2 / MagSafe Stand
          </text>
        </svg>
      </div>
    );
  }

  if (deviceType === 'case') {
    return (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <svg
          viewBox="0 0 200 360"
          className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Case Outer Contour */}
          <rect
            x="20"
            y="15"
            width="160"
            height="330"
            rx="32"
            fill={colorHex}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Bumpers */}
          <circle cx="36" cy="31" r="10" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="164" cy="31" r="10" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="36" cy="329" r="10" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="164" cy="329" r="10" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Camera Bump */}
          <rect
            x="35"
            y="35"
            width="60"
            height="68"
            rx="16"
            fill="#0F172A"
            stroke="#64748B"
            strokeWidth="2"
          />
          <circle cx="52" cy="52" r="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="78" cy="52" r="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="52" cy="78" r="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="78" cy="78" r="4" fill="#E11D48" />

          {/* MagSafe Ring */}
          <circle cx="100" cy="180" r="38" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="16 3" />
          <rect x="98" y="222" width="4" height="14" rx="2" fill="#FFFFFF" fillOpacity="0.4" />

          <text
            x="100"
            y="310"
            textAnchor="middle"
            fill="#FFFFFF"
            fillOpacity="0.6"
            fontSize="8"
            letterSpacing="1"
          >
            AERO SHIELD MIL-SPEC
          </text>
        </svg>
      </div>
    );
  }

  // Cable
  return (
    <div className={`relative flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 220 220"
        className="w-full max-h-52 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 40 160 C 40 70 180 70 180 160 C 180 200 80 200 80 130 C 80 80 160 80 160 120"
          stroke={colorHex}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g transform="translate(30, 155)">
          <rect x="0" y="0" width="20" height="34" rx="4" fill="#1E293B" stroke="#64748B" />
          <rect x="4" y="34" width="12" height="18" rx="2" fill="#CBD5E1" />
          <line x1="2" y1="17" x2="18" y2="17" stroke="#E11D48" strokeWidth="2" />
        </g>
        <g transform="translate(150, 115)">
          <rect x="0" y="0" width="20" height="34" rx="4" fill="#1E293B" stroke="#64748B" />
          <rect x="4" y="34" width="12" height="18" rx="2" fill="#CBD5E1" />
          <line x1="2" y1="17" x2="18" y2="17" stroke="#E11D48" strokeWidth="2" />
        </g>
        <text
          x="110"
          y="110"
          textAnchor="middle"
          fill="#64748B"
          fontSize="9"
          fontWeight="600"
        >
          240W USB-C 40Gbps
        </text>
      </svg>
    </div>
  );
};
