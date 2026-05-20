const WATERMARK_TILE = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150" viewBox="0 0 220 150">
  <g transform="translate(62 2) scale(0.72)">
    <g fill="none" stroke="#0089D0" stroke-width="2.5" stroke-linejoin="round" opacity="0.09">
      <path d="M52 12 H98 Q110 12 110 24 V48 Q110 60 98 60 H72 L58 76 L64 58 H52 Q40 58 40 46 V24 Q40 12 52 12 Z"/>
      <circle cx="38" cy="38" r="28"/>
      <path d="M24 58 L16 74 L32 62 Z"/>
    </g>
    <g fill="#0089D0" opacity="0.06">
      <circle cx="72" cy="36" r="2.5"/>
      <circle cx="82" cy="36" r="2.5"/>
      <circle cx="92" cy="36" r="2.5"/>
      <circle cx="30" cy="36" r="2.5"/>
      <circle cx="38" cy="36" r="2.5"/>
      <circle cx="46" cy="36" r="2.5"/>
    </g>
  </g>
  <text x="110" y="96" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#0089D0" opacity="0.07">VAIT</text>
  <text x="110" y="116" text-anchor="middle" font-family="Inter, sans-serif" font-size="7" fill="#0089D0" opacity="0.055" letter-spacing="0.45em">FIND YOUR VIBE</text>
</svg>`);

const WATERMARK_URL = `url("data:image/svg+xml,${WATERMARK_TILE}")`;

/** Subtle repeating Vait logo + slogan wallpaper for page backgrounds */
export function BrandWatermarkBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] -rotate-[28deg]"
        style={{
          backgroundImage: WATERMARK_URL,
          backgroundSize: "220px 150px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
