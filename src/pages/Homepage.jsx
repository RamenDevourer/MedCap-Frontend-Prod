import React from 'react';
import Heart from '../assets/heart.png';
import Logo from '../assets/medcap_logo.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/AboutUs';
import Services from '../components/Services';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HealthSection from '../components/HeartBanner';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

    useEffect(() => {
    if (localStorage.getItem('loggedIn') === null) {
      localStorage.setItem('loggedIn', false);
    }

    let loggedInStatus = localStorage.getItem('loggedIn');
    const storedUser = localStorage.getItem('user');

    if (loggedInStatus === 'true' && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // Parse the user data from localStorage
    }
  }, []);

  return (
    <>
      {/* <div className="bg-pink-200 min-h-screen flex flex-col"> */}
      <div className="#fffff min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-12 px-12 flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="flex justify-center item-center m-3 w-full h-full relative w-48 h-48 md:w-64 md:h-64">
              <img 
                src={Heart}
                alt="Heart with ECG" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">
              Cap your health,<br />with MedCap!
            </h1>
            <p className="text-lg md:text-xl mb-8 text-center md:text-left">
              Get a personalized health care plan to maximize your wellbeing
              and live life to the fullest
            </p>
            <div className="flex justify-center md:justify-start">
              <Link to={isLoggedIn ? `/medicalreport` : `/login`}>
                <button className="bg-pink-400 text-white px-6 py-3 rounded-full text-lg">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </main>

        {/* Statistics */}
        <div className="bg-purple-500 py-8">
          <div className="container mx-auto pt-8 px-4 md:px-12 flex flex-col md:flex-row justify-between text-white text-center">
          </div>
        </div>

      </div>
      <HealthSection/>
      <About/>
      <Services/>
      <Footer />
    </>
  );
};

export default HomePage;