import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Salad, Ban, UtensilsCrossed, Flame, Droplets, Dumbbell, Footprints, Timer, Sparkles, Brain,
  ShieldAlert, ShieldCheck, FilePlus2, LayoutDashboard, CheckCircle2, FileSearch,
} from 'lucide-react';
import serverUrl from '../components/server_url';
import LoadingPopup from '../components/LoadingPopup';
import useRedirectCountdown from '../lib/useRedirectCountdown';
import PageShell, { PageIntro } from '../components/ui/PageShell';
import EcgLine from '../components/ui/EcgLine';
import RichValue from '../components/ui/RichValue';
import { asText } from '../utils/asText';
import { formatDate } from '../utils/utils';

const SectionHead = ({ id, eyebrow, title, children }) => (
  <div id={id} className="mb-6 flex scroll-mt-28 flex-col gap-2 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-medium md:text-4xl">{title}</h2>
    </div>
    {children && <p className="max-w-sm text-sm text-ink-soft">{children}</p>}
  </div>
);

const FoodList = ({ title, icon: Icon, items, tone }) => (
  <div className="card overflow-hidden">
    <div className={`flex items-center gap-3 px-6 py-4 ${tone.head}`}>
      <Icon size={20} />
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <span className="ml-auto font-mono text-xs opacity-70">{items.length}</span>
    </div>
    {items.length ? (
      <ul className="divide-y divide-line">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 px-6 py-4">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
            <div>
              <p className="font-semibold">{item.title}</p>
              {item.description && <p className="mt-0.5 text-pretty text-sm leading-relaxed text-ink-soft">{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="px-6 py-5 text-sm text-ink-faint">Nothing listed in this analysis.</p>
    )}
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="card flex items-start gap-4 p-5">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
      <Icon size={20} />
    </span>
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-pretty font-display text-lg leading-snug">{value || 'Not provided'}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="container grid min-h-[60vh] place-items-center py-20">
    <div className="card max-w-lg p-10 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <FileSearch size={28} />
      </span>
      <h1 className="mt-6 text-3xl font-medium">No health plan yet</h1>
      <p className="mt-3 text-ink-soft">
        Upload your first medical report and MedCap will build a diet, lifestyle and precaution plan for you.
      </p>
      <Link to="/medicalreport" className="btn-brand mt-8 px-6 py-3">
        <FilePlus2 size={18} /> Analyse a report
      </Link>
    </div>
  </div>
);

const HealthPlanDashboard = () => {
  const [latestAnalysis, setLatestAnalysis] = useState({});
  const [latestDate, setLatestDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Loading your plan…');
  const navigate = useNavigate();
  const { secondsLeft, redirecting, start: startRedirect, goNow } = useRedirectCountdown();

  useEffect(() => {
    const fetchMedicalReports = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${serverUrl}/api/auth/secure`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const reports = response.data.medicalReports || [];

        if (!reports.length) {
          setEmpty(true);
          setLoading(false);
          return;
        }

        const latestReport = reports.reduce((latest, report) =>
          new Date(report.createdAt) > new Date(latest.createdAt) ? report : latest
        );

        setLatestAnalysis(JSON.parse(latestReport.analysis));
        setLatestDate(latestReport.createdAt);
        setLoading(false);
      } catch (error) {
        setIsError(true);
        setLoaderMessage('Something went wrong loading your plan.');
        console.error('Error fetching medical reports:', error);
        startRedirect('/');
      }
    };

    fetchMedicalReports();
  }, [navigate, startRedirect]);

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-[60vh]" />
        <LoadingPopup
          error={isError}
          message={loaderMessage}
          detail={redirecting ? `Taking you back to the home page in ${secondsLeft}…` : undefined}
          onClose={isError ? goNow : undefined}
          closeLabel="Go home now"
        />
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <EmptyState />
      </PageShell>
    );
  }

  const diet = latestAnalysis['Diet Plan'] || {};
  const lifestyle = latestAnalysis['Lifestyle Plan'] || {};
  const precaution = latestAnalysis['Precaution Plan'] || {};

  const eatFoods = (diet.Eat || []).map((f) => ({ title: f.Food, description: f.Benefit }));
  const avoidFoods = (diet.Avoid || []).map((f) => ({ title: f.Food, description: f.Reason }));
  const exampleDietPlan = Object.entries(diet['Example Diet Plan'] || {});
  const calories = diet['Daily Calorie Intake'] || {};
  const exercises = lifestyle.Exercise || [];
  const dailyActivities = lifestyle['Daily Physical Activities'] || [];

  const tips = [
    { icon: Timer, label: 'Recommended time', value: asText(lifestyle['Minimum Times']) },
    { icon: Sparkles, label: 'Skincare', value: asText(lifestyle.Skincare) },
    { icon: Brain, label: 'Meditation & relaxation', value: asText(lifestyle['Meditation and Relaxation Techniques']) },
  ];

  const jump = [
    { id: 'diet', label: 'Diet' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'precautions', label: 'Precautions' },
  ];

  return (
    <PageShell>
      <div className="container py-10 md:py-14">
        <PageIntro
          eyebrow={`Health plan${latestDate ? ` · Updated ${formatDate(latestDate)}` : ''}`}
          title="Here's what your latest report says."
          actions={
            <>
              <Link to="/dashboard" className="btn-ghost"><LayoutDashboard size={16} /> History</Link>
              <Link to="/medicalreport" className="btn-primary"><FilePlus2 size={16} /> New report</Link>
            </>
          }
        />

        {/* Summary */}
        <section className="relative mt-10 overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <p className="eyebrow relative text-paper/50">Summary of current condition</p>
          <div className="relative mt-5 max-w-3xl text-pretty font-display text-xl font-light leading-snug sm:text-2xl md:text-[32px] md:leading-[1.3]">
            <RichValue value={latestAnalysis['Summary of Current Condition']} />
          </div>
          <EcgLine className="relative mt-10 h-16 w-full text-brand-500" width={2} />
        </section>

        {/* Jump links */}
        <nav className="sticky top-[68px] z-20 -mx-5 mt-8 flex gap-2 overflow-x-auto bg-paper/85 px-5 py-3 backdrop-blur md:mx-0 md:rounded-full md:border md:border-line md:px-2 md:py-2">
          {jump.map((j) => (
            <a key={j.id} href={`#${j.id}`} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-ink">
              {j.label}
            </a>
          ))}
        </nav>

        {/* Diet */}
        <section className="mt-12">
          <SectionHead id="diet" eyebrow="01 — Diet plan" title="What to eat, and what to skip." />
          <div className="grid gap-4 lg:grid-cols-2">
            <FoodList title="Foods to eat" icon={Salad} items={eatFoods} tone={{ head: 'bg-sage-50 text-sage-700', dot: 'bg-sage-500' }} />
            <FoodList title="Foods to avoid" icon={Ban} items={avoidFoods} tone={{ head: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' }} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="card p-6">
              <div className="mb-5 flex items-center gap-3">
                <UtensilsCrossed size={20} className="text-brand-500" />
                <h3 className="font-display text-xl font-medium">A sample day</h3>
              </div>
              {exampleDietPlan.length ? (
                <ol className="relative space-y-5 border-l border-dashed border-line pl-6">
                  {exampleDietPlan.map(([meal, details]) => (
                    <li key={meal} className="relative">
                      <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-paper bg-brand-500" />
                      <p className="eyebrow">{meal}</p>
                      <div className="mt-1 leading-relaxed"><RichValue value={details} depth={1} /></div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-ink-faint">No sample day in this analysis.</p>
              )}
            </div>
            <div className="grid content-start gap-4">
              <Stat icon={Flame} label="Daily calories" value={asText(calories.Recommendation)} />
              <Stat icon={Droplets} label="Sodium" value={asText(calories['Sodium Content'])} />
            </div>
          </div>
        </section>

        {/* Lifestyle */}
        <section className="mt-16">
          <SectionHead id="lifestyle" eyebrow="02 — Lifestyle plan" title="How to move, rest and recover." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.length ? (
              exercises.map((ex, i) => (
                <div key={i} className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                    <Dumbbell size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium">{ex.Type}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[ex.Frequency, ex.Duration].filter(Boolean).map((t) => (
                      <span key={t} className="rounded-full bg-paper-2 px-3 py-1 font-mono text-xs text-ink-soft">{t}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-6 text-sm text-ink-faint">No exercises listed in this analysis.</div>
            )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Footprints size={20} className="text-brand-500" />
                <h3 className="font-display text-xl font-medium">Everyday activity</h3>
              </div>
              {dailyActivities.length ? (
                <ul className="space-y-2.5">
                  {dailyActivities.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sage-500" />
                      <span>{typeof a === 'string' ? a : asText(a)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-faint">Nothing listed.</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {tips.map((t) => (
                <div key={t.label} className="card p-5">
                  <t.icon size={20} className="text-brand-500" />
                  <p className="eyebrow mt-4">{t.label}</p>
                  <p className="mt-1.5 text-pretty text-[15px] leading-relaxed">{t.value || 'Not provided'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precautions */}
        <section className="mt-16">
          <SectionHead id="precautions" eyebrow="03 — Precaution plan" title="What to keep an eye on.">
            Discuss these with your doctor — they are possibilities, not diagnoses.
          </SectionHead>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-amber-500/25 bg-amber-50 p-7">
              <div className="flex items-center gap-3 text-amber-700">
                <ShieldAlert size={22} />
                <h3 className="font-display text-xl font-medium">At-risk conditions</h3>
              </div>
              <div className="mt-4 leading-relaxed"><RichValue value={precaution['At-Risk Diseases']} depth={1} /></div>
            </div>
            <div className="rounded-3xl border border-sage-500/25 bg-sage-50 p-7">
              <div className="flex items-center gap-3 text-sage-700">
                <ShieldCheck size={22} />
                <h3 className="font-display text-xl font-medium">Precautions</h3>
              </div>
              <div className="mt-4 leading-relaxed"><RichValue value={precaution.Precautions} depth={1} /></div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default HealthPlanDashboard;
