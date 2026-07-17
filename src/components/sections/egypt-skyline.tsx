"use client";

export function EgyptSkyline() {
  return (
    <svg
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 h-full w-full"
    >
      {/* Layer 1: farthest, large pyramids, very low opacity gold */}
      <g data-skyline-layer="1" className="opacity-[0.07]">
        <polygon points="60,340 260,140 460,340" fill="#d4af37" />
        <polygon points="380,340 560,190 740,340" fill="#d4af37" />
        <polygon points="900,340 1120,120 1340,340" fill="#d4af37" />
      </g>

      {/* Layer 2: nearer, smaller pyramids + Cairo Tower silhouette */}
      <g data-skyline-layer="2" className="opacity-[0.14]">
        <polygon points="120,340 230,220 340,340" fill="#d4af37" />
        <polygon points="260,340 340,240 420,340" fill="#d4af37" />
        <polygon points="980,340 1070,230 1160,340" fill="#d4af37" />

        {/* Cairo Tower (abstract lattice silhouette) */}
        <g transform="translate(700,150)">
          <path
            d="M0,190 L10,60 Q20,20 0,0 Q-20,20 -10,60 L0,190"
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
          />
          <ellipse cx="0" cy="40" rx="22" ry="8" fill="none" stroke="#d4af37" strokeWidth="1.5" />
          <ellipse cx="0" cy="70" rx="16" ry="6" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        </g>

        {/* minarets */}
        <g stroke="#d4af37" strokeWidth="1.5" fill="none">
          <path d="M180,340 L180,230 M170,230 Q180,210 190,230" />
          <path d="M1230,340 L1230,250 M1222,250 Q1230,232 1238,250" />
        </g>
      </g>

      {/* Layer 3: nearest, abstract dune/Nile curve in gold gradient */}
      <g data-skyline-layer="3">
        <defs>
          <linearGradient id="nile-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#e0c15c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d="M0,340 Q240,300 480,335 T960,330 T1440,340 L1440,360 L0,360 Z"
          fill="url(#nile-gradient)"
        />
      </g>
    </svg>
  );
}
