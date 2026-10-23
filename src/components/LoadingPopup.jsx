import { AlertTriangle } from 'lucide-react';
import EcgLine from './ui/EcgLine';

// Full-screen status overlay. Same props as before (message, error), plus
// optional onClose / closeLabel so error states can be dismissed, and an
// optional detail line (e.g. a redirect countdown).
const LoadingPopup = ({ message = 'Loading…', error = false, onClose, closeLabel = 'Try again', detail }) => (
  <div className="fixed inset-0 z-50 grid animate-fade place-items-center bg-ink/35 p-6 backdrop-blur-sm" role="status" aria-live="polite">
    <div className="w-full max-w-sm animate-pop rounded-3xl border border-line bg-paper p-8 text-center shadow-lift">
      {error ? (
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle size={26} />
        </div>
      ) : (
        <div className="chart-grid relative mx-auto h-20 overflow-hidden rounded-2xl border border-line bg-white">
          <EcgLine className="absolute inset-0 h-full w-[200%] text-brand-500" animate={false} width={2} />
          <div className="absolute inset-y-0 left-0 w-full animate-sweep bg-gradient-to-r from-transparent via-white to-white" />
          <span className="absolute right-3 top-3 h-2 w-2 animate-pulseDot rounded-full bg-brand-500" />
        </div>
      )}

      <p className="mt-6 font-display text-xl text-ink">{message}</p>
      {(detail || !error) && (
        <p className="mt-2 text-sm text-ink-soft">{detail || 'This usually takes a few seconds.'}</p>
      )}

      {error && onClose && (
        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          {closeLabel}
        </button>
      )}
    </div>
  </div>
);

export default LoadingPopup;
