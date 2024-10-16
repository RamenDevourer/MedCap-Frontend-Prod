import React from 'react';
import { FaClipboardList, FaChartLine, FaRegFilePdf } from 'react-icons/fa'; // Import new icons
import "../custom-css/HeartBanner.css"; // Ensure this includes necessary styles

const StatisticsBanner = () => {
  return (
    <div className="relative overflow-hidden py-2">
      {/* Background Gradient (dark left, light right) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-pink-300"></div>

      {/* Background SVG Shapes for added texture */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#cc99ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff99cc', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        {/* Reverted bubble positions and sizes */}
        <circle cx="85" cy="10" r="20" fill="url(#gradient)" opacity="0.5" />
        <circle cx="350" cy="30" r="20" fill="url(#gradient)" opacity="0.5" />
        <circle cx="5" cy="50" r="20" fill="url(#gradient)" opacity="0.5" />
        <circle cx="150" cy="90" r="20" fill="url(#gradient)" opacity="0.5" />
        <circle cx="500" cy="100" r="20" fill="url(#gradient)" opacity="0.5" />
      </svg>

      {/* Background Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <svg viewBox="0 0 100 100" className="h-72 w-72">
          <path
            fill="none"
            stroke="white"
            strokeWidth="2"
            d="M 10 50 Q 30 10, 50 50 T 90 50"
            className="heartbeat-animation"
          />
        </svg>
      </div>

      <div className="container mx-auto py-4 md:px-12 flex flex-col md:flex-row justify-between text-white text-center relative z-10">
        {/* Progress Tracking */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaChartLine className="text-4xl mb-2" />
          <div className="text-3xl font-bold">Track Your Progress</div>
          <div>Monitor your health journey with historical data insights.</div>
        </div>
        
        {/* Personalized Healthcare Plans */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaClipboardList className="text-4xl mb-2" />
          <div className="text-3xl font-bold">Tailored Healthcare Plans</div>
          <div>Receive personalized diet, lifestyle, and precaution plans.</div>
        </div>
        
        {/* Medical Report Analysis */}
        <div className="mb-4 md:mb-0 flex flex-col items-center flex-1 py-4 md:py-0">
          <FaRegFilePdf className="text-4xl mb-2" />
          <div className="text-3xl font-bold">Upload Medical Reports</div>
          <div>Instant analysis and AI-generated plans in seconds!</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsBanner;
