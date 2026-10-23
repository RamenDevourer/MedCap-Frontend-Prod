/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        paper: { DEFAULT: '#FAF6F1', 2: '#F3ECE3', 3: '#EAE1D6' },
        ink: { DEFAULT: '#1A1633', 2: '#2B2650', soft: '#5E5878', faint: '#8F89A6' },
        line: '#E4DACE',
        brand: {
          50: '#FDF0F5',
          100: '#FBDDE8',
          200: '#F7B8CF',
          400: '#EE5A92',
          500: '#E5357A',
          600: '#C81F63',
          700: '#9F1850',
        },
        violet: { 100: '#EDE5FC', 500: '#7B3FE4', 700: '#5426A8' },
        sage: { 50: '#ECF6F0', 500: '#2F8F6A', 700: '#1F6A4D' },
        amber: { 50: '#FDF3E3', 500: '#C9761A', 700: '#93520D' },
        rose: { 50: '#FCEBEC', 500: '#C8323A', 700: '#992129' },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Figtree Variable"', 'Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(26,22,51,0.04), 0 8px 24px -12px rgba(26,22,51,0.12)',
        lift: '0 2px 0 rgba(26,22,51,0.04), 0 24px 48px -20px rgba(26,22,51,0.28)',
        ring: '0 0 0 4px rgba(229,53,122,0.16)',
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        draw: { to: { strokeDashoffset: '0' } },
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.35' },
        },
        sweep: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        draw: 'draw 2.4s cubic-bezier(.65,0,.35,1) forwards',
        rise: 'rise .7s cubic-bezier(.2,.8,.2,1) both',
        fade: 'fade .3s ease-out both',
        pop: 'pop .35s cubic-bezier(.2,.8,.2,1) both',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        sweep: 'sweep 1.6s cubic-bezier(.65,0,.35,1) infinite',
      },
    },
  },
  plugins: [],
};
