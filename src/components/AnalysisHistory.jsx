import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ClipboardList, FileText, Sparkles, Paperclip, FilePlus2, Inbox } from 'lucide-react';
import Modal from './Modal.jsx';
import RichValue from './ui/RichValue';

// ---- Parsing helpers (unchanged behaviour) ----
const getFormData = (report) => {
  let formDataString = report.split('Attached file content:')[0] || '';
  formDataString = formDataString.split('Form content:')[1] || formDataString;
  const formDataPairs = {};

  formDataString.split('\n').forEach((line) => {
    const [key, value] = line.split(':');
    if (key && value) {
      formDataPairs[key.trim()] = value.trim();
    }
  });

  return Object.keys(formDataPairs).length ? formDataPairs : null;
};

const getAttachedFileContent = (report) => {
  let fileContent = report.match(/Attached file content:([\s\S]*)/)?.[1]?.trim() || '';
  if (!fileContent || fileContent.includes('undefined')) return null;
  return fileContent;
};

const parseAnalysis = (analysisString) => {
  try {
    return analysisString ? JSON.parse(analysisString) : {};
  } catch (error) {
    console.error('Failed to parse analysis:', error);
    return {};
  }
};

const toDate = (value) => {
  const d = new Date(value);
  return isNaN(d) ? null : d;
};

const MODAL = {
  form: { title: 'Form data', eyebrow: 'What you entered' },
  file: { title: 'Uploaded report', eyebrow: 'Text extracted from your PDF' },
  analysis: { title: 'Full analysis', eyebrow: 'AI-generated · not medical advice' },
};

const AnalysisHistory = ({ history = [] }) => {
  const [open, setOpen] = useState(null); // { type, content, date }

  const sortedHistory = Array.isArray(history)
    ? [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  if (!sortedHistory.length) {
    return (
      <section className="card grid place-items-center px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-paper-2 text-ink-soft">
          <Inbox size={24} />
        </span>
        <h2 className="mt-5 text-2xl font-medium">No analyses yet</h2>
        <p className="mt-2 max-w-sm text-ink-soft">Your reports and their analyses will appear here once you submit one.</p>
        <Link to="/medicalreport" className="btn-brand mt-7"><FilePlus2 size={16} /> Analyse a report</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-medium">Analysis history</h2>
        <span className="font-mono text-xs text-ink-faint">{sortedHistory.length} total</span>
      </div>

      <ol className="space-y-3">
        {sortedHistory.map((analysis, index) => {
          const parsed = parseAnalysis(analysis.analysis) || {};
          const summary = parsed['Summary of Current Condition'];
          const formData = getFormData(analysis.report || '');
          const fileContent = getAttachedFileContent(analysis.report || '');
          const date = toDate(analysis.createdAt);
          const show = (type, content) => setOpen({ type, content, date });

          return (
            <li
              key={analysis._id || index}
              className="card group animate-rise p-5 transition-shadow duration-300 hover:shadow-lift md:p-6"
              style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
            >
              <div className="flex gap-5">
                <div className="hidden w-16 shrink-0 text-center sm:block">
                  <p className="font-display text-4xl leading-none">{date ? date.getDate() : '—'}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    {date ? date.toLocaleString('en', { month: 'short', year: '2-digit' }) : ''}
                  </p>
                </div>

                <div className="min-w-0 flex-1 sm:border-l sm:border-line sm:pl-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {index === 0 && (
                      <span className="rounded-full bg-brand-500 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">Latest</span>
                    )}
                    <span className="font-mono text-xs text-ink-faint sm:hidden">
                      {date ? date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-2.5 py-0.5 text-xs text-ink-soft">
                      <Paperclip size={12} /> {fileContent ? 'PDF attached' : 'No file'}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-pretty leading-relaxed text-ink">
                    {typeof summary === 'string' ? summary : 'No summary available for this analysis.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => show('analysis', parsed)} className="btn-primary px-4 py-2 text-sm">
                      <Sparkles size={15} /> Full analysis
                    </button>
                    <button
                      onClick={() => show('form', formData)}
                      disabled={!formData}
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      <ClipboardList size={15} /> Form data
                    </button>
                    <button
                      onClick={() => show('file', fileContent)}
                      disabled={!fileContent}
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      <FileText size={15} /> Report text
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {open && (
        <Modal
          onClose={() => setOpen(null)}
          title={MODAL[open.type].title}
          eyebrow={`${MODAL[open.type].eyebrow}${open.date ? ` · ${open.date.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}`}
          size={open.type === 'form' ? 'md' : 'lg'}
        >
          {open.type === 'form' && (
            <dl className="divide-y divide-line">
              {Object.entries(open.content || {}).map(([key, value]) => (
                <div key={key} className="flex items-baseline justify-between gap-6 py-2.5">
                  <dt className="text-sm text-ink-soft">{key}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {open.type === 'file' && (
            <pre className="whitespace-pre-wrap break-words rounded-2xl border border-line bg-white p-4 font-mono text-[13px] leading-relaxed text-ink">
              {open.content}
            </pre>
          )}
          {open.type === 'analysis' &&
            (Object.keys(open.content || {}).length ? (
              <RichValue value={open.content} />
            ) : (
              <p className="text-ink-faint">This analysis couldn&apos;t be read.</p>
            ))}
        </Modal>
      )}
    </section>
  );
};

AnalysisHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      report: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      analysis: PropTypes.string.isRequired,
    })
  ),
};

export default AnalysisHistory;
