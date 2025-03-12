import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StreakListPage from "./pages/StreakListPage";
import StreakPage from "./pages/StreakPage";
import Testing from "./pages/Testing";
// import NewStreakPage from "./pages/NewStreakPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StreakListPage />} />
        <Route path="/streak/:id" element={<StreakPage />} />
        {/* <Route path="/new" element={<NewStreakPage />} /> */}
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </Router>
  );
};

export default App;
