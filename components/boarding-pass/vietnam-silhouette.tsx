export function VietnamSilhouette({ accentColor, className }: { accentColor: string; className?: string }) {
  return (
    <svg className={className} fill={accentColor} viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M45 5 C52 10, 60 15, 62 25 C63 32, 55 40, 48 48 C42 55, 45 68, 52 75 C60 83, 68 95, 65 110 C62 120, 50 135, 42 145 C38 140, 32 135, 34 125 C36 115, 48 105, 45 92 C42 80, 35 70, 34 55 C33 40, 38 25, 45 5 Z"
        opacity="0.25"
      />
      <path d="M48 30 Q 62 70 46 125" fill="none" stroke={accentColor} strokeDasharray="3,3" strokeWidth="1.5" />
      <circle className="animate-pulse" cx="48" cy="30" fill={accentColor} r="3.5" />
      <circle cx="52" cy="65" fill="#FB7185" r="2.5" />
      <circle cx="58" cy="85" fill="#38BDF8" r="2.5" />
      <circle className="animate-pulse" cx="46" cy="125" fill={accentColor} r="3.5" />
    </svg>
  );
}
