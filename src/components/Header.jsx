import React, { useState, useEffect } from 'react';
import logo from '../assets/medcap_logo.png';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="bg-pink-100 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={'/'}>
          <div className="flex items-center">
            <img src={logo} alt="MedCap Logo" className="w-10 h-10 mr-2 rounded-full" />
            <span className="text-xl font-bold">MedCap</span>
          </div>
        </Link>

        {/* Hamburger Icon for Small Screens */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div className={`hidden md:flex space-x-9`}>
          {isLoggedIn ? (
            <>
              <Link to={`/`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Home</a></Link>
              <Link to={`/medicalreport`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Report</a></Link>
              <Link to={`/healthcareplan`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Healthcare-Plan</a></Link>
              <Link to={`/dashboard`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Dashboard</a></Link>
            </>
          ) : (
            <>
              <Link to={`/`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Home</a></Link>
              <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Report</a></Link>
              <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Healthcare-Plan</a></Link>
              <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Dashboard</a></Link>
            </>
          )}
        </div>

        {/* Log In or Dashboard/Profile Picture */}
        <div className="hidden md:block">
          {isLoggedIn && user ? (
            <button onClick={handleProfileClick} className="flex items-center">
              <img
                src={user.profilePicture}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          ) : (
            <Link to={`/login`}>
              <button className="bg-pink-400 text-white px-4 py-2 rounded-full font-bold">
                Log In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-pink-100 flex flex-col items-center space-y-4 py-4 z-50 md:hidden">
            {isLoggedIn ? (
              <>
                <Link to={`/`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Home</a></Link>
                <Link to={`/medicalreport`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Report</a></Link>
                <Link to={`/healthcareplan`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Healthcare-Plan</a></Link>
                <Link to={`/dashboard`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Dashboard</a></Link>
              </>
            ) : (
              <>
                <Link to={`/`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Home</a></Link>
                <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Report</a></Link>
                <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Healthcare-Plan</a></Link>
                <Link to={`/login`}><a className="text-gray-700 font-bold hover:text-pink-500 transition">Dashboard</a></Link>
              </>
            )}
            {isLoggedIn && user ? (
              <button onClick={handleProfileClick} className="flex items-center">
                <img
                  src={user.profilePicture}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
            ) : (
              <Link to={`/login`}>
                <button className="bg-pink-400 text-white px-4 py-2 rounded-full font-bold">
                  Log In
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
