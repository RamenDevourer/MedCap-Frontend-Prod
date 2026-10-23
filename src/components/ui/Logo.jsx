import { Link } from 'react-router-dom';
import logo from '../../assets/medcap_logo.png';

const Logo = ({ to = '/', inverted = false, className = '' }) => (
  <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="MedCap home">
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full ring-1 ring-ink/10 transition-transform duration-300 group-hover:rotate-[-8deg]">
      <img src={logo} alt="" className="h-full w-full scale-[1.18] object-cover" />
    </span>
    <span className={`font-display text-[22px] font-semibold leading-none tracking-tight ${inverted ? 'text-paper' : 'text-ink'}`}>
      MedCap
      <span className="ml-1 align-top font-mono text-[10px] font-medium tracking-widest text-brand-500">AI</span>
    </span>
  </Link>
);

export default Logo;
