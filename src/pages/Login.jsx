import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import Logo from '../assets/medcap_logo.png'; // Adjust path based on your structure
import Header from '../components/Header'; // Assuming you have the same Header component
import Footer from '../components/Footer';
import HealthSection from '../components/HeartBanner';
import serverUrl from '../components/server_url'; // Assuming you have a server URL configuration
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // State to hold logged-in user data
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, formData);

      // Assuming the response data contains the user and token info
      const { accessToken, user } = response.data;
      
      // Save the access token in localStorage
      localStorage.setItem('accessToken', accessToken);

      // Save user information in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Set loggedIn status in localStorage
      localStorage.setItem('loggedIn', true);

      // Update user state with the logged-in user data
      setUser(user);

      // Clear the error and navigate to the dashboard after successful login
      setError(null);
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="bg-pink-200 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 md:px-12 py-12 md:py-32 flex flex-col md:flex-row items-center"> {/* Set px-4 for mobile */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            <div className="bg-[#F8CDEA] w-full h-full rounded-full"></div>
            <img 
              src={Logo}
              alt="MedCap Logo"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left"> {/* Increased text size for mobile */}
            Welcome Back to MedCap!
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center md:text-left"> {/* Increased text size for mobile */}
            Please log in to access your personalized healthcare dashboard.
          </p>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-lg font-medium">
                Email
              </label>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" // Adjusted padding
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium">
                Password
              </label>
              <input 
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400" // Adjusted padding
                placeholder="Enter your password"
                required
              />
            </div>

            <button className="w-full bg-pink-400 text-white px-6 py-3 rounded-full text-lg">
              Log In
            </button>
          </form>

          <p className="mt-4 text-sm text-center md:text-left">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-500 font-medium">Sign up here</Link>.
          </p>
        </div>
      </main>

      {/* Statistics */}
      <HealthSection />
      {/* <div className="bg-purple-500 py-8 px-4 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between text-white text-center">
          <div className="mb-4 md:mb-0">
            <div className="text-3xl md:text-4xl font-bold">10k+</div>
            <div>Users</div>
          </div>
          <div className="mb-4 md:mb-0">
            <div className="text-3xl md:text-4xl font-bold">24/7</div>
            <div>Support</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">99.9%</div>
            <div>Uptime</div>
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  );
};

export default LoginPage;
