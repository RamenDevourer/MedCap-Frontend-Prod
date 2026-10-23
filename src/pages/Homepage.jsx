import { useEffect, useState } from 'react';
import PageShell from '../components/ui/PageShell';
import Hero from '../components/home/Hero';
import { ReportStrip, HowItWorks, WhatYouGet, About, FinalCta } from '../components/home/Sections';
import { getStoredUser, isLoggedIn as readLoggedIn } from '../lib/session';

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (readLoggedIn()) {
      setLoggedIn(true);
      setUser(getStoredUser());
    }
  }, []);

  return (
    <PageShell>
      <Hero loggedIn={loggedIn} user={user} />
      <ReportStrip />
      <HowItWorks />
      <WhatYouGet />
      <About />
      <FinalCta loggedIn={loggedIn} />
    </PageShell>
  );
};

export default HomePage;
