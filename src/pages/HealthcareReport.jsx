import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import serverUrl from '../components/server_url';
import axios from 'axios';
import LoadingPopup from '../components/LoadingPopup';
import CarouselSection from '../components/Carousel';

const HealthPlanDashboard = () => {
  const [medicalReports, setMedicalReports] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Loading...");

  const fetchMedicalReports = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const response = await axios.get(`${serverUrl}/api/auth/secure`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMedicalReports(response.data.medicalReports);
      if (response.data.medicalReports.length == 0){
        throw  new Error("Please submit a medical report first!");
      } 
      const latestReport = response.data.medicalReports.reduce((latest, report) => {
        return new Date(report.createdAt) > new Date(latest.createdAt) ? report : latest;
      }, response.data.medicalReports[0]);

      const parsedAnalysis = JSON.parse(latestReport.analysis);
      setLatestAnalysis(parsedAnalysis);
      setLoading(false);
    } catch (error) {
      setIsError(true);
      if (error.message == "Please submit a medical report first!"){
        setLoaderMessage("Please submit a medical report first!");
        console.error('Error fetching medical reports:', error);

        // redirect after 5 seconds
        let countdown = 5;
        setLoaderMessage(`Please submit a medical report first!\nRedirecting in ${countdown}...`);
        
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown > 0) {
            setLoaderMessage(`Please submit a medical report first!\nRedirecting in ${countdown}...`);
          } else {
            clearInterval(interval);
            window.location.href = "/medicalreport";
          }
        }, 1000);
      }
      else{
        setLoaderMessage("Something went wrong!");
        console.error('Error fetching medical reports:', error);

        // redirecting after 5 seconds
        let countdown = 5;
        setLoaderMessage(`Something went wrong!\nRedirecting in ${countdown}...`);
        
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown > 0) {
            setLoaderMessage(`Something went wrong!\nRedirecting in ${countdown}...`);
          } else {
            clearInterval(interval);
            window.location.href = "/";
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    fetchMedicalReports();
  }, []);

  // Flatten the diet plans for "Eat" and "Avoid" sections
  const eatFoods = latestAnalysis["Diet Plan"]?.Eat?.map((food) => ({
    icon: '🍏',
    title: food.Food,
    description: food.Benefit,
  })) || [];

  const avoidFoods = latestAnalysis["Diet Plan"]?.Avoid?.map((food) => ({
    icon: '🚫',
    title: food.Food,
    description: food.Reason,
  })) || [];

  const exampleDietPlan = Object.entries(latestAnalysis["Diet Plan"]?.["Example Diet Plan"] || {}).map(([mealType, details]) => ({
    icon: '🍽️',
    title: `${mealType}:`,
    description: details,
  })) || [];

  // Map sodium content and daily calorie intake correctly
  const dailyCalorieIntake = [
    {
      icon: '📊',
      title: 'Recommended Calories',
      description: latestAnalysis["Diet Plan"]?.["Daily Calorie Intake"]?.Recommendation || 'N/A',
    },
    {
      icon: '🧂',
      title: 'Sodium Content',
      description: latestAnalysis["Diet Plan"]?.["Daily Calorie Intake"]?.["Sodium Content"] || 'N/A',
    }
  ];

  const exercises = latestAnalysis["Lifestyle Plan"]?.Exercise?.map((exercise) => ({
    icon: '🏋️‍♂️',
    title: exercise.Type,
    description: `${exercise.Frequency}, ${exercise.Duration}`,
  })) || [];

  // Use bracket notation to access keys with spaces
  const dailyActivities = latestAnalysis["Lifestyle Plan"]?.["Daily Physical Activities"]?.map((activity) => ({
    icon: '🏃‍♂️',
    title: activity,
    description: '',
  })) || [];

  const additionalSuggestions = [
    {
      icon: '⏱️',
      title: 'Recommended Time',
      description: latestAnalysis["Lifestyle Plan"]?.["Minimum Times"] || 'N/A',
    },
    {
      icon: '🧴',
      title: 'Skincare',
      description: latestAnalysis["Lifestyle Plan"]?.Skincare || 'N/A',
    },
    {
      icon: '🧘‍♂️',
      title: 'Meditation',
      description: latestAnalysis["Lifestyle Plan"]?.["Meditation and Relaxation Techniques"] || 'N/A',
    }
  ];

  const precautions = [
    {
      icon: '⚠️',
      title: 'At-Risk Diseases',
      description: latestAnalysis["Precaution Plan"]?.["At-Risk Diseases"] || 'N/A',
    },
    {
      icon: '🛡️',
      title: 'Precautions',
      description: latestAnalysis["Precaution Plan"]?.Precautions || 'N/A',
    }
  ];

  return (
    <>
      <Header />
      {loading ? (
        <LoadingPopup error={isError} message={loaderMessage} />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-purple-600 text-white p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold mb-4">Healthcare Plan</h1>
            <p className="text-sm">
              Your personalized healthcare plan based on your recent health analysis.
            </p>
          </div>
          <div className="bg-pink-50 p-6 rounded-b-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-8">Summary of Current Condition</h2>
              <p className="text-gray-700">{latestAnalysis['Summary of Current Condition'] || 'N/A'}</p>
            </div>

            {/* Diet Plan Section */}
            <h2 className="text-2xl font-bold mb-8">Diet Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CarouselSection items={eatFoods} title="Foods to Eat" leftAlign />
              <CarouselSection items={avoidFoods} title="Foods to Avoid" />
              <CarouselSection items={exampleDietPlan} title="Example Diet Plan" leftAlign />
              <CarouselSection items={dailyCalorieIntake} title="Daily Calorie Intake" />
            </div>

            {/* Lifestyle Plan Section */}
            <h2 className="text-2xl font-bold mb-8 mt-8">Lifestyle Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CarouselSection items={exercises} title="Exercise Plan" leftAlign />
              <CarouselSection items={dailyActivities} title="Daily Physical Activities" />
              <CarouselSection items={additionalSuggestions} title="Additional Tips" leftAlign />
              
            </div>
            <h2 className="text-2xl font-bold mb-8 mt-8">Precaution Plan</h2>
            <div className="">
              <CarouselSection items={precautions} title="" />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default HealthPlanDashboard;
