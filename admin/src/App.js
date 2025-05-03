
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './page/AdminDashboard';
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from 'react';
function App() {
  return (
    <React.Fragment>
      <SpeedInsights/>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
