import { useState } from 'react';
import axios from 'axios';
import serverUrl from './server_url';
import Modal from './Modal';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Field = ({ label, htmlFor, children, className = '' }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="label">{label}</label>
    {children}
  </div>
);

const Group = ({ title, children }) => (
  <fieldset>
    <legend className="eyebrow mb-3">{title}</legend>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </fieldset>
);

const EditProfileForm = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    dob: user.dob ? user.dob.split('T')[0] : '',
    gender: user.gender,
    bloodType: user.bloodType,
    height: user.height || '',
    weight: user.weight || '',
    profilePicture: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem('accessToken');

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.put(`${serverUrl}/api/auth/update`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = response.data.user;
      onUpdate(updatedUser);
      onClose();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.message || 'Could not save your changes. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      title="Edit profile"
      eyebrow="Account"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" form="edit-profile" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      }
    >
      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-rose-500/25 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}
      <form id="edit-profile" onSubmit={handleSubmit} className="space-y-7">
        <Group title="Contact">
          <Field label="Email" htmlFor="email">
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input" disabled required />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="input" required />
          </Field>
        </Group>

        <Group title="Personal">
          <Field label="First name" htmlFor="firstName">
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="input" required />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="input" required />
          </Field>
          <Field label="Date of birth" htmlFor="dob">
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="input" required />
          </Field>
          <Field label="Gender" htmlFor="gender">
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="input" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>
        </Group>

        <Group title="Health">
          <Field label="Blood type" htmlFor="bloodType">
            <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} className="input" required>
              <option value="">Select</option>
              {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (cm)" htmlFor="height">
              <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className="input" />
            </Field>
            <Field label="Weight (kg)" htmlFor="weight">
              <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className="input" />
            </Field>
          </div>
        </Group>

        <Field label="Profile picture" htmlFor="profilePicture">
          <input type="file" id="profilePicture" name="profilePicture" onChange={handleChange} className="input" accept="image/*" />
        </Field>
      </form>
    </Modal>
  );
};

export default EditProfileForm;
