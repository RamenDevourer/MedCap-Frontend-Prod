import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import { formatDate } from '../utils/utils';
import Modal from './Modal.jsx';
import { FaFileAlt, FaPaperclip, FaSearch } from 'react-icons/fa'; 

const AnalysisHistory = ({ history }) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content, type) => {
    setSelectedContent(content);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
    setModalType(null);
  };

  const getFormData = (report) => {
    let formDataString = report.split('Attached file content:')[0] || '';
    formDataString = formDataString.split('Form content:')[1] || formDataString;
    const formDataPairs = {};
    
    formDataString.split('\n').forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        formDataPairs[key.trim()] = value.trim();
      }
    });

    return Object.keys(formDataPairs).length ? formDataPairs : null; // Return null if no form data
  };

  const getTruncFormData = (report) => {
    let formDataString = report.split('Attached file content:')[0] || '';
    formDataString = formDataString.split('Form content:')[1] || formDataString;

    return formDataString || "No Form Data"; 
  };

  const getAttachedFileContent = (report) => {
    let fileContent = report.match(/Attached file content:[\s\S]*/)?.[0] || 'No file content available';
    
    // Remove the prefix "Attached file content:" from the result
    fileContent = fileContent.replace("Attached file content:", "").trim();
  
    if (fileContent.includes("undefined")) {
      fileContent = "No attached files";
    }
    
    return fileContent;
  };

  const truncateText = (text, limit = 10) => {
    if (typeof text !== 'string') {
      return 'No content available';
    }
    return text.split(' ').slice(0, limit).join(' ') + '...';
  };

  const parseAnalysis = (analysisString) => {
    try {
      return analysisString ? JSON.parse(analysisString) : {};
    } catch (error) {
      console.error("Failed to parse analysis:", error);
      return {};
    }
  };

  // Sort history by createdAt date in descending order
  const sortedHistory = Array.isArray(history) ? 
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  const hasHistory = sortedHistory.length > 0;

  return (
    <div className="bg-gradient-to-r from-pink-200 to-pink-400 p-6 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold mb-6 text-center text-white">Analysis History</h3>
      <div className="space-y-4">
        {hasHistory ? (
          sortedHistory.map((analysis, index) => {
            const parsedAnalysis = parseAnalysis(analysis.analysis) || {};
            const summary = parsedAnalysis["Summary of Current Condition"] || 'No summary available';

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-102">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Form Data Column */}
                  <div className="flex flex-col justify-between h-full pt-4 md:pt-0 pb-2 md:pb-0">
                    <div>
                      <div className="flex items-center bg-blue-100 p-2 rounded-full mb-2">
                        <FaFileAlt className="text-blue-600" size={24} />
                        <p className="font-semibold text-lg ml-4">Report Form Data</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getFormData(analysis.report) ? truncateText(getTruncFormData(analysis.report), 10) : 'No form data available'}
                      </p>
                    </div>
                    <button
                      onClick={() => openModal(getFormData(analysis.report), 'Form Data')}
                      className="mt-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      View Form Data
                    </button>
                  </div>

                  {/* Attached File Content Column */}
                  <div className="flex flex-col justify-between h-full py-2 md:py-0">
                    <div>
                      <div className="flex items-center bg-green-100 p-2 rounded-full mb-2">
                        <FaPaperclip className="text-green-600" size={24} />
                        <p className="font-semibold text-lg ml-4">Uploaded File</p>
                      </div>
                      <p className="text-sm text-gray-600">{truncateText(getAttachedFileContent(analysis.report))}</p>
                    </div>
                    <button
                      onClick={() => openModal(getAttachedFileContent(analysis.report), 'Attached File')}
                      className="mt-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                    >
                      View Attached File
                    </button>
                  </div>

                  {/* Analysis Column */}
                  <div className="flex flex-col justify-between h-full pt-2 md:pt-0 pb-4 md:pb-0">
                    <div>
                      <div className="flex items-center bg-yellow-100 p-2 rounded-full mb-2">
                        <FaSearch className="text-yellow-600" size={24} />
                        <p className="font-semibold text-lg ml-4">Analysis</p>
                      </div>
                      <p className="text-sm text-gray-600">{truncateText(summary)}</p>
                    </div>
                    <button
                      onClick={() => openModal(parsedAnalysis, 'Analysis')}
                      className="mt-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200"
                    >
                      View Analysis
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">{formatDate(analysis.createdAt)}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-center">No analysis history available.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal} title={modalType}>
          {modalType === 'Form Data' ? (
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(selectedContent).length > 0 ? (
                Object.entries(selectedContent).map(([key, value], index) => (
                  <div key={index} className="flex justify-between border-b py-2">
                    <span className="font-semibold">{key}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))
              ) : (
                <p>No form data available.</p>
              )}
            </div>
          ) : (
            <div>
              {typeof selectedContent === 'object' ? (
                Object.entries(selectedContent).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b py-2">
                    <span className="font-semibold">{key}:</span>
                    <span className="text-gray-700">{JSON.stringify(value, null, 2)}</span>
                  </div>
                ))
              ) : (
                <p>{selectedContent}</p>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

// PropTypes to validate the props being passed
AnalysisHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      report: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      analysis: PropTypes.string.isRequired,
    })
  ),
};

AnalysisHistory.defaultProps = {
  history: [],
};

export default AnalysisHistory;
