import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Logo from './Logo';
import EcgLine from './EcgLine';
import Heart from '../../assets/heart.png';

const POINTS = [
  'A plain-language summary of your results',
  'A diet, lifestyle and precaution plan',
  'Every analysis saved to your dashboard',
];

// Split-screen frame for login and signup.
const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => (
  <div className="grain grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside className="relative hidden overflow-hidden bg-ink text-paper lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
      <Logo inverted />

      <div className="relative">
        <img src={Heart} alt="" className="mb-10 w-36 animate-rise drop-shadow-[0_30px_40px_rgba(229,53,122,0.35)]" />
        <h2 className="max-w-md text-balance text-4xl font-medium leading-[1.08] xl:text-5xl">
          Understand your health, <em className="italic text-brand-200">one report at a time.</em>
        </h2>
        <ul className="mt-8 space-y-3">
          {POINTS.map((p) => (
            <li key={p} className="flex items-center gap-3 text-paper/75">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/20 text-brand-200">
                <Check size={14} strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <EcgLine className="mb-6 h-16 w-full text-brand-500" width={2} />
        <p className="text-sm text-paper/45">AI-generated information, not medical advice.</p>
      </div>
    </aside>

    <section className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-start justify-center px-6 pb-16 pt-6 md:px-10 lg:items-center">
        <div className="w-full max-w-[520px] animate-rise">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-balance text-4xl font-medium leading-[1.05] md:text-[44px]">{title}</h1>
          {subtitle && <p className="mt-3 text-lg text-ink-soft">{subtitle}</p>}
          <div className="mt-9">{children}</div>
          {footer && <div className="mt-8 border-t border-line pt-6 text-[15px] text-ink-soft">{footer}</div>}
        </div>
      </div>
    </section>
  </div>
);

export const FormAlert = ({ tone = 'error', children }) => (
  <div
    role="alert"
    className={`mb-6 animate-fade rounded-xl border px-4 py-3 text-sm font-medium ${
      tone === 'error' ? 'border-rose-500/25 bg-rose-50 text-rose-700' : 'border-sage-500/25 bg-sage-50 text-sage-700'
    }`}
  >
    {children}
  </div>
);

export default AuthLayout;
