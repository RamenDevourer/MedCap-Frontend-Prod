import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import serverUrl from '../components/server_url';
import AuthLayout, { FormAlert } from '../components/ui/AuthLayout';
import { DEFAULT_PROFILE_PICTURE } from '../lib/session';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dob: '',
  bloodType: '',
  gender: '',
  phone: '',
  height: '',
  weight: '',
  // Sent as-is when the user doesn't upload a photo.
  profilePicture: DEFAULT_PROFILE_PICTURE,
};

const Field = ({ id, label, hint, className = '', children }) => (
  <div className={className}>
    <label htmlFor={id} className="label">{label}</label>
    {children}
    {hint && <p className="hint">{hint}</p>}
  </div>
);

const Group = ({ step, title, children }) => (
  <fieldset className="space-y-4">
    <legend className="mb-4 flex w-full items-center gap-3">
      <span className="font-mono text-xs text-brand-500">{step}</span>
      <span className="font-display text-xl font-medium">{title}</span>
      <span className="h-px flex-1 bg-line" />
    </legend>
    {children}
  </fieldset>
);

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!(formData.profilePicture instanceof Blob)) return setPreview(null);
    const url = URL.createObjectURL(formData.profilePicture);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.profilePicture]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] || DEFAULT_PROFILE_PICTURE : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post(`${serverUrl}/api/auth/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Registration successful! Please log in.');
      setError(null);
      setFormData(EMPTY);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Join MedCap"
      subtitle="A few details about you help the AI tailor your plan."
      footer={
        <>
          Already have an account? <Link to="/login" className="link">Log in</Link>
        </>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {successMessage && <FormAlert tone="success">{successMessage}</FormAlert>}

      <form className="space-y-10" onSubmit={handleSubmit}>
        <Group step="01" title="Account">
          <div className="flex items-center gap-4">
            <label
              htmlFor="profilePicture"
              className="group relative grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed border-line bg-white text-ink-faint transition hover:border-brand-500 hover:text-brand-500"
            >
              {preview ? (
                <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <Camera size={22} />
              )}
            </label>
            <div>
              <p className="text-sm font-semibold">Profile picture</p>
              <p className="text-sm text-ink-soft">Optional. Click the circle to choose an image.</p>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleChange}
                className="sr-only"
                accept="image/*"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="First name">
              <input type="text" id="firstName" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} className="input" placeholder="Aanya" required />
            </Field>
            <Field id="lastName" label="Last name">
              <input type="text" id="lastName" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} className="input" placeholder="Sharma" required />
            </Field>
          </div>
          <Field id="email" label="Email">
            <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} className="input" placeholder="you@example.com" required />
          </Field>
          <Field id="password" label="Password">
            <input type="password" id="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} className="input" placeholder="Create a password" required />
          </Field>
          <Field id="phone" label="Phone number">
            <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} className="input" placeholder="+1 555 000 0000" required />
          </Field>
        </Group>

        <Group step="02" title="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="dob" label="Date of birth">
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="input" required />
            </Field>
            <Field id="gender" label="Gender">
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="input" required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
        </Group>

        <Group step="03" title="Health basics">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="bloodType" label="Blood type">
              <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} className="input" required>
                <option value="">Select</option>
                {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field id="height" label="Height (cm)">
              <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className="input" placeholder="170" required />
            </Field>
            <Field id="weight" label="Weight (kg)">
              <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className="input" placeholder="65" required />
            </Field>
          </div>
        </Group>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
          {submitting ? 'Creating your account…' : (<>Create account <ArrowRight size={18} /></>)}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
