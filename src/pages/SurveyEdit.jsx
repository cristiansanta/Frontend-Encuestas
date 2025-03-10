
import React, { useState } from "react";

const SurveyEdit = ({ surveyData, onClose, onSave }) => {
  const [survey, setSurvey] = useState(surveyData);

  // Manejar cambios en campos
  const handleChange = (e, sectionIndex, field, isSection = false) => {
    const updatedSurvey = { ...survey };

    if (isSection) {
      updatedSurvey.sections[sectionIndex][field] = e.target.value;
    } else {
      updatedSurvey[field] = e.target.value;
    }
    setSurvey(updatedSurvey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Survey</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-6">
          {/* 1. Survey Details */}
          <div>
            <h3 className="font-semibold mb-2">1. Survey Details</h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded mb-2"
              value={survey.title}
              onChange={(e) => handleChange(e, null, "title")}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              rows="3"
              value={survey.description}
              onChange={(e) => handleChange(e, null, "description")}
            ></textarea>
          </div>

          {/* 2. Survey Sections */}
          <div>
            <h3 className="font-semibold mb-2">2. Survey Sections</h3>
            {survey.sections.map((section, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <details>
                  <summary className="cursor-pointer font-medium">
                    Section {index + 1}: {section.title}
                  </summary>
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Section Title"
                      className="w-full p-2 border rounded"
                      value={section.title}
                      onChange={(e) =>
                        handleChange(e, index, "title", true)
                      }
                    />
                    <textarea
                      placeholder="Section Description"
                      className="w-full p-2 border rounded"
                      rows="2"
                      value={section.description}
                      onChange={(e) =>
                        handleChange(e, index, "description", true)
                      }
                    ></textarea>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(survey)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyEdit;
