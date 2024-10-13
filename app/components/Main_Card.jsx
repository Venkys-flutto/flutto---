"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faGreaterThan,
  faLessThan,
  faSpinner,
  faDownload,
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
    // } else if (currentCard === 3) {
    //   // // Simulate sending to backend and display output in card
    //   console.log("Sending to backend...");
    //   console.log("Final Form Data before sending:", formData); // Log formData again
    //   try{
    //     setIsLoading(true);
    //     const backendUrl = "http://localhost:5500/datacollector/";

    //     const finalFormData = new FormData();
    //     finalFormData.append("aiModel", formData.aiModel);
    //     finalFormData.append("template_name", formData.contentType[0]);
    //     finalFormData.append("file", formData.fileInput);
    //     finalFormData.append("description", formData.description);
  
    //     const response = await fetch(backendUrl, {
    //       method: "POST",
    //       body: finalFormData,
    //     });
  
    //     if(!response.ok) {
    //       alert("Something went wrong. Please try again.");
    //       setIsLoading(false);
    //       return;
    //     }
  
    //     const result = await response.json();
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       backendOutput: result,
    //     }));
    //     // setIsLoading(false);
    //     setCurrentCard(4);
    //   } catch (error) {
    //     setIsLoading(false);
    //     console.error(error);
    //     alert("Something went wrong. Please try again.");
    //     return;
    //   }
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

  const handleGenerate = async () => {
    console.log("Sending to backend...");
    console.log("Final Form Data before sending:", formData); // Log formData again
    try {
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

      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const result = await response.blob();
      const url = window.URL.createObjectURL(result);
      setFormData((prevData) => ({
        ...prevData,
        backendOutput: url,
      }));
      setCurrentCard(4); // Move to the output card
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = formData.backendOutput;
    link.download = "llm_responses.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
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
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl  flex flex-col lg:flex-row items-center justify-between h-auto min-h-[400px] w-[750px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800">
                  <h1>What would you like to generate?</h1>
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
                  {/* <button className="text-2xl">
                    <FontAwesomeIcon icon={faCircleInfo} className="w=6 h=6" />
                  </button> */}
                  {/* Button with Tooltip */}
              <button className="group relative inline-flex items-center justify-center p-0.5 text-2xl text-gray-900 rounded-lg bg-transparent focus:outline-none">
                <FontAwesomeIcon icon={faCircleInfo} className="w-6 h-6" />
                
                {/* Tooltip Container */}
                <div className="hidden group-hover:block absolute left-full top-1/2 z-50 -translate-y-1/2 flex-col items-start rounded-sm text-center text-sm text-slate-300 ml-2">
                  <div className="rounded-md bg-black py-1 px-2 outline outline-2 outline-teal-500">
                    <p className="whitespace-nowrap">Choose AI Model</p>
                  </div>              
                </div>
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
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl  flex flex-col lg:flex-row items-center justify-between h-auto min-h-[400px] w-[750px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800 mb-4">
                  Upload CSV and Describe
                </div>
                <div className="flex justify-start mb-7">
                  {/* <button className="text-2xl">
                    <FontAwesomeIcon icon={faCircleInfo} className="w=6 h=6" />
                  </button> */}

                  {/* Button with Tooltip */}
              <button className="group relative inline-flex items-center justify-center p-0.5 text-2xl text-gray-900 rounded-lg bg-transparent focus:outline-none">
                <FontAwesomeIcon icon={faCircleInfo} className="w-6 h-6" />
                
                {/* Tooltip Container */}
                <div className="hidden group-hover:block absolute left-full top-1/2 z-50 -translate-y-1/2 flex-col items-start rounded-sm text-center text-sm text-slate-300 ml-2">
                  <div className="rounded-md bg-black py-1 px-2 outline outline-2 outline-teal-600">
                    <p className="whitespace-nowrap">Upload Your File and Describe </p>
                  </div>              
                </div>
                </button>
                </div>
              </div>
              <div className="flex flex-col space-y-6 pb-4 px-5 w-full lg:w-auto">
                <textarea
                  className="bg-gray-200 p-4 rounded-lg w-full shadow-lg border border-gray-300 outline outline-2 outline-black focus:outline-black focus:border-teal-500 focus:ring-5 focus:ring-teal-300 transition-all duration-300"
                  placeholder="Enter Your description here..."
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />

                <label className="block text-gray-700 font-medium mb-2">
                  Upload Excel File:
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-500 transition-all duration-300 cursor-pointer shadow-xl rounded-lg"
                />
              </div>
            </div>
          )}

          {currentCard === 3 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl  flex flex-col lg:flex-row items-center justify-center h-auto min-h-[400px] w-[750px]">
              {/* <div className="flex flex-row justify-center items-center space-x-5">
                <div className="text-4xl">
                  {isLoading && <FontAwesomeIcon icon={faSpinner} spin />   }
                </div>
                <div className="text-4xl font-bold text-center text-gray-800">
                  Generating Output...
                </div>
              </div> */}
              <div className="flex flex-col justify-center items-center space-y-6 h-full">
                  <div className="text-4xl font-bold text-center text-gray-800 mb-4">
                    Confirm Your Data 
                  </div>
                  <div className="flex flex-col space-y-2 text-lg text-gray-700 w-full">
                    <p>Model: <span className="font-semibold">{formData.aiModel}</span></p>
                    <p>Content Types: <span className="font-semibold">{formData.contentType.join(', ')}</span></p>
                    {/* <p>Description: <span className="font-semibold">{formData.description}</span></p> */}

                    <div className="flex  items-center space-x-4">
                    <p className="font-semibold  text-gray-800">Description:</p>

                      <textarea
                        readOnly
                        value={formData.description}
                        className="w-full max-w-md h-12 p-2  bg-white bg-opacity-20 rounded-lg border border-teal-500 shadow-inner resize-vertical text-gray-800 focus:outline-none"
                      />
                    </div>
                    <p>File: <span className="font-semibold">{formData.fileInput ? formData.fileInput.name : 'No file uploaded'}</span></p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    className={`mt-4 rounded-lg text-white text-xl font-semibold p-4 bg-teal-500 hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg`}
                    disabled={isLoading} // Disable button while loading
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <h1>Generating ...</h1>
                      </div>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>
          )}

          {currentCard === 4 && (
            <div className="bg-white bg-opacity-35 backdrop-blur-md rounded-[50px] shadow-xl p-8 max-w-3xl flex flex-col lg:flex-row items-center justify-between h-auto min-h-[400px] w-[750px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-4xl font-bold text-left text-gray-800">
                  Output Generated!
                </div>
                {/* <div className="text-2xl font-semibold text-left text-gray-600">
                  <pre>{JSON.stringify(formData.backendOutput, null, 2)}</pre> */}

                {/* </div> */}
                {/* {formData.backendOutput && (
                  <textarea
                  readOnly
                  value={formData.backendOutput}
                  className="w-full max-w-md h-24 p-2  bg-white bg-opacity-20 rounded-lg border border-teal-500 shadow-inner resize-vertical text-gray-800 focus:outline-none"
                />
                )} */}
                <button
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-white text-2xl font-semibold p-4 rounded-lg transition-all duration-300"
                onClick={handleDownload}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Output
              </button>


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
