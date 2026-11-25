import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StreakListPage from "./pages/StreakListPage";
import StreakPage from "./pages/StreakPage";
import Testing from "./pages/Testing";
import HardCore from "./pages/HardCore";
import BingoPage from "./pages/BingoPage";
import LandingPage from "./pages/LandingPage";
import Lost from "./pages/LostPage";
import staticRoutes from "./staticRoutes.json";

const base = import.meta.env.BASE_URL;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={`${base}${staticRoutes.streaks}`}
          element={<StreakListPage />}
        />
        <Route
          path={`${base}${staticRoutes.streaks}/:id`}
          element={<StreakPage />}
        />
        <Route
          path={`${base}${staticRoutes.hardcore}`}
          element={<HardCore />}
        />
        <Route path={`${base}${staticRoutes.bingo}`} element={<BingoPage />} />
        <Route path={`${base}${staticRoutes.testing}`} element={<Testing />} />
        <Route path={base} element={<LandingPage />} />
        <Route path="/*" element={<Lost />} />
      </Routes>
    </Router>
  );
};

export default App;
