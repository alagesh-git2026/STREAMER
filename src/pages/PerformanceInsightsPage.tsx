import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import {
  calculateStreamerPillars,
  getTopStrengthPillars,
  getRubricBand,
  calculateFutureReadyScore
} from "../utils/calculations";
import { PowerBiKpiCards } from "../components/dashboard/PowerBiKpiCards";
import { GradeDistributionDonut } from "../components/dashboard/GradeDistributionDonut";
import { TwentyFirstCenturySkillsChart } from "../components/dashboard/TwentyFirstCenturySkillsChart";
import { PerformanceTrendChart } from "../components/dashboard/PerformanceTrendChart";
import { PillarPerformanceBarChart } from "../components/dashboard/PillarPerformanceBarChart";
import { AnonymousPeerComparison } from "../components/dashboard/AnonymousPeerComparison";
import { SourceDataEditorModal } from "../components/dashboard/SourceDataEditorModal";
import {
  LayoutDashboard,
  Users,
  Layers,
  Database,
  RotateCcw,
  Search,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Calendar,
  Presentation,
  Printer,
  FileSpreadsheet,
  Sparkles,
  Target,
  User,
  X
} from "lucide-react";
import { exportPerformanceToExcel, triggerLandscapePdfPrint, extractStudentProfileInsights } from "../utils/executiveExportUtils";
import { ExecutiveLandscapeReport } from "../components/dashboard/ExecutiveLandscapeReport";
import { ExecutivePeerTrackerReport } from "../components/dashboard/ExecutivePeerTrackerReport";
import { ExecutiveComprehensiveDossierReport } from "../components/dashboard/ExecutiveComprehensiveDossierReport";

export const PerformanceInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, quarterlyMilestones, monthlyMilestones } = useStudentData();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<"summary" | "tracker" | "insights" | "data">("summary");

  // Slicer / Filter States
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedCentre, setSelectedCentre] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedStrength, setSelectedStrength] = useState<string>("All");
  const [selectedStudentFocus, setSelectedStudentFocus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Available STREAMER Top Strength Options
  const STRENGTH_OPTIONS = [
    { label: "All Strengths", value: "All", color: "#64748B" },
    { label: "Science", value: "Science", color: "#2255A4" },
    { label: "Technology", value: "Technology", color: "#0E7C6F" },
    { label: "Research", value: "Research", color: "#B65529" },
    { label: "Engineering", value: "Engineering", color: "#5A3FA0" },
    { label: "Arts", value: "Arts", color: "#C23768" },
    { label: "Mathematics", value: "Mathematics", color: "#41722E" },
    { label: "Entrepreneurship", value: "Entrepreneurship", color: "#9A6C10" },
    { label: "Resilience", value: "Resilience", color: "#1D6FA5" },
  ];

  // Presenter Mode & Student Spotlight States
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [spotlightStudentId, setSpotlightStudentId] = useState<string | null>(null);

  // Source Data Editor Modal State
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  // Context-Aware Peer Tracker & Dossier States
  const [trackerFocalStudentId, setTrackerFocalStudentId] = useState<string>("");
  const [trackerScope, setTrackerScope] = useState<"centre" | "all">("centre");
  const [dossierFocalStudentId, setDossierFocalStudentId] = useState<string>("");

  // Keyboard shortcut: Esc to exit presenter mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPresenterMode) {
        setIsPresenterMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenterMode]);

  // Available unique filter values
  const academicYears = ["All", "2025-2026 (Aug–Mar)", "2024-2025 (Aug–Mar)"];

  // Available unique filter values
  const centres = useMemo(() => {
    const set = new Set(students.map(s => s.centre.city));
    return ["All", ...Array.from(set)];
  }, [students]);

  const batches = useMemo(() => {
    const set = new Set(students.map(s => s.batch));
    return ["All", ...Array.from(set)];
  }, [students]);

  const domains = ["All", "Aerospace", "Robotics", "Space & Astro"];

  // Cohort Students: Filtered by Year, Centre, Batch, Domain, and Top Strength
  // Retains all peers for the Peer Tracker so selecting a focal student does not wipe out classmates!
  const cohortStudents = useMemo(() => {
    return students.filter(student => {
      const matchYear = selectedYear === "All" ||
        (student.academicYear ? student.academicYear === selectedYear.slice(0, 9) : selectedYear.includes("2025-2026"));
      const matchCentre = selectedCentre === "All" || student.centre.city === selectedCentre;
      const matchBatch = selectedBatch === "All" || student.batch === selectedBatch;
      const matchDomain = selectedDomain === "All" || student.domain === selectedDomain;
      const matchStrength = selectedStrength === "All" || (() => {
        const pillars = calculateStreamerPillars(student);
        const maxScore = Math.max(...pillars.map(p => p.ytd));
        return pillars.some(p => p.pillar === selectedStrength && p.ytd === maxScore);
      })();
      return matchYear && matchCentre && matchBatch && matchDomain && matchStrength;
    });
  }, [students, selectedYear, selectedCentre, selectedBatch, selectedDomain, selectedStrength]);

  // Filtered Students (used for Dossiers and Summary view):
  // Also filters by selectedStudentFocus and searchQuery
  const filteredStudents = useMemo(() => {
    return cohortStudents.filter(student => {
      const matchFocus = selectedStudentFocus === "All" || student.id === selectedStudentFocus;
      const matchSearch = searchQuery.trim() === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.centre.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFocus && matchSearch;
    });
  }, [cohortStudents, selectedStudentFocus, searchQuery]);

  // Reset Slicers function
  const handleResetFilters = () => {
    setSelectedYear("All");
    setSelectedCentre("All");
    setSelectedBatch("All");
    setSelectedDomain("All");
    setSelectedStrength("All");
    setSelectedStudentFocus("All");
    setSearchQuery("");
  };

  // Top Students Ranked for the Summary Table
  const rankedStudents = useMemo(() => {
    return filteredStudents.map(student => {
      const pillars = calculateStreamerPillars(student);
      const avg = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(2));
      const fr = calculateFutureReadyScore(student);
      return {
        id: student.id,
        name: student.name,
        city: student.centre.city,
        grade: student.grade,
        avgScore: avg,
        weightedAvg: fr.futureReadyScore,
        passRate: avg >= 65 ? "100%" : "0%",
        band: getRubricBand(avg),
      };
    }).sort((a, b) => b.weightedAvg - a.weightedAvg);
  }, [filteredStudents]);

  // Synchronize focal student defaults with cohort list
  React.useEffect(() => {
    if (cohortStudents.length > 0) {
      if (!trackerFocalStudentId || !cohortStudents.some(s => s.id === trackerFocalStudentId)) {
        setTrackerFocalStudentId(cohortStudents[0].id);
      }
      if (!dossierFocalStudentId || !cohortStudents.some(s => s.id === dossierFocalStudentId)) {
        setDossierFocalStudentId(cohortStudents[0].id);
      }
    }
  }, [cohortStudents, trackerFocalStudentId, dossierFocalStudentId]);

  // When a student is chosen from the top Filter Student dropdown, immediately focus that student
  React.useEffect(() => {
    if (selectedStudentFocus !== "All") {
      setTrackerFocalStudentId(selectedStudentFocus);
      setDossierFocalStudentId(selectedStudentFocus);
    }
  }, [selectedStudentFocus]);

  // Context-aware PDF export handler
  const handlePdfExport = () => {
    if (activeTab === "tracker") {
      const focal = students.find(s => s.id === trackerFocalStudentId);
      triggerLandscapePdfPrint(`Peer_Tracker_${focal ? focal.name : "Report"}`);
    } else if (activeTab === "insights") {
      triggerLandscapePdfPrint(`Comprehensive_Student_Dossiers_${selectedCentre !== "All" ? selectedCentre : "Cohort"}`);
    } else {
      triggerLandscapePdfPrint("Executive_Summary_Dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Interactive Screen Dashboard Canvas - Hidden when exporting to PDF / printing */}
      <div className="flex flex-col md:flex-row min-h-screen hide-on-print">
        {/* 1. POWER BI DARK NAVIGATION RAIL */}
        <aside className={`w-64 bg-[#121620] text-slate-300 flex-col justify-between shrink-0 select-none ${isPresenterMode ? "hidden" : "flex"} border-r border-slate-800 shadow-xl`}>
        <div>
          {/* Institution Emblem Header */}
          <div className="p-6 flex flex-col items-center justify-center border-b border-white/10 text-center">
            {/* School / Institution Classic SVG Logo matching Power BI reference */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 text-white shadow-inner">
              <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                {/* Roof / Pediment */}
                <path d="M32 10L12 24H52L32 10Z" fill="white" />
                {/* Flagpole & Flag */}
                <line x1="32" y1="10" x2="32" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 4H39L37 7L39 10H32" fill="white" />
                {/* Architrave */}
                <rect x="14" y="24" width="36" height="3" fill="white" />
                {/* Pillars */}
                <rect x="17" y="27" width="5" height="19" fill="white" />
                <rect x="25" y="27" width="4" height="19" fill="white" />
                <rect x="35" y="27" width="4" height="19" fill="white" />
                <rect x="42" y="27" width="5" height="19" fill="white" />
                {/* Clock / Center Crest */}
                <circle cx="32" cy="18" r="3" fill="#1E222D" />
                {/* Base stairs */}
                <rect x="10" y="46" width="44" height="4" fill="white" />
                <rect x="7" y="50" width="50" height="4" fill="white" opacity="0.8" />
              </svg>
            </div>
            <h2 className="text-sm font-display font-bold tracking-wider uppercase text-white">
              Lab of Future
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">
              Analytics Hub
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5" aria-label="Dashboard Navigation">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "summary"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Summary</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "tracker"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Peer Tracker</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "insights"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Student Dossiers</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditorModalOpen(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Data Editor</span>
            </button>
          </nav>
        </div>

        {/* Profile Footer matching Power BI screenshot */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
            NI
          </div>
          <div className="text-left overflow-hidden">
            <div className="text-xs font-bold text-white truncate">Nina Ikpe</div>
            <div className="text-[10px] text-slate-400 truncate">Lead Evaluator & Admin</div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN POWER BI DASHBOARD CANVAS */}
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar hide-on-print">
        {/* Presenter Mode Active Header */}
        {isPresenterMode && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-md animate-in slide-in-from-top duration-200">
            <div className="flex items-center space-x-2">
              <Presentation className="w-4 h-4 text-blue-200" />
              <span>Executive Presentation Mode Active • Fullscreen Experience</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono text-blue-200">Press ESC to exit</span>
              <button
                type="button"
                onClick={() => setIsPresenterMode(false)}
                className="px-2.5 py-1 rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-colors font-black text-xs cursor-pointer shadow-xs"
              >
                Exit Presenter
              </button>
            </div>
          </div>
        )}

        {/* Top Power BI Slicers / Filters Bar */}
        <div className="bg-white border-b border-slate-200/80 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight uppercase">
                Education Performance Analysis
              </h1>
              <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                Academic Performance Summary: A quick snapshot of Overall Achievements
              </p>
            </div>

            {/* Slicers & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-[#1E222D] text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              {/* Slicer 0: Academic Year */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
                  <Calendar className="w-2.5 h-2.5 text-slate-400" />
                  <span>Select Year</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {academicYears.map(y => (
                    <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>
                  ))}
                </select>
              </div>

              {/* Slicer 1: Centre */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Select Centre
                </label>
                <select
                  value={selectedCentre}
                  onChange={(e) => setSelectedCentre(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {centres.map(c => (
                    <option key={c} value={c}>{c === "All" ? "All Centres" : c}</option>
                  ))}
                </select>
              </div>

              {/* Slicer 2: Batch */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Select Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {batches.map(b => (
                    <option key={b} value={b}>{b === "All" ? "All Batches" : b}</option>
                  ))}
                </select>
              </div>

              {/* Slicer 3: Domain */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Select Domain
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {domains.map(d => (
                    <option key={d} value={d}>{d === "All" ? "All Domains" : d}</option>
                  ))}
                </select>
              </div>

              {/* Slicer 4: STREAMER Top Strength */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Top Strength</span>
                </label>
                <select
                  value={selectedStrength}
                  onChange={(e) => setSelectedStrength(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {STRENGTH_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Slicer 5: Filter Student (Dropdown) */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
                  <User className="w-2.5 h-2.5 text-slate-400" />
                  <span>Filter Student</span>
                </label>
                <select
                  value={selectedStudentFocus}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedStudentFocus(val);
                    if (val !== "All") {
                      setTrackerFocalStudentId(val);
                      setDossierFocalStudentId(val);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer max-w-[140px] truncate"
                >
                  <option value="All">All Students</option>
                  {cohortStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.centre.city})</option>
                  ))}
                </select>
              </div>

              {/* Search input */}
              <div className="flex flex-col">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search name/ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 w-28 sm:w-32 font-medium"
                  />
                </div>
              </div>

              {/* Action Toolbar: Presenter, PDF, Excel, Data Editor */}
              <div className="flex items-center space-x-1.5 self-end">
                <button
                  type="button"
                  onClick={() => setIsPresenterMode(!isPresenterMode)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isPresenterMode
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
                  }`}
                  title="Toggle Fullscreen Interactive Presentation Mode"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isPresenterMode ? "Exit" : "Present"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePdfExport}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  title={`Export PDF for ${activeTab === "tracker" ? "Peer Tracker" : activeTab === "insights" ? "Student Dossier" : "Summary Dashboard"}`}
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportPerformanceToExcel({
                    students: filteredStudents,
                    quarterlyMilestones,
                    monthlyMilestones,
                    selectedCentre,
                    selectedYear,
                  })}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Export complete workbook in Excel CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Source Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* TAB 1: SUMMARY (POWER BI DASHBOARD MATCHING SCREENSHOT) */}
          {activeTab === "summary" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Row 1: 4 Top KPI Cards */}
              <PowerBiKpiCards students={filteredStudents} />

              {/* Row 2: Middle Visualizations Grid (Grade Donut, 21st Century Skills, Performance Trend) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 1. Grade / Rubric Band Donut (3 cols on lg) */}
                <div className="md:col-span-6 lg:col-span-3 min-h-[310px]">
                  <GradeDistributionDonut students={filteredStudents} />
                </div>

                {/* 2. 21st Century Skills (4 cols on lg) */}
                <div className="md:col-span-6 lg:col-span-4 min-h-[310px]">
                  <TwentyFirstCenturySkillsChart students={filteredStudents} />
                </div>

                {/* 3. Performance Trend Column Chart with Benchmark Lines (5 cols on lg) */}
                <div className="md:col-span-12 lg:col-span-5 min-h-[310px]">
                  <PerformanceTrendChart students={filteredStudents} selectedYear={selectedYear} />
                </div>
              </div>

              {/* Row 3: Bottom Visualizations Grid (Pillar Combo Chart + Top Students Table) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 1. Subject & Pillar Performance Combo Bar & Line Chart (7 cols) */}
                <div className="lg:col-span-7">
                  <PillarPerformanceBarChart students={filteredStudents} />
                </div>

                {/* 2. Top Students Table matching Power BI screenshot (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Top Performing Students
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab("tracker")}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Peer Tracker</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 italic mb-3">
                      Ranked by Future Ready composite weighted index
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            <th className="py-2 px-2">Rank</th>
                            <th className="py-2 px-2">Student</th>
                            <th className="py-2 px-2 font-mono">ID</th>
                            <th className="py-2 px-2 text-right">Avg Score</th>
                            <th className="py-2 px-2 text-right">Weighted</th>
                            <th className="py-2 px-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rankedStudents.slice(0, 5).map((s, idx) => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-2 font-mono font-bold text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {s.name.charAt(0)}
                                  </div>
                                  <span className="font-bold text-slate-900 truncate max-w-[110px]">
                                    {s.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500">
                                {s.id}
                              </td>
                              <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-800">
                                {s.avgScore}
                              </td>
                              <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600">
                                {s.weightedAvg}%
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setSpotlightStudentId(s.id)}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center space-x-1"
                                    title="View student strengths and scope for growth"
                                  >
                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                    <span>Profile</span>
                                  </button>
                                  <span className="text-slate-300">•</span>
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/insights/student/${s.id}`)}
                                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                                  >
                                    Dossier
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span>Showing top 5 of {rankedStudents.length} students</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("insights")}
                      className="font-bold text-streamer-science hover:underline cursor-pointer text-xs"
                    >
                      View All Dossiers →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANONYMOUS PEER TRACKER */}
          {activeTab === "tracker" && (
            <div className="animate-in fade-in duration-200">
              <AnonymousPeerComparison
                students={cohortStudents}
                selectedStudentId={trackerFocalStudentId}
                onSelectStudentId={(id) => {
                  setTrackerFocalStudentId(id);
                  setSelectedStudentFocus(id);
                }}
                comparisonScope={trackerScope}
                onSelectComparisonScope={setTrackerScope}
                onSelectStudentForDossier={(id) => {
                  setDossierFocalStudentId(id);
                  navigate(`/insights/student/${id}`);
                }}
              />
            </div>
          )}

          {/* TAB 3: STUDENT DOSSIERS (PRESERVED SPARKLINE CARDS) */}
          {activeTab === "insights" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    Comprehensive Student Dossiers
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Individual 8-pillar sparklines, top mastery strengths, and full diagnostic records
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedStrength !== "All" && (
                    <button
                      type="button"
                      onClick={() => setSelectedStrength("All")}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer flex items-center space-x-1"
                    >
                      <span>Reset Strength: {selectedStrength}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                    {filteredStudents.length} Profiles Available
                  </span>
                </div>
              </div>

              {/* STREAMER Top Strength Filter Toolbar directly inside Student Dossiers */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Filter by Top STREAMER Strength:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {STRENGTH_OPTIONS.map((opt) => {
                    const isSelected = selectedStrength === opt.value;
                    const count = opt.value === "All"
                      ? students.filter(s => {
                          const matchYear = selectedYear === "All" || (s.academicYear ? s.academicYear === selectedYear.slice(0, 9) : selectedYear.includes("2025-2026"));
                          const matchCentre = selectedCentre === "All" || s.centre.city === selectedCentre;
                          const matchBatch = selectedBatch === "All" || s.batch === selectedBatch;
                          const matchDomain = selectedDomain === "All" || s.domain === selectedDomain;
                          return matchYear && matchCentre && matchBatch && matchDomain;
                        }).length
                      : students.filter(s => {
                          const matchYear = selectedYear === "All" || (s.academicYear ? s.academicYear === selectedYear.slice(0, 9) : selectedYear.includes("2025-2026"));
                          const matchCentre = selectedCentre === "All" || s.centre.city === selectedCentre;
                          const matchBatch = selectedBatch === "All" || s.batch === selectedBatch;
                          const matchDomain = selectedDomain === "All" || s.domain === selectedDomain;
                          if (!(matchYear && matchCentre && matchBatch && matchDomain)) return false;
                          const pillars = calculateStreamerPillars(s);
                          const maxScore = Math.max(...pillars.map(p => p.ytd));
                          return pillars.some(p => p.pillar === opt.value && p.ytd === maxScore);
                        }).length;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedStrength(opt.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        {opt.value !== "All" && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: opt.color }}
                          />
                        )}
                        <span>{opt.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm">No students match the selected batch and filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => {
                    const pillars = calculateStreamerPillars(student);
                    const topStrengths = getTopStrengthPillars(student, selectedStrength);
                    const primaryStrength = topStrengths[0];
                    const topRubric = getRubricBand(primaryStrength.ytd);
                    const futureReady = calculateFutureReadyScore(student);

                    return (
                      <div
                        key={student.id}
                        onClick={() => {
                          setDossierFocalStudentId(student.id);
                          navigate(`/insights/student/${student.id}`);
                        }}
                        className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-streamer-science"
                        tabIndex={0}
                        role="button"
                        aria-label={`View full report for ${student.name}`}
                      >
                        <div>
                          {/* Top Bar: Centre & Batch */}
                          <div className="flex items-center justify-between mb-3 text-xs">
                            <span className="font-mono text-slate-500 flex items-center space-x-1 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{student.centre.city}, {student.centre.country}</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700">
                              {student.batch}
                            </span>
                          </div>

                          {/* Student Name & Domain */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-streamer-science transition-colors">
                                {student.name}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-slate-500 font-medium">{student.grade} • Age {student.age}</span>
                                <span className="text-slate-300">•</span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                                  student.domain === "Aerospace"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : student.domain === "Robotics"
                                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                                    : "bg-purple-50 text-purple-700 border border-purple-200"
                                }`}>
                                  {student.domain}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Future Ready</div>
                              <div className="text-xl font-display font-bold text-emerald-600">
                                {futureReady.futureReadyScore}
                              </div>
                            </div>
                          </div>

                          {/* 8-Pillar Mini Sparkline Bar Chart with True Calibrated Heights */}
                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
                              <span className="font-semibold text-slate-700">8 STREAMER Pillars (YTD)</span>
                              <span className="font-mono text-[10px] text-slate-400">Scale: 65–100 pts</span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                              <div className="grid grid-cols-8 gap-2 items-end">
                                {pillars.map((p, pIdx) => {
                                  // Calibrated baseline and pixel height calculation:
                                  // Ensures even 2-3 pt differences (e.g. 86 vs 89, 89 vs 91, 89 vs 98) are unmistakably distinct!
                                  const TRACK_HEIGHT = 80;
                                  const MIN_BAR = 12;
                                  const MAX_BAR = 64;
                                  const BASELINE = 65;
                                  const MAX_SCORE = 100;

                                  const clamped = Math.max(BASELINE, Math.min(MAX_SCORE, p.ytd));
                                  const ratio = (clamped - BASELINE) / (MAX_SCORE - BASELINE);
                                  const barHeightPx = Math.round(MIN_BAR + ratio * (MAX_BAR - MIN_BAR));

                                  return (
                                    <div
                                      key={pIdx}
                                      className="flex flex-col items-center group/bar relative"
                                    >
                                      {/* Dedicated Track Box with explicit pixel height */}
                                      <div
                                        className="w-full flex flex-col justify-end items-center relative"
                                        style={{ height: `${TRACK_HEIGHT}px` }}
                                      >
                                        {/* Score label displayed atop the bar */}
                                        <span className="text-[9px] font-mono font-bold text-slate-700 leading-none mb-1 select-none z-10 transition-transform group-hover/bar:scale-110">
                                          {p.ytd}
                                        </span>
                                        {/* Bar with True Calibrated Height in exact pixels */}
                                        <div
                                          className="w-full rounded-t-md transition-all duration-200 group-hover/bar:brightness-110 shadow-xs"
                                          style={{
                                            height: `${barHeightPx}px`,
                                            backgroundColor: p.color,
                                          }}
                                        />
                                      </div>
                                      {/* Hover Tooltip */}
                                      <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity bg-slate-900 text-[10px] text-white px-2 py-0.5 rounded shadow border border-slate-700 font-mono z-20 whitespace-nowrap">
                                        {p.pillar}: {p.ytd} pts
                                      </div>
                                      {/* Letter below bar */}
                                      <span className="text-[10px] font-mono text-slate-500 mt-1.5 font-bold shrink-0">{p.letter}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Meta & Top Strength */}
                        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                            <span className="text-slate-500 text-[11px] font-medium">Top Strength:</span>
                            {topStrengths.map((ts) => (
                              <span
                                key={ts.pillar}
                                className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white flex items-center space-x-1 shadow-xs"
                                style={{ backgroundColor: ts.color }}
                              >
                                <span>{ts.pillar}</span>
                                <span className="font-mono">({ts.ytd})</span>
                              </span>
                            ))}
                            <span
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                              style={{
                                backgroundColor: `${topRubric.color}15`,
                                color: topRubric.color,
                                borderColor: `${topRubric.color}30`
                              }}
                            >
                              {topRubric.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-slate-600 group-hover:text-streamer-science font-bold text-xs">
                            <span>Dossier</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      </div>

      {/* Source Data Editor Modal */}
      <SourceDataEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
      />

      {/* Student Profile Spotlight Modal (Strengths & Growth Scope) */}
      {(() => {
        const student = students.find(s => s.id === spotlightStudentId);
        if (!student) return null;
        const insights = extractStudentProfileInsights(student);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in hide-on-print">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{student.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{student.id} • {student.centre.city} • {student.domain}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSpotlightStudentId(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Future Ready Index</div>
                  <div className="text-xl font-black text-emerald-800 font-mono mt-0.5">
                    {insights.futureReadyScore}%
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Rubric Mastery Band</div>
                  <div className="text-xs font-black text-blue-900 mt-1">
                    {insights.band}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Top Identified Strengths</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {insights.topStrengths.map((str, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>Key Scope for Growth</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {insights.scopeForGrowth.map((sc, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Educator Coaching Guidance:</span>
                <p className="text-slate-600 italic leading-relaxed">"{insights.recommendation}"</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(`/insights/student/${student.id}`)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>Open Full Dossier & Radar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSpotlightStudentId(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dedicated Context-Aware Printable Landscape Report Container */}
      <div className="hidden print-only-block">
        {activeTab === "summary" && (
          <ExecutiveLandscapeReport
            students={filteredStudents}
            selectedCentre={selectedCentre}
            selectedYear={selectedYear}
            selectedBatch={selectedBatch}
            isPrintOnly={true}
          />
        )}

        {activeTab === "tracker" && (
          <ExecutivePeerTrackerReport
            students={cohortStudents}
            focalStudentId={trackerFocalStudentId}
            selectedCentre={selectedCentre}
            selectedYear={selectedYear}
            selectedBatch={selectedBatch}
            comparisonScope={trackerScope}
            isPrintOnly={true}
          />
        )}

        {(activeTab === "insights" || activeTab === "data") && (
          <ExecutiveComprehensiveDossierReport
            students={filteredStudents}
            selectedCentre={selectedCentre}
            selectedYear={selectedYear}
            selectedBatch={selectedBatch}
            selectedStrength={selectedStrength}
            isPrintOnly={true}
          />
        )}
      </div>
    </div>
  );
};
