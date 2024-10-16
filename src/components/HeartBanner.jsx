import React from 'react';
import { FaHeartbeat, FaRobot, FaAppleAlt } from 'react-icons/fa'; // Import icons
import "../custom-css/HeartBanner.css"

const HealthSection = () => {

  return (
    <div className="bg-gradient-to-r from-pink-400 to-purple-500 py-2 relative overflow-hidden">
      {/* Background Heartbeat Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <svg viewBox="0 0 100 100" className="h-48 w-48">
          <path
            fill="none"
            stroke="white"
            strokeWidth="2"
            d="M 0 50 L 20 30 L 40 60 L 60 40 L 80 70 L 100 50"
            className="heartbeat-animation"
          />
        </svg>
      </div>


      <div className="container mx-auto py-4 md:px-12 flex flex-col md:flex-row justify-between text-white text-center relative z-10">
        {/* AI Healthcare Plan */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaRobot className="text-4xl mb-2" />
          <div className="text-3xl font-bold">AI Healthcare Plan</div>
          <div>Get personalized AI-driven healthcare plans</div>
        </div>
        
        {/* Healthy Heart */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaHeartbeat className="text-4xl mb-2" />
          <div className="text-3xl font-bold">Healthy Heart</div>
          <div>Keep your heart in shape!</div>
        </div>
        
        {/* Nutrition */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaAppleAlt className="text-4xl mb-2" />
          <div className="text-3xl font-bold">Nutrition</div>
          <div>Eat healthy, stay healthy!</div>
        </div>
      </div>
    </div>
  );
};

export default HealthSection;
