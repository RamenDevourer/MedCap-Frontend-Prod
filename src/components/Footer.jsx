import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import EcgLine from './ui/EcgLine';

const Footer = () => (
  <footer className="relative mt-auto overflow-hidden bg-ink text-paper">
    <EcgLine className="pointer-events-none h-14 w-full text-brand-500/40" animate={false} width={1.5} />
    <div className="container relative pb-14 pt-6">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-5 text-pretty text-[15px] leading-relaxed text-paper/65">
            Upload a lab report, get a plain-language summary and a personal plan for food, movement and
            precautions. Built to help you prepare for a conversation with your doctor — not replace it.
          </p>
        </div>

        <div>
          <p className="eyebrow text-paper/45">Product</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link className="text-paper/80 transition hover:text-white" to="/medicalreport">Analyse a report</Link></li>
            <li><Link className="text-paper/80 transition hover:text-white" to="/healthcareplan">Your health plan</Link></li>
            <li><Link className="text-paper/80 transition hover:text-white" to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-paper/45">Account</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link className="text-paper/80 transition hover:text-white" to="/signup">Create an account</Link></li>
            <li><Link className="text-paper/80 transition hover:text-white" to="/login">Log in</Link></li>
            <li><a className="text-paper/80 transition hover:text-white" href="/#how-it-works">How it works</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-paper/10 pt-6 text-sm text-paper/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} MedCap AI. All rights reserved.</p>
        <p className="max-w-xl text-pretty md:text-right">
          MedCap provides AI-generated information, not medical advice. Always consult a qualified clinician.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
