import { Link } from 'react-router-dom';
import { Upload, ScanText, ClipboardCheck, Salad, Footprints, ShieldAlert, ArrowRight, Lock, History } from 'lucide-react';
import aboutImg from '../../assets/aboutIMG.png';
import EcgLine from '../ui/EcgLine';

const REPORT_TYPES = [
  'Complete blood count',
  'Lipid profile',
  'Blood glucose & HbA1c',
  'Thyroid panel',
  'Liver function',
  'Kidney function',
  'Vitamin levels',
  'Annual check-ups',
];

export const ReportStrip = () => (
  <section className="border-y border-line bg-paper-2/70">
    <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-10">
      <p className="eyebrow shrink-0">Works with reports like</p>
      <ul className="flex flex-wrap gap-2">
        {REPORT_TYPES.map((t) => (
          <li key={t} className="rounded-full border border-line bg-white px-3 py-1 text-sm text-ink-soft">
            {t}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const STEPS = [
  {
    icon: Upload,
    title: 'Upload your report',
    body: 'Drop in a PDF from your lab and add any vitals you know — height, weight, blood pressure, medications.',
  },
  {
    icon: ScanText,
    title: 'MedCap reads it',
    body: 'The AI pulls the values out of your report, combines them with your profile, and looks at the full picture.',
  },
  {
    icon: ClipboardCheck,
    title: 'Get your plan',
    body: 'A plain-language summary plus a diet, lifestyle and precaution plan — saved to your dashboard for next time.',
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-20 py-24 md:py-32">
    <div className="container">
      <div className="max-w-2xl">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] md:text-5xl">
          From PDF to plan in three steps.
        </h2>
      </div>

      <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="group relative bg-paper p-8 transition-colors hover:bg-white md:p-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-ink-faint">0{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white">
                <Icon size={20} />
              </span>
            </div>
            <h3 className="mt-8 text-2xl font-medium md:mt-14">{title}</h3>
            <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const OUTPUTS = [
  {
    icon: Salad,
    title: 'Diet plan',
    body: 'Foods to eat and to avoid — each with the reason — plus a sample day of meals and a calorie target.',
    tone: 'bg-sage-50 text-sage-700',
  },
  {
    icon: Footprints,
    title: 'Lifestyle plan',
    body: 'Exercise type, frequency and duration, everyday activities, and relaxation techniques that fit.',
    tone: 'bg-violet-100 text-violet-700',
  },
  {
    icon: ShieldAlert,
    title: 'Precautions',
    body: 'Conditions your results suggest you may be at risk of, and the practical steps to lower that risk.',
    tone: 'bg-amber-50 text-amber-700',
  },
];

export const WhatYouGet = () => (
  <section className="pb-24 md:pb-32">
    <div className="container">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] md:text-5xl">
            One report in. A whole plan out.
          </h2>
        </div>
        <p className="max-w-sm text-pretty text-ink-soft">
          Every analysis is saved, so you can compare reports over time from your dashboard.
        </p>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {/* Feature card: summary */}
        <article className="relative overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-10 lg:row-span-2">
          <p className="eyebrow text-paper/50">The headline</p>
          <h3 className="mt-4 text-3xl font-medium leading-tight md:text-4xl">
            A summary of your current condition — <em className="italic text-brand-200">without the jargon.</em>
          </h3>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-paper/65">
            The numbers on your report are translated into a few clear sentences: what looks healthy, what is borderline,
            and what deserves a conversation with your doctor.
          </p>
          <div className="mt-10 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/5 p-4">
              <History size={18} className="text-brand-200" /> Full analysis history
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/5 p-4">
              <Lock size={18} className="text-brand-200" /> Private to your account
            </div>
          </div>
          <EcgLine className="mt-12 h-20 w-[140%] text-brand-500" width={2} animate={false} />
        </article>

        {OUTPUTS.map(({ icon: Icon, title, body, tone }) => (
          <article key={title} className="card group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
              <Icon size={22} />
            </span>
            <h3 className="mt-6 text-2xl font-medium">{title}</h3>
            <p className="mt-2.5 text-pretty leading-relaxed text-ink-soft">{body}</p>
          </article>
        ))}

        <article className="card flex flex-col justify-between gap-6 bg-brand-50 p-8">
          <p className="font-display text-xl leading-snug text-ink">
            &ldquo;Should I be worried about this number?&rdquo;
          </p>
          <p className="text-sm text-ink-soft">The question MedCap is built to help you answer — before your next appointment.</p>
        </article>
      </div>
    </div>
  </section>
);

export const About = () => (
  <section className="bg-paper-2/70 py-24 md:py-32">
    <div className="container grid items-center gap-14 lg:grid-cols-2">
      <div className="relative order-2 lg:order-1">
        <div className="overflow-hidden rounded-[2rem] bg-[#FFC9E8]">
          <img src={aboutImg} alt="Illustration of a clinician beside lab equipment" className="mx-auto w-full max-w-md" />
        </div>
        <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-line bg-white p-5 shadow-lift md:left-auto md:right-8 md:w-72">
          <p className="eyebrow">Our principle</p>
          <p className="mt-2 font-display text-lg leading-snug">Explain clearly. Never replace your doctor.</p>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <p className="eyebrow">Why MedCap</p>
        <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] md:text-5xl">
          Built for the moment the lab emails your results.
        </h2>
        <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-ink-soft">
          <p>
            Medical reports are written for clinicians. Most of us open them, see a column of numbers and a few values in
            bold, and start searching the internet.
          </p>
          <p>
            MedCap gives you a calmer starting point: a clear explanation of your results and practical, everyday steps —
            so you walk into your next appointment informed and with better questions.
          </p>
          <p>
            It&apos;s built by two college students who wanted to use AI to help people take charge of their own
            wellbeing.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const FinalCta = ({ loggedIn }) => (
  <section className="py-24 md:py-28">
    <div className="container">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-500 px-8 py-14 text-white md:px-16 md:py-20">
        <EcgLine className="pointer-events-none absolute bottom-8 right-0 hidden h-24 w-1/2 text-white/30 md:block" animate={false} width={2} />
        <div className="relative max-w-2xl">
          <h2 className="text-balance text-4xl font-medium leading-[1.05] md:text-6xl">
            Ready to read your report <em className="italic">differently?</em>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/85">
            {loggedIn
              ? 'Upload your latest report and get an updated plan in a minute.'
              : 'Create an account, upload a PDF, and get your plan in a minute.'}
          </p>
          <Link
            to={loggedIn ? '/medicalreport' : '/signup'}
            className="btn mt-9 bg-white px-6 py-3 text-base text-brand-700 hover:bg-paper hover:shadow-lift"
          >
            {loggedIn ? 'Analyse a report' : 'Create your account'} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);
