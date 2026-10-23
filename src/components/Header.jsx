import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './ui/Logo';
import Avatar from './ui/Avatar';
import { getStoredUser, isLoggedIn as readLoggedIn } from '../lib/session';

const NAV = [
  { label: 'Home', to: '/', public: true },
  { label: 'New report', to: '/medicalreport' },
  { label: 'Health plan', to: '/healthcareplan' },
  { label: 'Dashboard', to: '/dashboard' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === null) localStorage.setItem('loggedIn', false);
    const status = readLoggedIn();
    setLoggedIn(status);
    setUser(status ? getStoredUser() : null);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Logged-out visitors are sent to /login for protected pages, as before.
  const target = (item) => (item.public || loggedIn ? item.to : '/login');

  // A protected link that points to /login shouldn't light up on the login page.
  const active = (item, isActive) => isActive && (item.public || loggedIn);

  const linkClass = (item) => ({ isActive }) =>
    `relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
      active(item, isActive) ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? 'border-b border-line bg-paper/85 shadow-[0_8px_24px_-20px_rgba(26,22,51,0.35)] backdrop-blur-xl'
          : 'border-b border-transparent bg-paper/0'
      }`}
    >
      <nav className="container flex h-[68px] items-center justify-between gap-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.label} to={target(item)} end={item.to === '/'} className={linkClass(item)}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          {loggedIn && user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1 pl-1 pr-4 text-sm font-semibold transition hover:border-ink/25 hover:bg-white"
            >
              <Avatar user={user} />
              {user.firstName || 'Account'}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn px-4 text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary">
                Get started <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/70 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="container animate-fade pb-6 md:hidden">
          <div className="flex flex-col gap-1 border-t border-line pt-4">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={target(item)}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium ${
                    active(item, isActive) ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4">
            {loggedIn && user ? (
              <Link to="/dashboard" className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
                <Avatar user={user} size="md" />
                <span>
                  <span className="block font-semibold">{`${user.firstName ?? ''} ${user.lastName ?? ''}`}</span>
                  <span className="block text-sm text-ink-soft">View your dashboard</span>
                </span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/signup" className="btn-primary">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
