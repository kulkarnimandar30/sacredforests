import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MapView } from "./pages/MapView";
import { Database } from "./pages/Database";
import { DistrictWise } from "./pages/DistrictWise";
import { Articles } from "./pages/Articles";
import { About } from "./pages/About";
import { ReportThreat } from "./pages/ReportThreat";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/database" element={<Database />} />
            <Route path="/district-wise" element={<DistrictWise />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes - Only Report Threat */}
            <Route path="/report-threat" element={<ProtectedRoute><ReportThreat /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
