import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainCard from "./Components/MainCard.jsx";

import "./App.css";


function App() {
    
    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat">
      <MainCard />
    </div>
  );
}

export default App;
