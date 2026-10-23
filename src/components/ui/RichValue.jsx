// Renders whatever shape the AI returned — string, number, list or nested object —
// as readable text instead of raw JSON.
const humanize = (key) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const RichValue = ({ value, depth = 0 }) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-ink-faint">Not provided</span>;
  }
  if (typeof value !== 'object') {
    return <span className="text-pretty">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v !== 'object')) {
      return (
        <ul className="space-y-1.5">
          {value.map((v, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span>{String(v)}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="rounded-xl border border-line bg-paper/60 p-3">
            <RichValue value={v} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <dl className={depth === 0 ? 'divide-y divide-line' : 'space-y-1.5'}>
      {Object.entries(value).map(([k, v]) => (
        <div key={k} className={depth === 0 ? 'py-3 first:pt-0 last:pb-0' : 'text-sm'}>
          <dt className={depth === 0 ? 'eyebrow mb-1.5' : 'inline font-semibold'}>
            {humanize(k)}
            {depth > 0 && ': '}
          </dt>
          <dd className={depth === 0 ? 'leading-relaxed text-ink' : 'inline text-ink-soft'}>
            <RichValue value={v} depth={depth + 1} />
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default RichValue;
