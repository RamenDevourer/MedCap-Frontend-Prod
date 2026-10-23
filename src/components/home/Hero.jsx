import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, FileText, Sparkles } from 'lucide-react';
import Heart from '../../assets/heart.png';
import EcgLine from '../ui/EcgLine';

// Illustrative preview of what an analysis looks like. Clearly labelled as a sample.
const SamplePanel = () => (
  <div className="relative mx-auto w-full max-w-[460px]">
    <div className="absolute -right-4 -top-14 z-20 w-28 animate-rise md:-right-12 md:-top-16 md:w-36" style={{ animationDelay: '450ms' }}>
      <img src={Heart} alt="" className="w-full drop-shadow-[0_24px_30px_rgba(200,31,99,0.25)]" />
    </div>

    <div className="card relative z-10 animate-rise overflow-hidden p-0" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulseDot rounded-full bg-brand-500" />
          <span className="eyebrow">Sample analysis</span>
          <span className="hidden font-mono text-[11px] text-ink-faint sm:inline">· lipid_panel.pdf</span>
        </div>
      </div>

      <div className="chart-grid relative h-28 border-b border-line bg-paper/60">
        <EcgLine className="absolute inset-0 h-full w-full text-brand-500" delay={600} />
      </div>

      <div className="space-y-4 p-5 pb-12">
        <div>
          <p className="eyebrow">Summary</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
            Cholesterol is a little above the healthy range. Blood sugar and blood pressure look normal.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'LDL', v: '142', u: 'mg/dL', tone: 'text-amber-700 bg-amber-50' },
            { k: 'Glucose', v: '91', u: 'mg/dL', tone: 'text-sage-700 bg-sage-50' },
            { k: 'BP', v: '118/76', u: 'mmHg', tone: 'text-sage-700 bg-sage-50' },
          ].map((m) => (
            <div key={m.k} className={`rounded-xl px-3 py-2.5 ${m.tone}`}>
              <p className="font-mono text-[10px] uppercase tracking-wider opacity-80">{m.k}</p>
              <p className="mt-0.5 font-display text-lg font-semibold leading-tight">{m.v}</p>
              <p className="font-mono text-[10px] opacity-70">{m.u}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div
      className="absolute -bottom-7 -left-3 z-20 flex animate-rise items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lift md:-left-10"
      style={{ animationDelay: '700ms' }}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-white">
        <Sparkles size={16} />
      </span>
      <div>
        <p className="text-sm font-semibold">Plan ready</p>
        <p className="text-xs text-ink-soft">Diet · Lifestyle · Precautions</p>
      </div>
    </div>
  </div>
);

const Hero = ({ loggedIn, user }) => (
  <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
    {/* Ambient wash */}
    <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-200/45 blur-3xl" />
    <div className="pointer-events-none absolute -left-32 top-64 h-[360px] w-[360px] rounded-full bg-violet-100/80 blur-3xl" />

    <div className="container relative grid items-center gap-16 pb-24 pt-10 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-32">
      <div>
        <div className="inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-white/70 py-1 pl-1 pr-3 text-sm">
          <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-paper">AI</span>
          <span className="text-ink-soft">
            {loggedIn ? `Welcome back${user?.firstName ? `, ${user.firstName}` : ''}` : 'Medical report analysis'}
          </span>
        </div>

        <h1
          className="mt-6 animate-rise text-balance text-[44px] font-medium leading-[0.98] sm:text-6xl lg:text-[76px]"
          style={{ animationDelay: '80ms' }}
        >
          Your lab report, <em className="font-normal italic text-brand-500">finally</em> in plain language.
        </h1>

        <p
          className="mt-6 max-w-xl animate-rise text-pretty text-lg leading-relaxed text-ink-soft md:text-xl"
          style={{ animationDelay: '160ms' }}
        >
          Upload a PDF and a few vitals. MedCap reads it, explains what the numbers mean, and builds a personal plan for
          what to eat, how to move and what to watch for.
        </p>

        <div className="mt-9 flex animate-rise flex-wrap items-center gap-3" style={{ animationDelay: '240ms' }}>
          {loggedIn ? (
            <>
              <Link to="/medicalreport" className="btn-brand px-6 py-3 text-base">
                <FileText size={18} /> Analyse a new report
              </Link>
              <Link to="/healthcareplan" className="btn-ghost px-6 py-3 text-base">
                View my plan
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn-brand px-6 py-3 text-base">
                Get started <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-ghost px-6 py-3 text-base">
                How it works <ArrowDown size={16} />
              </a>
            </>
          )}
        </div>

        {!loggedIn && (
          <p className="mt-5 animate-rise text-sm text-ink-faint" style={{ animationDelay: '320ms' }}>
            Already have an account? <Link to="/login" className="link">Log in</Link> to upload a report.
          </p>
        )}
      </div>

      <SamplePanel />
    </div>

    {/* Full-bleed trace under the hero */}
    <EcgLine className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-ink/10" animate={false} width={1.5} />
  </section>
);

export default Hero;
