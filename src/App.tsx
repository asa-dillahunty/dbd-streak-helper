import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StreakListPage from "./pages/StreakListPage";
import StreakPage from "./pages/StreakPage";
import Testing from "./pages/Testing";
import HardCore from "./pages/HardCore";
// import NewStreakPage from "./pages/NewStreakPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dbd-streak-helper/" element={<StreakListPage />} />
        <Route path="/dbd-streak-helper/streak/:id" element={<StreakPage />} />
        <Route path="/dbd-streak-helper/hardcore/" element={<HardCore />} />
        {/* <Route path="/new" element={<NewStreakPage />} /> */}
        <Route path="/dbd-streak-helper/testing" element={<Testing />} />
      </Routes>
    </Router>
  );
};

export default App;
