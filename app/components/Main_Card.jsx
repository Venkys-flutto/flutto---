"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faGreaterThan,
  faLessThan,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const StepIndicator = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      {[1, 2, 3, 4].map((step, idx) => (
        <button
          key={idx}
          className={`rounded-full w-10 h-10 ${
            currentStep === step ? "bg-teal-600 text-black" : "bg-teal-500"
          } text-white flex items-center justify-center text-xl font-bold hover:bg-teal-600 transition-all duration-300 border-solid border-2 border-black`}
          onClick={() => setCurrentStep(step)}
        >
          {step}
        </button>
      ))}
    </div>
  );
};

const MainCard = () => {
  const [currentCard, setCurrentCard] = useState(1);
  const [formData, setFormData] = useState({
    aiModel: "OpenAI (Default)",
    contentType: [],
    fileInput: null,
    description: "",
    backendOutput: null,
  });
  const [isLoading, setIsLoading] = useState(false);//Added Loading

  const handlePrev = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleNext = async () => {
    // Validation to ensure all fields are filled
    if (currentCard === 1) {
      if (formData.contentType.length === 0) {
        alert("Please select at least one content type");
        return;
      }
      setCurrentCard(2);
    } else if (currentCard === 2) {
      if (!formData.description) {
        alert("Please enter a description");
        return;
      }
      if (!formData.fileInput) {
        alert("Please upload a Excel file");
        return;
      }
      // const jsonData = {
      //   ...formData,
      //   fileInput: formData.fileInput ? formData.fileInput.name : "",
      // };
      // setFormData(jsonData);
      // console.log("Form Data:", jsonData); // Log formData to console
      setCurrentCard(3);
    } else if (currentCard === 3) {
      // // Simulate sending to backend and display output in card
      // console.log("Sending to backend...");
      // console.log("Final Form Data before sending:", formData); // Log formData again
      try{
        setIsLoading(true);
        const backendUrl = "http://localhost:5500/datacollector/";

        const finalFormData = new FormData();
        finalFormData.append("aiModel", formData.aiModel);
        finalFormData.append("template_name", formData.contentType[0]);
        finalFormData.append("file", formData.fileInput);
        finalFormData.append("description", formData.description);
  
        const response = await fetch(backendUrl, {
          method: "POST",
          body: finalFormData,
        });
  
        if(!response.ok) {
          alert("Something went wrong. Please try again.");
          setIsLoading(false);
          return;
        }
  
        const result = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          backendOutput: result,
        }));
        setIsLoading(false);
        setCurrentCard(4);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        alert("Something went wrong. Please try again.");
        return;
      }


    } else if (currentCard === 4) {
      // Reset the formData and redirect to the first card
      setFormData({
        aiModel: "OpenAI (Default)",
        contentType: [],
        fileInput: null,
        description: "",
        backendOutput: null,
      });
      setCurrentCard(1);
    }
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      fileInput: event.target.files[0],
    }));
  };

  const handleDescriptionChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      description: event.target.value,
    }));
  };

  const toggleContentType = (item) => {
    setFormData((prevData) => {
      const isSelected = prevData.contentType.includes(item);
      const updatedContentType = isSelected
        ? prevData.contentType.filter((type) => type !== item)
        : [...prevData.contentType, item];
      return {
        ...prevData,
        contentType: updatedContentType,
      };
    });
  };

  return (
    <div className="main-card flex flex-col items-center mx-4 max-w-screen-lg">
      <StepIndicator
        currentStep={currentCard}
        setCurrentStep={setCurrentCard}
      />
      <div className="flex flex-col lg:flex-row items-center justify-between w-full">
        <button
          className="flex rounded-full justify-center items-center bg-teal-500 text-white text-lg font-semibold p-3 mx-8 hover:bg-teal-600 transition-all duration-300 border-solid border-2 border-black"
          onClick={handlePrev}
        >
          <span className="mr-2">
            <FontAwesomeIcon icon={faLessThan} />
          </span>
        </button>
        <div className="flex-grow">
          {currentCard === 1 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-auto min-h-[400px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800">
                  What would you like to generate?
                </div>
                <div className="flex items-center space-x-2 pt-8 sm:m-4">
                  <select
                    className="bg-gray-200 p-2 rounded-md"
                    value={formData.aiModel}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        aiModel: e.target.value,
                      }))
                    }
                  >
                    <option>OpenAI (Default)</option>
                    <option>llama</option>
                  </select>
                  <button className="text-2xl">
                    <FontAwesomeIcon icon={faCircleInfo} className="w=6 h=6" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col space-y-6 pb-4 px-5 mt-4 sm:mt-0 md:mt-4">
                {["Video Script", "Course Content", "Project"].map((item, idx) => (
                  <button
                    key={idx}
                    className={`rounded-lg text-white text-2xl font-semibold p-4 hover:bg-teal-600 transition-all duration-300 ${
                      formData.contentType.includes(item)
                        ? "bg-teal-600 outline outline-2 outline-black text-black"
                        : "bg-teal-500"
                    }`}
                    onClick={() => toggleContentType(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentCard === 2 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-auto min-h-[300px]">
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
              <div className="flex flex-col space-y-6 pb-4 px-5 w-full lg:w-auto">
                <textarea
                  className="bg-gray-100 p-4 rounded-lg w-full shadow-lg border border-gray-300 outline outline-2 outline-black focus:outline-black focus:border-teal-500 focus:ring-5 focus:ring-teal-300 transition-all duration-300"
                  placeholder="Enter description here..."
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />

                <label className="block text-gray-700 font-medium mb-2">
                  Upload Excel File:
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500 transition-all duration-300 cursor-pointer shadow-lg"
                />
              </div>
            </div>
          )}

          {currentCard === 3 && isLoading && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-auto min-h-[300px]">
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

          {currentCard === 4 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl w-full flex flex-col lg:flex-row items-center justify-between h-auto min-h-[300px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800">
                  Output Generated!
                </div>
                <div className="text-2xl font-semibold text-left text-gray-600">
                  <pre>{JSON.stringify(formData.backendOutput, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

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
