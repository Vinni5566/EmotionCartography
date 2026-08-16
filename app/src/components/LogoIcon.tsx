export function LogoIcon({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5" />
      
      {/* Compass Needles */}
      <polygon points="50,5 55,45 50,95 45,45" fill="currentColor" opacity="0.8" />
      <polygon points="5,50 45,45 95,50 45,55" fill="currentColor" opacity="0.8" />
      
      {/* Diagonal compass marks */}
      <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

      {/* Blue Winding River (Veins) through center */}
      <path
        d="M25 25 C30 40, 40 45, 48 50 C55 55, 52 65, 55 75 C58 85, 65 80, 70 85"
        fill="none"
        stroke="#70c8c3"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0px 0px 4px rgba(112, 200, 195, 0.6))' }}
      />
      <path
        d="M48 50 C48 60, 42 65, 45 75"
        fill="none"
        stroke="#70c8c3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0px 0px 4px rgba(112, 200, 195, 0.6))' }}
      />
      <path
        d="M55 75 C60 72, 63 68, 68 70"
        fill="none"
        stroke="#70c8c3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0px 0px 4px rgba(112, 200, 195, 0.6))' }}
      />
    </svg>
  );
}
