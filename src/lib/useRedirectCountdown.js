import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Starts a visible countdown, then navigates. Used when a page can't continue
// (e.g. the session expired) so the user sees why they're being moved.
const useRedirectCountdown = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(null);
  const target = useRef(null);
  const timer = useRef(null);

  const stop = () => clearInterval(timer.current);

  const goNow = useCallback(() => {
    stop();
    setSecondsLeft(null);
    if (target.current) navigate(target.current);
  }, [navigate]);

  const start = useCallback((to, seconds = 5) => {
    stop();
    target.current = to;
    setSecondsLeft(seconds);
    timer.current = setInterval(() => setSecondsLeft((s) => (s === null ? s : s - 1)), 1000);
  }, []);

  useEffect(() => {
    if (secondsLeft !== null && secondsLeft <= 0) goNow();
  }, [secondsLeft, goNow]);

  useEffect(() => stop, []);

  return { secondsLeft, redirecting: secondsLeft !== null, start, goNow };
};

export default useRedirectCountdown;
