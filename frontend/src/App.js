import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { MapView } from "./pages/MapView";
import { Database } from "./pages/Database";
import { Articles } from "./pages/Articles";
import { Resources } from "./pages/Resources";
import { News } from "./pages/News";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/database" element={<Database />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/news" element={<News />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
