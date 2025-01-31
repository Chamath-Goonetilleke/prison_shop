import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NavBar from "./components/common/NavBar";
import SingleProductPage from "./pages/SingleProductPage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<SingleProductPage />} />
      </Routes>
    </>
  );
}

export default App;
