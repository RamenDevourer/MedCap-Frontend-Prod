import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import serverUrl from '../components/server_url';
import LoadingPopup from '../components/LoadingPopup';
import { formatDate } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

const InputField = ({ label, name, type = "text", value, onChange, min, max, placeholder }) => (
  <div>
    <label className="block mb-2">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full p-2 rounded"
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />
  </div>
);

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
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);

    if (token) {
      setLoadingData(true);
      axios.get(`${serverUrl}/api/auth/secure`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUserData(response.data.user);
        setFormData(prev => ({
          ...prev,
          height: response.data.user.height || '',
          weight: response.data.user.weight || '',
        }));
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError(true);
        setErrorMessage('Failed to load user data.');
      })
      .finally(() => {
        setLoadingData(false);
      });
    }
  }, [serverUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, reportFile: file });
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, reportFile: null });
    setUploadedFile(null);
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
      `First Name: ${userData.firstName} \n`+
      `Blood Type: ${userData.bloodType} \n`+
      `Gender: ${userData.gender} \n`+
      `Date of Birth: ${formatDate(userData.dob)} \n`+
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
    } else {
      console.log('No file uploaded!');
    }

    try {
      await axios.put(`${serverUrl}/api/auth/update`, {
        ...userData,
        height: formData.height,
        weight: formData.weight,
        vegetarian: formData.vegetarian,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await axios.post(`${serverUrl}/api/report/addrecord`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      navigate('/healthcareplan');
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(true);
      setErrorMessage('An error occurred. Please try again.');

      // redirect after 5 seconds
      let countdown = 5;
      setErrorMessage(`An error occurred. Please try again.\nRedirecting in ${countdown}...`);
      
      const interval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
          setErrorMessage(`An error occurred. Please try again.\nRedirecting in ${countdown}...`);
        } else {
          clearInterval(interval);
          window.location.href = "/";
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#fbcfe8] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-500 text-white p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold">Medical Report</h1>
            <p className="mt-2">Comprehensive health assessment form including vital signs and medical history.</p>
          </div>
          
          <div className="bg-pink-100 p-6 rounded-b-lg">
            <h2 className="text-2xl font-bold mb-4">Upload Document</h2>
            <div className="flex items-center justify-center w-full mb-6">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB, must have extractable text)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  accept=".pdf" // Restrict to PDF files
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 flex items-center space-x-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7a1 1 0 00-1-1h-3M5 11V7a1 1 0 011-1h10a1 1 0 011 1v4m-6 4v-2m0 2v2m0-2h-4m4 0h4m-4 0h-4"></path>
                </svg>
                <p>{uploadedFile.name}</p>
                <button onClick={handleRemoveFile} className="text-red-500">Remove</button>
              </div>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Please ensure the PDF contains extractable text to facilitate processing.
            </p>

            <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4 mt-8">Personal Information</h2>
            <InputField label="Height" name="height" type="number" value={formData.height} onChange={handleChange} placeholder="Enter your height in centimeters (e.g., 170)" />
            <InputField label="Weight" name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="Enter your weight in kilograms (e.g., 70)" />

            <h2 className="text-2xl font-bold mb-4 mt-8">Vital Signs</h2>
            <InputField label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="Enter your blood pressure reading (e.g., 120/80 mmHg)" />
            <InputField label="Heart Rate" name="heartRate" type="number" value={formData.heartRate} onChange={handleChange} placeholder="Enter your heart rate in beats per minute (bpm, e.g., 75)" />
            <InputField label="Cholesterol" name="cholesterol" value={formData.cholesterol} onChange={handleChange} placeholder="Enter your total cholesterol level (e.g., 200 mg/dL)" />
            <InputField label="Blood Sugar" name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} placeholder="Enter your blood sugar level (e.g., 90 mg/dL)" />
            <InputField label="BMI" name="bmi" type="number" value={formData.bmi} onChange={handleChange} placeholder="Enter your Body Mass Index (e.g., 22.5)" />
            <InputField label="Blood Count" name="bloodCount" value={formData.bloodCount} onChange={handleChange} placeholder="Enter your latest blood count results (e.g., 5.0 million cells/mcL)" />
            <InputField label="Last Checkup Date" name="lastCheckupDate" type="date" value={formData.lastCheckupDate} onChange={handleChange} placeholder="Select the date of your last health checkup" />

            <h2 className="text-2xl font-bold mb-4 mt-8">Health History</h2>
            <InputField label="Health History" name="healthHistory" value={formData.healthHistory} onChange={handleChange} placeholder="Enter any relevant health history (e.g., past illnesses, surgeries)" />
            <InputField label="Chronic Conditions" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} placeholder="List any chronic conditions you have (e.g., diabetes, hypertension)" />
            <InputField label="Mental Health History" name="mentalHealthHistory" value={formData.mentalHealthHistory} onChange={handleChange} placeholder="Share your mental health history (e.g., anxiety, depression)" />
            <InputField label="Pregnancy Status" name="pregnancyStatus" value={formData.pregnancyStatus} onChange={handleChange} placeholder="Indicate if you are pregnant (e.g., Yes/No)" />
            <InputField label="Vaccination History" name="vaccinationHistory" value={formData.vaccinationHistory} onChange={handleChange} placeholder="List any vaccinations you have received (e.g., flu shot, COVID-19)" />

            <h2 className="text-2xl font-bold mb-4 mt-8">Lifestyle and Preferences</h2>
            <InputField label="Lifestyle Factors" name="lifestyleFactors" value={formData.lifestyleFactors} onChange={handleChange} placeholder="Describe your lifestyle factors (e.g., activity level, smoking, alcohol use)" />
            <InputField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies (e.g., pollen, peanuts)" />
            <InputField label="Medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="Enter any medications you are currently taking (e.g., aspirin, metformin)" />
            <InputField label="Health Goals" name="healthGoals" value={formData.healthGoals} onChange={handleChange} placeholder="Describe your health goals (e.g., lose weight, increase fitness)" />
            <InputField label="Additional Problems" name="additionalProblems" value={formData.additionalProblems} onChange={handleChange} placeholder="Mention any additional health problems or concerns" />
            <InputField label="Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Enter any other relevant notes or information" />
            <InputField label="Preferred Healthcare Providers" name="preferredHealthcareProviders" value={formData.preferredHealthcareProviders} onChange={handleChange} placeholder="List your preferred healthcare providers (e.g., family doctor, specialist)" />
                          

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={formData.vegetarian}
                  onChange={handleSliderChange}
                  className="mr-2"
                />
                <label>Vegetarian</label>
              </div>

              <button
                type="submit"
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit Report
              </button>
            </form>

            {loading && <LoadingPopup error={error} message='Generating Healthcare Plans...'/>}
            {error && <LoadingPopup error={error} message={errorMessage || "Something went wrong..."}/>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MedicalReportForm;
