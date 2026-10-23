import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from './ui/PageShell';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Error boundary caught an error: ', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageShell>
          <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
            <div className="max-w-md">
              <p className="eyebrow">Something broke</p>
              <h1 className="mt-3 text-4xl font-medium">We couldn&apos;t load this page.</h1>
              <p className="mt-4 text-ink-soft">Refresh to try again, or head back to your dashboard.</p>
              <div className="mt-8 flex justify-center gap-2">
                <button className="btn-ghost" onClick={() => window.location.reload()}>Refresh</button>
                <Link className="btn-primary" to="/dashboard">Go to dashboard</Link>
              </div>
            </div>
          </div>
        </PageShell>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
