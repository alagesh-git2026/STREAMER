import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import { SDG_LIST } from "../data/frameworkData";
import { 
  calculateStreamerPillars, 
  calculate21stCenturySkills, 
  calculateFutureReadyScore 
} from "../utils/calculations";
import { determineFutureReadyRole, type FutureReadyRole } from "../utils/careerMapping";
import { triggerLandscapePdfPrint } from "../utils/executiveExportUtils";
import { 
  ArrowLeft, 
  Printer, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Globe, 
  MapPin, 
  Layers
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from "recharts";

export const FutureReadyStudentDossierPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useStudentData();

  // Find the selected student
  const student = useMemo(() => {
    return students.find((s) => s.id === id) || students[0];
  }, [students, id]);

  // Compute all enriched students to calculate rank & peer salary comparisons
  const allRanked = useMemo(() => {
    const list = students.map((s) => {
      const breakdown = calculateFutureReadyScore(s);
      const role = determineFutureReadyRole(s);
      return {
        student: s,
        breakdown,
        role
      };
    });
    return list.sort((a, b) => b.breakdown.futureReadyScore - a.breakdown.futureReadyScore);
  }, [students]);

  // Find student's global rank
  const rankIndex = allRanked.findIndex(item => item.student.id === student?.id);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;

  // Student metrics
  const pillars = useMemo(() => calculateStreamerPillars(student), [student]);
  const skills21 = useMemo(() => calculate21stCenturySkills(student), [student]);
  const breakdown = useMemo(() => calculateFutureReadyScore(student), [student]);
  const careerRole: FutureReadyRole = useMemo(() => determineFutureReadyRole(student), [student]);

  // Top Strengths and Growth Areas
  const sortedPillars = useMemo(() => [...pillars].sort((a, b) => b.ytd - a.ytd), [pillars]);
  const topStrengths = sortedPillars.slice(0, 3);
  const growthAreas = sortedPillars.slice(-2);

  // Peer Salary Distribution Calculations
  const peerSalaryStats = useMemo(() => {
    const salaries = allRanked.map(i => i.role.medianSalaryUsd);
    const sorted = [...salaries].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    
    // Percentage rank of current student
    const studentSalary = careerRole.medianSalaryUsd;
    const belowCount = sorted.filter(s => s < studentSalary).length;
    const percentile = Math.round((belowCount / sorted.length) * 100);

    return {
      min,
      max,
      median,
      studentSalary,
      percentile: percentile === 0 ? 15 : percentile
    };
  }, [allRanked, careerRole]);

  // Radar chart data for STREAMER pillars
  const radarData = useMemo(() => {
    return pillars.map(p => ({
      pillar: p.pillar,
      score: p.ytd,
      benchmark: 75
    }));
  }, [pillars]);

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Future Ready Profile Not Found</h2>
        <Link to="/profiles" className="text-blue-600 hover:underline">
          Return to Leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background text-slate-900">
      
      {/* 1. Header Toolbar (Back, Student Switcher, Print PDF) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to="/profiles"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Leaderboard</span>
          </Link>

          <span className="text-slate-300">|</span>

          {/* Student Switcher Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Profile:</span>
            <select
              value={student.id}
              onChange={(e) => navigate(`/profiles/student/${e.target.value}`)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs"
            >
              {allRanked.map((item, idx) => (
                <option key={item.student.id} value={item.student.id}>
                  #{idx + 1} {item.student.name} ({item.student.centre.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => triggerLandscapePdfPrint(`Future_Ready_Dossier_${student.name}`)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Export Dossier (Landscape PDF)</span>
        </button>
      </div>

      {/* 2. Hero Spotlight Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden mb-8">
        {/* Visual Rank Accent Bar */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-2.5"
          style={{
            backgroundColor: 
              rank === 1 ? "#F59E0B" :
              rank === 2 ? "#94A3B8" :
              rank === 3 ? "#D97706" : "#E2E8F0"
          }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pl-2">
          
          {/* Left: Identity & Metadata */}
          <div className="flex items-start space-x-5">
            {/* Rank Shield */}
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm ${
              rank === 1 ? "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white shadow-amber-200/60" :
              rank === 2 ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white shadow-slate-300/60" :
              rank === 3 ? "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white shadow-orange-300/60" :
              "bg-slate-100 text-slate-700 border border-slate-200"
            }`}>
              <span className="text-2xl font-display font-black leading-none">
                #{rank < 10 ? `0${rank}` : rank}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-90 mt-0.5">
                {rank === 1 ? "Alpha" : rank === 2 ? "Elite" : rank === 3 ? "Honors" : "Rank"}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  student.domain === "Aerospace" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : student.domain === "Robotics"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "bg-purple-50 text-purple-700 border border-purple-200"
                }`}>
                  {student.domain}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {careerRole.fitScore}% Fit Index
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.centre.city} Innovation Lab, {student.centre.country}</span>
                </span>
                <span>•</span>
                <span>Grade {student.grade}</span>
                <span>•</span>
                <span className="font-mono text-slate-600">{student.batch}</span>
                <span>•</span>
                <span className="text-slate-700 font-semibold">{student.badges.length} Certified Badges</span>
              </div>

              {/* Key Drivers */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mr-0.5">
                  Top Drivers:
                </span>
                {topStrengths.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.pillar}</span>
                    <span className="font-mono text-slate-500 font-semibold text-[11px]">{p.ytd}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Future Ready Score Spotlight (SVG Arc) */}
          <div className="lg:w-80 shrink-0 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                Composite Future Ready Index
              </span>
              
              <div className="relative flex flex-col items-center justify-center mt-1">
                <svg viewBox="0 0 100 58" className="w-40 h-24 overflow-visible">
                  <path
                    d="M 15 50 A 35 35 0 0 1 85 50"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 15 50 A 35 35 0 0 1 85 50"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={109.95}
                    strokeDashoffset={109.95 - (breakdown.futureReadyScore / 100) * 109.95}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="-mt-8 text-center">
                  <div className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
                    {breakdown.futureReadyScore}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 font-mono -mt-0.5">OUT OF 100</div>
                </div>
              </div>

              <div className="mt-2 inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                <span>{breakdown.futureReadyScore >= 90 ? "Top 5% Global Elite" : "High Industry Ready"}</span>
              </div>
            </div>

            {/* 3-Component Score Breakdown */}
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-500">STREAMER Core (50%)</span>
                <span className="font-mono font-bold text-slate-900">{breakdown.streamerAvg} pts</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-500">21st Century (30%)</span>
                <span className="font-mono font-bold text-slate-900">{breakdown.twentyFirstCenturyAvg} pts</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-500">SDG Impact (20%)</span>
                <span className="font-mono font-bold text-slate-900">{Math.round(breakdown.sdgBreadthPct)}% breadth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE SPOTLIGHT: REAL-WORLD CAREER ROLE & TENTATIVE MARKET SALARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left 7 cols: Career Role & Industry Giant Demand */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Target Real-World Career Role</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
              {careerRole.roleTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: careerRole.sectorColor }}
              >
                {careerRole.sector}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                {careerRole.industryDemand}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                {careerRole.salaryTier}
              </span>
            </div>

            {/* Competency Synergy Breakdown */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                Verified Competency Synthesis:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {careerRole.matchReason}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Triad: <strong className="text-slate-900">{careerRole.competencyTriplet}</strong></span>
                <span className="text-emerald-700 font-bold">{careerRole.fitScore}% Fit Index</span>
              </div>
            </div>

            {/* Skills Demanded by Industry Giants */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 mb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Skills Demanded By Global Industry Giants:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {careerRole.hiringOrganizations.map((org) => (
                  <div
                    key={org}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-display font-bold text-xs shadow-xs"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{org}</span>
                  </div>
                ))}
              </div>

              {/* Required Core Competencies Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mr-1">
                  Required Competencies:
                </span>
                {careerRole.requiredCompetencies.map((comp) => (
                  <span
                    key={comp}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
                  >
                    ✓ {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: TENTATIVE MARKET SALARY & PEER BENCHMARK COMPARISON */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/90 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Tentative Market Salary Spotlight</span>
            </div>

            {/* Big Salary Figure */}
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
                {careerRole.tentativeSalary}
              </div>
              <div className="text-sm font-mono font-bold text-emerald-700 mt-0.5">
                {careerRole.tentativeSalaryInr} (India Equivalent CTC)
              </div>
              <p className="text-xs text-slate-500 mt-2 font-normal">
                Estimated compensation benchmark for entry-to-mid deeptech roles across NASA, Tesla, ISRO, and global partners.
              </p>
            </div>

            {/* PEER SALARY BENCHMARK COMPARISON */}
            <div className="mt-6 pt-5 border-t border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Peer Cohort Salary Comparison:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Top {100 - peerSalaryStats.percentile}% Earning Tier
                </span>
              </div>

              {/* Visual Comparative Horizontal Bar */}
              <div className="mt-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>Lower: ${Math.round(peerSalaryStats.min / 1000)}K</span>
                  <span className="text-slate-600 font-semibold">Cohort Median: ${Math.round(peerSalaryStats.median / 1000)}K</span>
                  <span>Ceiling: ${Math.round(peerSalaryStats.max / 1000)}K</span>
                </div>

                {/* Range Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full relative overflow-hidden">
                  {/* Background Track */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200" />
                  {/* Student Indicator Marker */}
                  <div 
                    className="absolute top-0 bottom-0 bg-emerald-600 rounded-full transition-all duration-700 shadow-xs"
                    style={{ 
                      left: `${Math.max(5, Math.min(95, ((peerSalaryStats.studentSalary - peerSalaryStats.min) / (peerSalaryStats.max - peerSalaryStats.min)) * 100)) - 4}%`,
                      width: "8px" 
                    }}
                  />
                </div>

                <div className="mt-2 text-[11px] text-slate-600">
                  {student.name}'s matched role offers a median potential of <strong className="text-slate-900">${Math.round(peerSalaryStats.studentSalary / 1000)}K / yr</strong>, placing this profile <strong className="text-emerald-700">+{Math.round(((peerSalaryStats.studentSalary - peerSalaryStats.median) / peerSalaryStats.median) * 100)}% above the cohort median</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RETAINED BEST INSIGHTS (STREAMER RADAR, 21ST CENTURY, SDGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 cols: 8-Pillar STREAMER Radar Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>8-Pillar STREAMER Competency Mastery</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" tick={{ fontSize: 10 }} />
                <Radar name="Student YTD" dataKey="score" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.4} strokeWidth={2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Strengths and Scope for Growth */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono block mb-1">
                Top Pillar Strengths:
              </span>
              <ul className="space-y-1">
                {topStrengths.map((p) => (
                  <li key={p.pillar} className="font-semibold text-emerald-900 flex justify-between">
                    <span>{p.pillar}</span>
                    <span className="font-mono">{p.ytd} pts</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono block mb-1">
                Scope for Growth:
              </span>
              <ul className="space-y-1">
                {growthAreas.map((p) => (
                  <li key={p.pillar} className="font-semibold text-amber-900 flex justify-between">
                    <span>{p.pillar}</span>
                    <span className="font-mono">{p.ytd} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 6 cols: 21st Century Skills & UN SDG Impact */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 21st Century Skills */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>21st Century Human Intelligence</span>
            </div>

            <div className="space-y-2.5">
              {skills21.slice(0, 4).map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700 font-semibold">{s.name}</span>
                    <span className="font-mono text-slate-900 font-bold">{s.score} pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UN Sustainable Development Goals Impact */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>UN Sustainable Development Goals (SDG Breadth: {Math.round(breakdown.sdgBreadthPct)}%)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {breakdown.distinctSdgs.map((sdgKey) => {
                const sdg = SDG_LIST[sdgKey];
                return (
                  <div
                    key={sdgKey}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center space-x-2 shadow-2xs"
                  >
                    <div 
                      className="w-4 h-4 rounded-full shrink-0" 
                      style={{ backgroundColor: sdg?.color || "#3B82F6" }} 
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sdgKey}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{sdg?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="no-print mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
        <Link to="/profiles" className="text-blue-600 hover:underline font-bold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Future Ready Leaderboard</span>
        </Link>
        <div>
          Official Verified Dossier • Lab of Future Academic & Corporate Council
        </div>
      </div>
    </div>
  );
};
