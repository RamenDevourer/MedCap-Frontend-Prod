import React from 'react';
import { Stethoscope, BarChart2, Settings } from 'lucide-react'; // Updated icons

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 m-4 md:mx-8 w-full sm:w-64">
    <div className="text-pink-400 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const Services = () => {
  return (
    <section className="bg-pink-200 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Services</h2>
        <div className="flex flex-wrap justify-center">
          <ServiceCard
            icon={<BarChart2 size={48} />} // Using a chart icon for progress tracking
            title="Comprehensive Health Monitoring"
            description="Track your progress over time to ensure your healthcare plans are effective and make necessary adjustments."
          />
          <ServiceCard
            icon={<Stethoscope size={48} />}
            title="Personalized Healthcare Plans"
            description="Tailored diet, lifestyle, and precautionary plans designed after analyzing your medical report."
          />
          <ServiceCard
            icon={<Settings size={48} />} // Using a settings icon for adjustments
            title="Data-Driven Wellness Adjustments"
            description="Refine and optimize your health strategies based on evolving data for sustainable improvements."
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
