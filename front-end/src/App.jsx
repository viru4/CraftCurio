import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
// import Landing from './pages/Landing'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="p-6">Home</div>} />
        <Route path="/explore" element={<div className="p-6">Explore</div>} />
        <Route path="/categories" element={<div className="p-6">Categories</div>} />
        <Route path="/sell" element={<div className="p-6">For Artisans</div>} />
        <Route path="/about" element={<div className="p-6">About</div>} />
      </Routes>
    </>
  );
}
