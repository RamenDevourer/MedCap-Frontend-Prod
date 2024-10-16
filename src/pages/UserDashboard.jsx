import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AnalysisHistory from '../components/AnalysisHistory';
import UserDetails from '../components/UserDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfileForm from '../components/EditProfileForm';
import serverUrl from '../components/server_url';
import LoadingPopup from '../components/LoadingPopup'; // Import the LoadingPopup component

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${serverUrl}/api/auth/secure`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { user, medicalReports } = response.data;
        console.log(medicalReports);
        setUser(user);
        setAnalysisHistory(medicalReports);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.setItem('loggedIn', 'false');
    navigate('/login');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser); // Update the user state with the new data
  };


  return (
    <>
      <Header />
      {loading ? (
        <LoadingPopup />
      ) : (
        <>
          <div className="min-h-screen px-4 md:px-8 py-8">
            <div className="max-w-4xl mx-auto bg-pink-50 rounded-lg shadow-lg overflow-hidden">
              <h1 className="text-3xl font-bold text-center py-6 bg-pink-200 text-gray-800">User Dashboard</h1>

              <div className="p-6 px-0 md:px-6">
                <div className="mb-8 text-center">
                  <img 
                    src={user.profilePicture || "/api/placeholder/150/150"} 
                    alt="Profile" 
                    className="w-36 h-36 rounded-full mx-auto bg-gray-300"
                  />
                  <h2 className="text-xl font-semibold mb-2">{`${user.firstName} ${user.lastName}`}</h2>
                  <p className="text-gray-600 mb-4">{user.dateOfBirth}</p>
                  <button 
                    className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition duration-300"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button><br/>
                  <button 
                    className="bg-red-600 text-white mt-2 px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
                
                <div className="space-y-8">
                  <UserDetails user={user} />
                  <AnalysisHistory history={analysisHistory} />
                </div>
              </div>

              
            </div>
          </div>

          {isEditing && (
            <EditProfileForm 
              user={user}
              onClose={() => setIsEditing(false)}
              onUpdate={handleUpdateUser}
            />
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default UserDashboard;