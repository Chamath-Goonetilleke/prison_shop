import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './page/AdminDashboard';

function App() {
  return (
   <Routes>
    <Route path='/' element={<AdminDashboard/>} />
   </Routes>
  );
}

export default App;
