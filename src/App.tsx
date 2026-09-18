import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { PerformanceInsightsPage } from "./pages/PerformanceInsightsPage";
import { StudentReportPage } from "./pages/StudentReportPage";
import { FutureReadyProfilesPage } from "./pages/FutureReadyProfilesPage";
import { StudentDataProvider } from "./context/StudentDataContext";

export const App: React.FC = () => {
  return (
    <StudentDataProvider>
      <HashRouter>
        <div className="min-h-screen bg-background text-text flex flex-col font-sans selection:bg-streamer-science selection:text-white">
          <Navbar />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/insights" element={<PerformanceInsightsPage />} />
            <Route path="/insights/student/:id" element={<StudentReportPage />} />
            <Route path="/profiles" element={<FutureReadyProfilesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {/* Footer */}
        <footer className="no-print bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img src={`${import.meta.env.BASE_URL}lof-logo.png`} alt="Lab of Future" className="h-6 w-auto object-contain opacity-90" />
              <span className="text-slate-300">|</span>
              <span className="font-display font-semibold text-slate-700 tracking-wide">STREAMER Framework Engine v1.0</span>
            </div>
            <div className="text-center sm:text-right text-[11px] text-slate-500">
              Operating K-12 Innovation Labs across Bengaluru, New Delhi, Dubai, Austin, and Shanghai.
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  </StudentDataProvider>
  );
};

export default App;

