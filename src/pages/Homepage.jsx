import React, { useState, useEffect } from 'react';
import Heart from '../assets/heart.png';
import Logo from '../assets/medcap_logo.png';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/AboutUs';
import Services from '../components/Services';
import HealthSection from '../components/HeartBanner';
import StatisticsBanner from '../components/StatisticsBanner';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('loggedIn') === 'true';
    const storedUser = localStorage.getItem('user');

    if (loggedInStatus && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        <div className="relative">
        {/* Main Content */}
        <main className="flex-grow min-h-[70vh] container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-center">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img 
                src={Heart}
                alt="Heart with ECG" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Cap your health with <span className="text-pink-600">MedCap!</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Experience the power of AI-driven analysis. Our smart algorithms summarize your medical reports and provide personalized health recommendations to help you live your best life.
            </p>
            <div>
              <Link to={isLoggedIn ? '/medicalreport' : '/login'}>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full text-lg transition duration-300 ease-in-out">
                  {isLoggedIn ? 'View Medical Report' : 'Get Started'}
                </button>
              </Link>
            </div>
          </div>
        </main>

        {/* Conditional Health Section */}
        {isLoggedIn ? (
          <></>
        ) : (
          <div className="absolute top-0 left-0 right-0 bg-gray-200 py-4 text-center hidden md:block"> {/* Hidden on mobile */}
            <p className="text-lg">Log in to upload your medical report and experience AI-driven insights and personalized health suggestions.</p>
          </div>
        )}
        </div>

        {/* Health Banner */}
        <HealthSection />
   
        {/* Services Section */}
        <Services />

        {/* Statistics Banner */}
        <StatisticsBanner />
        {/* <section className="bg-purple-600 py-12 text-white text-center">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-3xl font-bold">10,000+</h2>
              <p className="mt-2">Reports Analyzed</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">5,000+</h2>
              <p className="mt-2">Happy Users</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">98%</h2>
              <p className="mt-2">User Satisfaction</p>
            </div>
          </div>
        </section> */}
        
        {/* Additional Sections */}
        <About />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
