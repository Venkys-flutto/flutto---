import React from "react";
import StepIndicator from "./components/StepIndicator.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainCard from "./Components/MainCard.jsx"; 

import "./App.css";

function App() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat">
            {/* <StepIndicator /> */}
            <MainCard />
        </div>
    );
}

export default App;
