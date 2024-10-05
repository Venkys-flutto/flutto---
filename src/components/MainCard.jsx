import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faGreaterThan,
  faLessThan,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// Step Indicator Component
const StepIndicator = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      {[1, 2, 3, 4].map((step, idx) => (
        <button
          key={idx}
          className={`rounded-full w-10 h-10 ${
            currentStep === step ? "bg-teal-600" : "bg-teal-500"
          } text-white flex items-center justify-center text-xl font-bold hover:bg-teal-600 transition-all duration-300 border-solid border-2 border-black`}
          onClick={() => setCurrentStep(step)} // Update currentStep on click
        >
          {step}
        </button>
      ))}
    </div>
  );
};

const MainCard = () => {
  const [currentCard, setCurrentCard] = useState(1); // Home Step
  const [aiModel, setAiModel] = useState("OpenAI (Default)"); // Select LLM model
  const [contentType, setContentType] = useState("");
  const [fileInput, setFileInput] = useState(null); // Input .csv file for output generation
  const [description, setDescription] = useState(""); // Describe about Output
  const [generatedJson, setGeneratedJson] = useState({}); // Json file for Backend
  const [backendOutput, setBackendOutput] = useState(null); // Backend output

  // Make to change card to its previous
  const handlePrev = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  // Change to next Card
  const handleNext = async () => {
    if (currentCard === 1) {
      if (!contentType) {
        alert("Please select content type");
        return;
      }
      setCurrentCard(2);
    } else if (currentCard === 2) {
      // Prepare form data for file and other inputs
      const formData = new FormData();
      formData.append("file", fileInput);  // Append file
      formData.append("aiModel", aiModel); // Append AI model
      formData.append("description", description); // Append description
  
      try {
        const response = await fetch("/datacollector/", {
          method: "POST",
          body: formData,  // Send form data as multipart
        });
  
        const data = await response.json();
        setBackendOutput(data.response_data);  // Set backend output in state
      } catch (error) {
        console.error("Error fetching backend output:", error);
      }
  
      setCurrentCard(3);
    }
  };
  // For File input
  const handleFileChange = (event) => {
    setFileInput(event.target.files[0]);
    
  
  };
  

  // To Describe the output
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Download generated JSON as a file
  const downloadFile = () => {
    const fileData = JSON.stringify(generatedJson, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated.json";
    link.click();
  };

  return (
    <div className="main-card flex flex-col items-center mx-4 max-w-screen-lg">
      <StepIndicator
        currentStep={currentCard}
        setCurrentStep={setCurrentCard}
      />{" "}
      {/* Include Step Indicator at the top */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full">
        {/* Previous Button */}
        <button
          className="flex rounded-full justify-center items-center bg-teal-500 text-white text-lg font-semibold p-3 mx-8 hover:bg-teal-600 transition-all duration-300 border-solid border-2 border-black"
          onClick={handlePrev}
        >
          <span className="mr-2">
            <FontAwesomeIcon icon={faLessThan} />
          </span>
        </button>

        {/* Main Card: Selecting output format and LLM model */}
        <div className="flex-grow">
          {currentCard === 1 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl  w-full flex flex-col lg:flex-row items-center justify-between">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800">
                  What would you like to generate?
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <select
                    className="bg-gray-200 p-2 rounded-md"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                  >
                    <option>OpenAI (Default)</option>
                    <option>llama</option>
                  </select>
                  <button className="text-2xl">
                    <FontAwesomeIcon icon={faCircleInfo} className="w=6 h=6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-6 pb-4 px-5">
                {["Video Script", "Course Content", "Project"].map(
                  (item, idx) => (
                    <button
                      key={idx}
                      className={`rounded-lg text-white text-2xl font-semibold p-4 hover:bg-teal-600 transition ${
                        contentType === item ? "bg-teal-600" : "bg-teal-500"
                      }`}
                      onClick={() => {
                        setContentType(item);
                        setCurrentCard(2);
                      }}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Second Card: File Input and Description */}
          {currentCard === 2 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-[300px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800 mb-4">
                  Upload CSV and Describe
                </div>
                <div className="flex justify-start mb-7">
                  <button className="text-2xl">
                    <FontAwesomeIcon icon={faCircleInfo} className="w=6 h=6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-6 pb-4 px-5">
                <textarea
                  className="bg-gray-200 p-4 rounded-md w-full"
                  placeholder="Enter description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="mb-4 flex flex-col"
                />
              </div>
            </div>
          )}

          {/* Third Card: Generating message*/}
          {currentCard === 3 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-[300px]">
              <div className="flex flex-row justify-center items-center space-x-5">
                <div className="text-4xl">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </div>
                <div className="text-4xl font-bold text-left text-gray-800">
                  Generating Output...
                </div>
              </div>
            </div>
          )}

          {/* Fourth Card: Display Backend Output */}
          {currentCard === 4 && backendOutput && (
            <div className="flex flex-col justify-center w-full space-y-6">
              <div className="text-4xl font-bold text-left text-gray-800 mb-4">
                Output from Backend
              </div>
              <pre className="bg-gray-200 p-4 rounded-md w-full">
                {backendOutput}
              </pre>
              <button
                className="rounded-lg bg-teal-500 text-white text-2xl font-semibold p-4 hover:bg-teal-600 transition"
                onClick={downloadFile}
              >
                View Online
              </button>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          className="flex rounded-full justify-center items-center bg-teal-500 text-white text-lg font-semibold p-3 mx-8 hover:bg-teal-600 transition-all duration-300 border-solid border-2 border-black"
          onClick={handleNext}
        >
          <span className="mr-2">
            <FontAwesomeIcon icon={faGreaterThan} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default MainCard;
