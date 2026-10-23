// A single ECG trace that draws itself on mount. The signature motif of the site.
const PATH =
  'M0 60 H170 l10 -6 l8 6 h22 l8 -44 l10 84 l9 -52 l7 12 h40 c12 0 16 -14 26 -14 s14 14 26 14 H520 l10 -6 l8 6 h22 l8 -44 l10 84 l9 -52 l7 12 h40 c12 0 16 -14 26 -14 s14 14 26 14 H900';

const EcgLine = ({ className = '', stroke = 'currentColor', width = 2.25, animate = true, delay = 0 }) => (
  <svg viewBox="0 0 900 120" preserveAspectRatio="none" className={className} aria-hidden="true">
    <path
      d={PATH}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      pathLength="1"
      style={
        animate
          ? { strokeDasharray: 1, strokeDashoffset: 1, animationDelay: `${delay}ms` }
          : undefined
      }
      className={animate ? 'animate-draw' : ''}
    />
  </svg>
);

export default EcgLine;
