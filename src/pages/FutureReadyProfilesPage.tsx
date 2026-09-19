import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import { SDG_LIST } from "../data/frameworkData";
import { 
  calculateFutureReadyScore, 
  calculateStreamerPillars, 
  calculate21stCenturySkills 
} from "../utils/calculations";
import { determineFutureReadyRole, type FutureReadyRole } from "../utils/careerMapping";
import { 
  Award, 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ExternalLink,
  Target,
  Briefcase,
  RotateCcw,
  Search
} from "lucide-react";

export const FutureReadyProfilesPage: React.FC = () => {
  const { students } = useStudentData();

  // Filters State
  const [selectedCentre, setSelectedCentre] = useState<string>("All Centres");
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [selectedRole, setSelectedRole] = useState<string>("All Roles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleLimit, setVisibleLimit] = useState<number>(5);
  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);

  // Available unique centres
  const centres = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.centre.city)));
    return ["All Centres", ...list];
  }, [students]);

  const domains = ["All Domains", "Aerospace", "Robotics", "Space & Astro"];

  // Enrich students with computed Future Ready data and Career Role Trajectories
  const enrichedStudents = useMemo(() => {
    return students.map((student) => {
      const breakdown = calculateFutureReadyScore(student);
      const pillars = calculateStreamerPillars(student);
      const topPillars = [...pillars].sort((a, b) => b.ytd - a.ytd).slice(0, 3);
      
      const skills21 = calculate21stCenturySkills(student);
      const topSkills21 = [...skills21].sort((a, b) => b.score - a.score).slice(0, 2);

      const careerRole: FutureReadyRole = determineFutureReadyRole(student);

      return {
        student,
        breakdown,
        topPillars,
        topSkills21,
        careerRole
      };
    });
  }, [students]);

  // Unique Career Roles available across all students
  const availableRoles = useMemo(() => {
    const roleMap = new Map<string, { shortTitle: string; roleTitle: string; sector: string; count: number }>();
    enrichedStudents.forEach(item => {
      const { shortTitle, roleTitle, sector } = item.careerRole;
      if (!roleMap.has(shortTitle)) {
        roleMap.set(shortTitle, { shortTitle, roleTitle, sector, count: 0 });
      }
      roleMap.get(shortTitle)!.count += 1;
    });
    return Array.from(roleMap.values());
  }, [enrichedStudents]);

  // Center-Specific Role Production Statistics (Answering: "how many future ready roles produced from this centre in LOF")
  const centreRoleStats = useMemo(() => {
    // Filter by centre (and domain if selected)
    const centreCohort = enrichedStudents.filter(item => {
      const matchCentre = selectedCentre === "All Centres" || item.student.centre.city === selectedCentre;
      const matchDomain = selectedDomain === "All Domains" || item.student.domain === selectedDomain;
      return matchCentre && matchDomain;
    });

    const counts: Record<string, { roleTitle: string; shortTitle: string; sectorColor: string; count: number }> = {};
    centreCohort.forEach(item => {
      const role = item.careerRole;
      if (!counts[role.shortTitle]) {
        counts[role.shortTitle] = {
          roleTitle: role.roleTitle,
          shortTitle: role.shortTitle,
          sectorColor: role.sectorColor,
          count: 0
        };
      }
      counts[role.shortTitle].count += 1;
    });

    const list = Object.values(counts).sort((a, b) => b.count - a.count);
    return {
      totalCandidates: centreCohort.length,
      distinctRolesCount: list.length,
      roles: list
    };
  }, [enrichedStudents, selectedCentre, selectedDomain]);

  // Filtered and Ranked Students
  const rankedStudents = useMemo(() => {
    const filtered = enrichedStudents.filter(item => {
      const matchCentre = selectedCentre === "All Centres" || item.student.centre.city === selectedCentre;
      const matchDomain = selectedDomain === "All Domains" || item.student.domain === selectedDomain;
      const matchRole = selectedRole === "All Roles" || 
        item.careerRole.shortTitle === selectedRole || 
        item.careerRole.roleTitle === selectedRole;
      const matchSearch = searchQuery.trim() === "" ||
        item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.careerRole.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.careerRole.hiringOrganizations.some(org => org.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCentre && matchDomain && matchRole && matchSearch;
    });

    // Sort descending by Future Ready Score
    return filtered.sort((a, b) => b.breakdown.futureReadyScore - a.breakdown.futureReadyScore);
  }, [enrichedStudents, selectedCentre, selectedDomain, selectedRole, searchQuery]);

  const displayedStudents = rankedStudents.slice(0, visibleLimit);
  const hasMore = visibleLimit < rankedStudents.length;

  const handleResetFilters = () => {
    setSelectedCentre("All Centres");
    setSelectedDomain("All Domains");
    setSelectedRole("All Roles");
    setSearchQuery("");
    setVisibleLimit(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-background text-slate-900">
      {/* 1. Header with Title & Formula Toggle */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Talent Scouting & Center Head Intelligence</span>
        </div>
        <div className="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Future Ready Leaderboard & Career Trajectories
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Candidate competencies mapped directly to high-demand real-world industry roles and actively hiring organizations (NASA, Tesla, ISRO, ESA, TATA, etc.).
            </p>
          </div>

          <button
            onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
            className="inline-flex items-center space-x-1.5 text-xs text-streamer-science hover:text-blue-700 bg-white px-4 py-2 rounded-xl border border-slate-200 transition-colors self-start md:self-auto shadow-xs font-semibold cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>View Composite Formula</span>
            {isFormulaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Formula Transparency Box */}
      {isFormulaExpanded && (
        <div className="mb-8 p-6 rounded-3xl bg-white border border-blue-200 text-xs text-slate-700 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-sm font-display font-bold text-slate-900 mb-2">
            <Sparkles className="w-4 h-4 text-streamer-science" />
            <span>Future Ready Score Composite Formula</span>
          </div>
          <p className="text-slate-600 leading-relaxed mb-3 font-normal">
            Designed for corporate talent scouting and advanced university placement, the Future Ready Score provides a defensible balance between foundational STEM mastery, derived collaborative human intelligence, and global sustainable development impact:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-streamer-science font-bold mb-3">
            Future Ready Score = 0.5 × (STREAMER 8-Pillar Avg) + 0.3 × (21st Century Skills Avg) + 0.2 × (SDG Breadth %)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">50% STREAMER Composite:</strong>
              Average of all 8 core pillars reflecting hands-on technical proficiency.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">30% 21st Century Skills:</strong>
              Average of 8 derived skills reflecting leadership, communication, and adaptability.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">20% SDG Breadth:</strong>
              Percentage of distinct UN Sustainable Development Goals tackled across projects (count / 6 × 100).
            </div>
          </div>
        </div>
      )}

      {/* 2. Future-Ready Roles Produced Analytics Banner (Center-Level Role Production) */}
      <div className="mb-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-display font-bold text-slate-900">
                Future-Ready Roles Produced by Lab of Future
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {selectedCentre === "All Centres"
                ? "Aggregated talent pipeline across all 5 international innovation labs (Bengaluru, New Delhi, Dubai, Austin, Shanghai)."
                : `Verified future-ready roles produced exclusively from the ${selectedCentre} Innovation Lab.`}
            </p>
          </div>

          {/* KPI Mini Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Candidates</div>
              <div className="text-lg font-display font-black text-slate-900 mt-0.5">
                {centreRoleStats.totalCandidates}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="text-[10px] uppercase font-bold text-blue-600 font-mono">Unique Roles</div>
              <div className="text-lg font-display font-black text-blue-900 mt-0.5">
                {centreRoleStats.distinctRolesCount} Career Tracks
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-700 font-mono">Hiring Ecosystem</div>
              <div className="text-xs font-bold text-emerald-900 mt-0.5">
                NASA • Tesla • ISRO • ESA • TATA
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Role Distribution Pills (Click to Filter) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Roles Produced in Selected Scope (Click to filter candidates):</span>
            </span>
            {selectedRole !== "All Roles" && (
              <button
                type="button"
                onClick={() => setSelectedRole("All Roles")}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Clear Role Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("All Roles");
                setVisibleLimit(5);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedRole === "All Roles"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <span>All Career Tracks</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                selectedRole === "All Roles" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {centreRoleStats.totalCandidates}
              </span>
            </button>

            {centreRoleStats.roles.map(r => {
              const isSelected = selectedRole === r.shortTitle || selectedRole === r.roleTitle;
              return (
                <button
                  key={r.shortTitle}
                  type="button"
                  onClick={() => {
                    setSelectedRole(isSelected ? "All Roles" : r.shortTitle);
                    setVisibleLimit(5);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: r.sectorColor }}
                  />
                  <span>{r.shortTitle}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {r.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Multi-Slicers Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Slicer 1: Centre */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Centre:</span>
            </span>
            <select
              value={selectedCentre}
              onChange={(e) => {
                setSelectedCentre(e.target.value);
                setVisibleLimit(5);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {centres.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Slicer 2: Domain */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Domain:</span>
            </span>
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setVisibleLimit(5);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {domains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Slicer 3: Role Trajectory Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Role:</span>
            </span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setVisibleLimit(5);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer max-w-[180px] truncate"
            >
              <option value="All Roles">All Roles</option>
              {availableRoles.map(r => (
                <option key={r.shortTitle} value={r.shortTitle}>{r.shortTitle} ({r.count})</option>
              ))}
            </select>
          </div>

          {/* Slicer 4: Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate or company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleLimit(5);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 w-48 sm:w-56"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium shrink-0">
          Showing <strong className="text-slate-900 font-mono">{displayedStudents.length}</strong> of <strong className="text-slate-900 font-mono">{rankedStudents.length}</strong> matching candidates
        </div>
      </div>

      {/* 4. Ranked Profile Cards with Real-World Career Role Matches */}
      {displayedStudents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">No future-ready profiles match the selected filters.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedStudents.map((item, index) => {
            const { student, breakdown, topPillars, topSkills21, careerRole } = item;
            const rank = index + 1;

            return (
              <div
                key={student.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                {/* Rank Accent Bar */}
                <div 
                  className="absolute top-0 left-0 bottom-0 w-2.5"
                  style={{
                    backgroundColor: 
                      rank === 1 ? "#F59E0B" :
                      rank === 2 ? "#94A3B8" :
                      rank === 3 ? "#B45309" : "#CBD5E1"
                  }}
                />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pl-2">
                  {/* Left Column: Student Identity, Academic Badges, Competency Chips, AND Real-World Role Match */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Rank Badge */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-display font-bold text-lg shrink-0 shadow-xs ${
                        rank === 1 ? "bg-amber-100 text-amber-900 border border-amber-300" :
                        rank === 2 ? "bg-slate-200 text-slate-800 border border-slate-300" :
                        rank === 3 ? "bg-orange-100 text-orange-900 border border-orange-300" :
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        #{rank}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link 
                            to={`/insights/student/${student.id}`}
                            className="text-lg sm:text-xl font-display font-bold text-slate-900 hover:text-streamer-science transition-colors flex items-center space-x-1.5"
                          >
                            <span>{student.name}</span>
                            <ArrowUpRight className="w-4 h-4 opacity-70" />
                          </Link>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                            student.domain === "Aerospace" 
                              ? "bg-blue-50 text-blue-700 border border-blue-200" 
                              : student.domain === "Robotics"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}>
                            {student.domain}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                          <span className="flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{student.centre.city}, {student.centre.country}</span>
                          </span>
                          <span>•</span>
                          <span>{student.grade}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-700">{student.batch}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-semibold">
                            {student.badges.length} Badges Earned
                          </span>
                        </div>

                        {/* Top Competency Chips: Pillars + 21st Century + SDGs */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">
                            Pillars:
                          </span>
                          {topPillars.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: p.color }}
                            >
                              {p.pillar} ({p.ytd})
                            </span>
                          ))}

                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mx-1">
                            21st:
                          </span>
                          {topSkills21.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-800 font-semibold"
                            >
                              {s.name} ({s.score})
                            </span>
                          ))}

                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mx-1">
                            SDGs:
                          </span>
                          {breakdown.distinctSdgs.map((sdgKey) => {
                            const sdg = SDG_LIST[sdgKey];
                            return (
                              <span
                                key={sdgKey}
                                className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: sdg?.color || "#3B82F6" }}
                                title={sdg?.name}
                              >
                                {sdgKey}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* DEDICATED REAL-WORLD FUTURE-READY ROLE MATCH CONTAINER */}
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50/20 to-indigo-50/15 border border-slate-200/90 shadow-2xs flex flex-col gap-2.5">
                      {/* Role Header & Tags */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-700 shrink-0">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                              Target Real-World Career Role
                            </span>
                            <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 leading-tight">
                              {careerRole.roleTitle}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-start sm:self-auto">
                          <span
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-xs"
                            style={{ backgroundColor: careerRole.sectorColor }}
                          >
                            {careerRole.sector}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                            {careerRole.industryDemand}
                          </span>
                        </div>
                      </div>

                      {/* Why this fit (Competency Synthesis) */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        <strong className="font-semibold text-slate-800">Competency Synergy: </strong>
                        {careerRole.matchReason}
                      </p>

                      {/* Hiring Organizations Strip */}
                      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center space-x-1 mr-1">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>Actively Hiring:</span>
                          </span>
                          {careerRole.hiringOrganizations.map((org) => (
                            <span
                              key={org}
                              className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-[11px] shadow-2xs hover:border-slate-300 transition-colors"
                            >
                              {org}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-500 font-mono">
                          <span>Triad:</span>
                          <span className="font-bold text-slate-800">{careerRole.competencyTriplet}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">{careerRole.fitScore}% Fit Index</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Future Ready Score & 3-Component Breakdown */}
                  <div className="lg:w-80 shrink-0 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        Future Ready Score
                      </span>
                      <span className="text-3xl font-display font-bold text-emerald-600">
                        {breakdown.futureReadyScore}
                      </span>
                    </div>

                    {/* 3-Component Stacked Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>STREAMER (50%):</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {breakdown.streamerContribution} <span className="text-slate-400 text-[10px]">({breakdown.streamerAvg} avg)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-streamer-science rounded-full" 
                          style={{ width: `${(breakdown.streamerAvg / 100) * 100}%` }} 
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-600 font-medium pt-0.5">
                        <span>21st Century (30%):</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {breakdown.twentyFirstCenturyContribution} <span className="text-slate-400 text-[10px]">({breakdown.twentyFirstCenturyAvg} avg)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-streamer-engineering rounded-full" 
                          style={{ width: `${(breakdown.twentyFirstCenturyAvg / 100) * 100}%` }} 
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-600 font-medium pt-0.5">
                        <span>SDG Breadth (20%):</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {breakdown.sdgBreadthContribution} <span className="text-slate-400 text-[10px]">({Math.round(breakdown.sdgBreadthPct)}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${breakdown.sdgBreadthPct}%` }} 
                        />
                      </div>
                    </div>

                    {/* Link through to Full Student Report */}
                    <div className="mt-4 pt-3.5 border-t border-slate-200">
                      <Link
                        to={`/insights/student/${student.id}`}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
                      >
                        <span>Open Verified Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show More Pagination Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleLimit(prev => prev + 5)}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Show Next Candidates ({rankedStudents.length - visibleLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
