import React, { useState } from 'react';
import image from '../assets/aboutIMG.png';

const About = () => {
  // State variable to control the popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to show the popup
  const handleLearnMoreClick = () => {
    setIsPopupVisible(true);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <section className="bg-[#ffffff] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">About Us</h2>
        <div className="flex flex-col-reverse md:flex-row mx-4 items-center">
          <div className="w-full md:w-2/3 pr-0 md:pr-8 mt-8 md:mt-0 md:px-6">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">A Vision for Health: Students Innovating with AI</h3>
            <p className="text-lg md:text-xl mb-6">
              This project is the brainchild of two college students passionate about leveraging technology to improve health outcomes. At MedCap, we aim to empower individuals to take control of their well-being through personalized AI-driven solutions and resources.
            </p>
            <button
              className="bg-pink-400 text-white px-6 py-3 rounded-full text-lg w-full md:w-auto"
              onClick={handleLearnMoreClick} // Add click event
            >
              Learn More
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
              <img
                src={image}
                alt="MedCap Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup for "Learn More" button */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h4 className="text-xl font-bold mb-4">Under Construction</h4>
            <p className="mb-4">This section is currently being developed. Please check back later!</p>
            <button
              className="bg-pink-400 text-white px-4 py-2 rounded"
              onClick={handleClosePopup} // Add close event
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
