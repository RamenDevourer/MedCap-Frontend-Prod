import { Mail, Phone, CalendarDays, User } from 'lucide-react';
import { formatDate } from '../utils/utils';

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-paper-2 text-ink-soft">
      <Icon size={16} />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="truncate font-medium">{value || '—'}</p>
    </div>
  </div>
);

const Tile = ({ label, value, unit }) => (
  <div className="rounded-xl bg-paper-2/80 px-3 py-3">
    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{label}</p>
    <p className="mt-1 font-display text-2xl leading-none">
      {value || '—'}
      {value && unit && <span className="ml-0.5 font-sans text-xs text-ink-faint">{unit}</span>}
    </p>
  </div>
);

const bmiOf = (h, w) => {
  const height = Number(h) / 100;
  const weight = Number(w);
  if (!height || !weight) return null;
  return (weight / (height * height)).toFixed(1);
};

const UserDetails = ({ user }) => (
  <div className="space-y-6">
    <div>
      <p className="eyebrow mb-3">Health basics</p>
      <div className="grid grid-cols-2 gap-2">
        <Tile label="Blood type" value={user.bloodType} />
        <Tile label="BMI" value={bmiOf(user.height, user.weight)} />
        <Tile label="Height" value={user.height} unit="cm" />
        <Tile label="Weight" value={user.weight} unit="kg" />
      </div>
    </div>

    <div>
      <p className="eyebrow">Details</p>
      <div className="mt-1 divide-y divide-line">
        <Row icon={Mail} label="Email" value={user.email} />
        <Row icon={Phone} label="Phone" value={user.phone} />
        <Row icon={CalendarDays} label="Date of birth" value={formatDate(user.dob)} />
        <Row icon={User} label="Gender" value={user.gender} />
      </div>
    </div>
  </div>
);

export default UserDetails;
