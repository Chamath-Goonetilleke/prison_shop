
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './page/AdminDashboard';
import React from 'react';
function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
