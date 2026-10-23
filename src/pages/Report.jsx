import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, ArrowRight, Leaf } from 'lucide-react';
import serverUrl from '../components/server_url';
import LoadingPopup from '../components/LoadingPopup';
import useRedirectCountdown from '../lib/useRedirectCountdown';
import PageShell, { PageIntro } from '../components/ui/PageShell';
import { formatDate } from '../utils/utils';

const MAX_MB = 10;

const InputField = ({ label, name, type = 'text', value, onChange, min, max, placeholder, unit, multiline, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="label">{label}</label>
    <div className="relative">
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          className="input resize-y"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          className={`input ${unit ? 'pr-16' : ''}`}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={type === 'number' ? 'any' : undefined}
        />
      )}
      {unit && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center font-mono text-xs text-ink-faint">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const Section = ({ id, step, title, description, children }) => (
  <section id={id} className="card scroll-mt-24 p-6 md:p-8">
    <div className="mb-6 flex items-start gap-4">
      <span className="mt-1 font-mono text-xs text-brand-500">{step}</span>
      <div>
        <h2 className="text-2xl font-medium">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
    </div>
    {children}
  </section>
);

const SECTIONS = [
  { id: 'upload', step: '01', title: 'Upload report' },
  { id: 'vitals', step: '02', title: 'Body & vitals' },
  { id: 'history', step: '03', title: 'Health history' },
  { id: 'lifestyle', step: '04', title: 'Lifestyle' },
];

const MedicalReportForm = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    cholesterol: '',
    bloodSugar: '',
    bmi: '',
    bloodCount: '',
    healthHistory: '',
    additionalProblems: '',
    notes: '',
    vegetarian: false,
    reportFile: null,
    allergies: '',
    medications: '',
    lifestyleFactors: '',
    vaccinationHistory: '',
    chronicConditions: '',
    preferredHealthcareProviders: '',
    lastCheckupDate: '',
    mentalHealthHistory: '',
    pregnancyStatus: '',
    healthGoals: '',
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { secondsLeft, redirecting, start: startRedirect, goNow } = useRedirectCountdown();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${serverUrl}/api/auth/secure`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUserData(response.data.user);
        setFormData((prev) => ({
          ...prev,
          height: response.data.user.height || '',
          weight: response.data.user.weight || '',
        }));
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setError(true);
        setErrorMessage('Failed to load your details. Please log in again.');
        // Without the user's profile the report can't be submitted, so send them to log in.
        startRedirect('/login');
      });
  }, [navigate, startRedirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const acceptFile = (file) => {
    if (!file) return;
    if (file.type && file.type !== 'application/pdf') {
      setFileError('Please choose a PDF file.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`That file is larger than ${MAX_MB} MB.`);
      return;
    }
    setFileError('');
    setFormData((prev) => ({ ...prev, reportFile: file }));
    setUploadedFile(file);
  };

  const handleFileChange = (e) => acceptFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, reportFile: null });
    setUploadedFile(null);
    if (fileInput.current) fileInput.current.value = '';
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, vegetarian: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      alert('User not logged in');
      setLoading(false);
      return;
    }

    const { email } = user;
    let newReport = '';

    newReport +=
      `First Name: ${userData?.firstName} \n` +
      `Blood Type: ${userData?.bloodType} \n` +
      `Gender: ${userData?.gender} \n` +
      `Date of Birth: ${formatDate(userData?.dob)} \n` +
      `Is Vegetarian: ${formData.vegetarian} \n`;

    for (const [key, value] of Object.entries(formData)) {
      if (value && key !== 'reportFile' && key !== 'vegetarian') {
        newReport += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n `;
      }
    }

    const form = new FormData();
    form.append('email', email);
    form.append('newReport', newReport);

    if (formData.reportFile) {
      form.append('reportFile', formData.reportFile);
    }

    try {
      await axios.put(
        `${serverUrl}/api/auth/update`,
        { ...userData, height: formData.height, weight: formData.weight, vegetarian: formData.vegetarian },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await axios.post(`${serverUrl}/api/report/addrecord`, form, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` },
      });

      navigate('/healthcareplan');
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(true);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filled = Object.entries(formData).filter(
    ([k, v]) => k !== 'vegetarian' && k !== 'reportFile' && v !== '' && v !== null
  ).length;

  return (
    <PageShell>
      <div className="container py-10 md:py-14">
        <PageIntro eyebrow="New analysis" title="Tell us about your health.">
          Upload a lab report and add whatever you know. Every field is optional — the more you share, the more
          personal your plan.
        </PageIntro>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Section index */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink-soft transition hover:bg-white hover:text-ink"
                >
                  <span className="font-mono text-xs text-ink-faint">{s.step}</span>
                  {s.title}
                </a>
              ))}
              <div className="mt-6 rounded-2xl border border-line bg-white p-4">
                <p className="eyebrow">Progress</p>
                <p className="mt-2 font-display text-3xl">
                  {filled}
                  <span className="text-base text-ink-faint"> fields</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">{uploadedFile ? 'Report attached' : 'No report attached yet'}</p>
              </div>
            </nav>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Section id="upload" step="01" title="Upload your report" description="A PDF with selectable text works best — scanned images can't be read yet.">
              {uploadedFile ? (
                <div className="flex items-center gap-4 rounded-2xl border border-sage-500/30 bg-sage-50 p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-sage-700">
                    <FileText size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{uploadedFile.name}</p>
                    <p className="font-mono text-xs text-ink-soft">{(uploadedFile.size / 1024).toFixed(0)} KB · PDF</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-white hover:text-rose-500"
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`chart-grid flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${
                    dragging ? 'border-brand-500 bg-brand-50' : 'border-line bg-paper/60 hover:border-ink/30 hover:bg-white'
                  }`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-brand-500 shadow-card">
                    <UploadCloud size={26} />
                  </span>
                  <p className="mt-4 font-semibold">
                    <span className="text-brand-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-faint">PDF · up to {MAX_MB} MB</p>
                </label>
              )}
              <input
                ref={fileInput}
                id="dropzone-file"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileError && <p className="mt-3 text-sm font-medium text-rose-700">{fileError}</p>}
            </Section>

            <Section id="vitals" step="02" title="Body & vitals" description="Copy these from your report or your last check-up.">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Height" name="height" type="number" unit="cm" value={formData.height} onChange={handleChange} placeholder="170" />
                <InputField label="Weight" name="weight" type="number" unit="kg" value={formData.weight} onChange={handleChange} placeholder="70" />
                <InputField label="Blood pressure" name="bloodPressure" unit="mmHg" value={formData.bloodPressure} onChange={handleChange} placeholder="120/80" />
                <InputField label="Heart rate" name="heartRate" type="number" unit="bpm" value={formData.heartRate} onChange={handleChange} placeholder="75" />
                <InputField label="Cholesterol" name="cholesterol" unit="mg/dL" value={formData.cholesterol} onChange={handleChange} placeholder="200" />
                <InputField label="Blood sugar" name="bloodSugar" unit="mg/dL" value={formData.bloodSugar} onChange={handleChange} placeholder="90" />
                <InputField label="BMI" name="bmi" type="number" value={formData.bmi} onChange={handleChange} placeholder="22.5" />
                <InputField label="Blood count" name="bloodCount" value={formData.bloodCount} onChange={handleChange} placeholder="5.0 million cells/mcL" />
                <InputField label="Last check-up" name="lastCheckupDate" type="date" value={formData.lastCheckupDate} onChange={handleChange} className="sm:col-span-2" />
              </div>
            </Section>

            <Section id="history" step="03" title="Health history" description="Anything a doctor would ask about at a first visit.">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField multiline label="Health history" name="healthHistory" value={formData.healthHistory} onChange={handleChange} placeholder="Past illnesses, surgeries…" />
                <InputField multiline label="Chronic conditions" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} placeholder="e.g. diabetes, hypertension" />
                <InputField multiline label="Mental health history" name="mentalHealthHistory" value={formData.mentalHealthHistory} onChange={handleChange} placeholder="e.g. anxiety, depression" />
                <InputField multiline label="Vaccination history" name="vaccinationHistory" value={formData.vaccinationHistory} onChange={handleChange} placeholder="e.g. flu shot, COVID-19" />
                <InputField label="Pregnancy status" name="pregnancyStatus" value={formData.pregnancyStatus} onChange={handleChange} placeholder="Yes / No / Not applicable" />
                <InputField label="Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="e.g. aspirin, metformin" />
                <InputField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. pollen, peanuts" className="sm:col-span-2" />
              </div>
            </Section>

            <Section id="lifestyle" step="04" title="Lifestyle & goals" description="Helps tailor your diet and activity plan.">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField multiline label="Lifestyle factors" name="lifestyleFactors" value={formData.lifestyleFactors} onChange={handleChange} placeholder="Activity level, smoking, alcohol…" />
                <InputField multiline label="Health goals" name="healthGoals" value={formData.healthGoals} onChange={handleChange} placeholder="e.g. lose weight, sleep better" />
                <InputField multiline label="Other concerns" name="additionalProblems" value={formData.additionalProblems} onChange={handleChange} placeholder="Anything else that's bothering you" />
                <InputField multiline label="Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any other relevant information" />
                <InputField label="Preferred healthcare providers" name="preferredHealthcareProviders" value={formData.preferredHealthcareProviders} onChange={handleChange} placeholder="e.g. family doctor, cardiologist" className="sm:col-span-2" />
              </div>

              <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-paper/60 p-4">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-50 text-sage-700">
                    <Leaf size={18} />
                  </span>
                  <span>
                    <span className="block font-semibold">I&apos;m vegetarian</span>
                    <span className="block text-sm text-ink-soft">Your diet plan will only suggest vegetarian foods.</span>
                  </span>
                </span>
                <span className="relative inline-flex">
                  <input type="checkbox" checked={formData.vegetarian} onChange={handleSliderChange} className="peer sr-only" />
                  <span className="h-7 w-12 rounded-full bg-paper-3 transition peer-checked:bg-sage-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2" />
                  <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </Section>

            <div className="sticky bottom-4 z-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-white/90 p-3 shadow-lift backdrop-blur md:flex-row md:p-5">
              <p className="hidden text-sm text-ink-soft md:block">
                By submitting you understand the result is AI-generated and not a diagnosis.
              </p>
              <button type="submit" disabled={loading} className="btn-brand w-full shrink-0 px-6 py-3 text-base md:w-auto">
                Generate my plan <ArrowRight size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-ink-faint md:hidden">
              The result is AI-generated and not a diagnosis.
            </p>
          </form>
        </div>
      </div>

      {loading && <LoadingPopup message="Generating your health plan…" />}
      {error && !loading && (
        <LoadingPopup
          error
          message={errorMessage || 'Something went wrong…'}
          detail={redirecting ? `Taking you to the login page in ${secondsLeft}…` : undefined}
          onClose={redirecting ? goNow : () => setError(false)}
          closeLabel={redirecting ? 'Log in now' : 'Close'}
        />
      )}
    </PageShell>
  );
};

export default MedicalReportForm;
