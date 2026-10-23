import Header from '../Header';
import Footer from '../Footer';

// Standard frame for every page: header, a paper-grain main area, footer.
const PageShell = ({ children, footer = true, className = '' }) => (
  <div className="grain flex min-h-screen flex-col">
    <Header />
    <main className={`flex-1 ${className}`}>{children}</main>
    {footer && <Footer />}
  </div>
);

export const PageIntro = ({ eyebrow, title, children, actions }) => (
  <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl animate-rise">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 text-balance text-4xl font-medium leading-[1.05] md:text-5xl">{title}</h1>
      {children && <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">{children}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
  </div>
);

export default PageShell;
