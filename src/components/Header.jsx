import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, LayoutDashboard, FilePlus2, LogOut } from 'lucide-react';
import Logo from './ui/Logo';
import Avatar from './ui/Avatar';
import { clearSession, getStoredUser, isLoggedIn as readLoggedIn } from '../lib/session';

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
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearSession();
    setLoggedIn(false);
    setUser(null);
    setAccountOpen(false);
    setOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === null) localStorage.setItem('loggedIn', false);
    const status = readLoggedIn();
    setLoggedIn(status);
    setUser(status ? getStoredUser() : null);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e) => accountRef.current && !accountRef.current.contains(e.target) && setAccountOpen(false);
    const onKey = (e) => e.key === 'Escape' && setAccountOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

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
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1 pl-1 pr-3 text-sm font-semibold transition hover:border-ink/25 hover:bg-white"
              >
                <Avatar user={user} />
                {user.firstName || 'Account'}
                <ChevronDown size={16} className={`text-ink-soft transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 animate-pop overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift"
                >
                  <div className="border-b border-line px-3 pb-3 pt-2">
                    <p className="truncate font-semibold">{`${user.firstName ?? ''} ${user.lastName ?? ''}`}</p>
                    <p className="truncate text-sm text-ink-soft">{user.email}</p>
                  </div>
                  <Link role="menuitem" to="/dashboard" className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] transition hover:bg-paper-2">
                    <LayoutDashboard size={17} className="text-ink-soft" /> Dashboard
                  </Link>
                  <Link role="menuitem" to="/medicalreport" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] transition hover:bg-paper-2">
                    <FilePlus2 size={17} className="text-ink-soft" /> New report
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl border-t border-line px-3 py-2.5 text-left text-[15px] font-medium text-rose-700 transition hover:bg-rose-50"
                  >
                    <LogOut size={17} /> Sign out
                  </button>
                </div>
              )}
            </div>
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
            ) : null}
            {loggedIn && user ? (
              <button type="button" onClick={handleSignOut} className="btn-danger mt-2 w-full">
                <LogOut size={16} /> Sign out
              </button>
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
