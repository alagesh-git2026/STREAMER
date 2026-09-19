import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import { 
  calculateFutureReadyScore, 
  calculateStreamerPillars, 
  calculate21stCenturySkills 
} from "../utils/calculations";
import { determineFutureReadyRole, type FutureReadyRole } from "../utils/careerMapping";
import { triggerLandscapePdfPrint } from "../utils/executiveExportUtils";
import { ExecutiveFutureReadyReport } from "../components/dashboard/ExecutiveFutureReadyReport";
import { 
  Award, 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Target,
  Briefcase,
  RotateCcw,
  Search,
  Globe,
  MapPin,
  TrendingUp,
  Filter,
  Printer,
  X
} from "lucide-react";

// Innovation Center Configuration for Futuristic BI Filter Hub
interface CentreConfig {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  code: string;
  specialty: string;
}

const INNOVATION_CENTRES: CentreConfig[] = [
  { id: "All Centres", name: "Global Innovation Network", city: "All Centres", country: "Global", flag: "🌐", code: "GLOBAL", specialty: "Multi-Hub Pipeline" },
  { id: "Bengaluru", name: "Bengaluru Innovation Lab", city: "Bengaluru", country: "India", flag: "🇮🇳", code: "BLR", specialty: "DeepTech & Space" },
  { id: "Shanghai", name: "Shanghai Innovation Lab", city: "Shanghai", country: "China", flag: "🇨🇳", code: "SHA", specialty: "Autonomous AI & Robotics" },
  { id: "Dubai", name: "Dubai Future District Lab", city: "Dubai", country: "UAE", flag: "🇦🇪", code: "DXB", specialty: "Geospatial & Remote Sensing" },
  { id: "Austin", name: "Austin DeepTech Center", city: "Austin", country: "USA", flag: "🇺🇸", code: "ATX", specialty: "Astrodynamics & Aerospace" },
  { id: "New Delhi", name: "New Delhi Aerospace Hub", city: "New Delhi", country: "India", flag: "🇮🇳", code: "DEL", specialty: "Telemetry & CFD Design" },
];

const STREAMER_PILLARS_LIST = [
  { name: "Science", color: "#2255A4" },
  { name: "Technology", color: "#0E7C6F" },
  { name: "Research", color: "#B65529" },
  { name: "Engineering", color: "#5A3FA0" },
  { name: "Arts", color: "#C23768" },
  { name: "Mathematics", color: "#41722E" },
  { name: "Entrepreneurship", color: "#9A6C10" },
  { name: "Resilience", color: "#1D6FA5" },
];

export const FutureReadyProfilesPage: React.FC = () => {
  const { students } = useStudentData();

  // Filters State
  const [selectedCentre, setSelectedCentre] = useState<string>("All Centres");
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [selectedRole, setSelectedRole] = useState<string>("All Roles");
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleLimit, setVisibleLimit] = useState<number>(5);
  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);

  const domains = ["All Domains", "Aerospace", "Robotics", "Space & Astro"];

  // Toggle multi-select STREAMER pillar
  const togglePillar = (pillarName: string) => {
    setSelectedPillars(prev => 
      prev.includes(pillarName) 
        ? prev.filter(p => p !== pillarName)
        : [...prev, pillarName]
    );
    setVisibleLimit(5);
  };

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

  // Center BI Statistics for the 6 Innovation Center Cards
  const centreBiStats = useMemo(() => {
    return INNOVATION_CENTRES.map(centre => {
      const cohort = enrichedStudents.filter(item => 
        centre.id === "All Centres" || item.student.centre.city === centre.city
      );
      
      const count = cohort.length;
      const avgScore = count > 0 
        ? Math.round((cohort.reduce((sum, item) => sum + item.breakdown.futureReadyScore, 0) / count) * 10) / 10
        : 0;

      const roleCounts = new Map<string, number>();
      cohort.forEach(item => {
        const title = item.careerRole.shortTitle;
        roleCounts.set(title, (roleCounts.get(title) || 0) + 1);
      });

      const sortedRoles = Array.from(roleCounts.entries()).sort((a, b) => b[1] - a[1]);
      const topRole = sortedRoles.length > 0 ? sortedRoles[0][0] : "Generalist";

      return {
        ...centre,
        candidateCount: count,
        avgScore,
        distinctRolesCount: roleCounts.size,
        topRole
      };
    });
  }, [enrichedStudents]);

  // Center-Specific Role Production Statistics (for the active selected centre)
  const activeCentreMetrics = useMemo(() => {
    const centreCohort = enrichedStudents.filter(item => {
      const matchCentre = selectedCentre === "All Centres" || item.student.centre.city === selectedCentre;
      const matchDomain = selectedDomain === "All Domains" || item.student.domain === selectedDomain;
      return matchCentre && matchDomain;
    });

    const counts: Record<string, { roleTitle: string; shortTitle: string; sectorColor: string; count: number }> = {};
    const enterprises = new Set<string>();

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
      role.hiringOrganizations.forEach(org => enterprises.add(org));
    });

    const list = Object.values(counts).sort((a, b) => b.count - a.count);
    const avgScore = centreCohort.length > 0
      ? Math.round((centreCohort.reduce((sum, i) => sum + i.breakdown.futureReadyScore, 0) / centreCohort.length) * 10) / 10
      : 0;

    return {
      totalCandidates: centreCohort.length,
      distinctRolesCount: list.length,
      roles: list,
      avgScore,
      enterprises: Array.from(enterprises).slice(0, 7)
    };
  }, [enrichedStudents, selectedCentre, selectedDomain]);

  // Filtered and Ranked Students (with Multi-Choice STEAMER Pillar Filter)
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

      // Multi-Choice STREAMER Pillar Filter
      const matchPillars = selectedPillars.length === 0 ||
        selectedPillars.some(p => 
          item.topPillars.some(top => top.pillar === p) ||
          item.careerRole.requiredCompetencies.includes(p) ||
          item.careerRole.competencyTriplet.includes(p)
        );

      return matchCentre && matchDomain && matchRole && matchSearch && matchPillars;
    });

    // Sort descending by Future Ready Score
    return filtered.sort((a, b) => b.breakdown.futureReadyScore - a.breakdown.futureReadyScore);
  }, [enrichedStudents, selectedCentre, selectedDomain, selectedRole, selectedPillars, searchQuery]);

  const displayedStudents = rankedStudents.slice(0, visibleLimit);
  const hasMore = visibleLimit < rankedStudents.length;

  const handleResetFilters = () => {
    setSelectedCentre("All Centres");
    setSelectedDomain("All Domains");
    setSelectedRole("All Roles");
    setSelectedPillars([]);
    setSearchQuery("");
    setVisibleLimit(5);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-background text-slate-900 hide-on-print">
      
      {/* 1. Header with Title, Print PDF Button & Formula Toggle */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Executive Talent Spotlight • Lab of Future</span>
        </div>
        <div className="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              Future Ready Talent Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal max-w-3xl">
              Spotlighting top student competencies matched to high-demand real-world industry roles, expected market salary benchmarks, and actively hiring global enterprises (<span className="text-slate-700 font-semibold">NASA, Tesla, ISRO, ESA, TATA, SpaceX</span>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Single Page Landscape PDF Export Button */}
            <button
              onClick={() => triggerLandscapePdfPrint(`Future_Ready_Talent_Pipeline_${selectedCentre}`)}
              className="inline-flex items-center space-x-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-2xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Export PDF (Landscape)</span>
            </button>

            <button
              onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
              className="inline-flex items-center space-x-1.5 text-xs text-streamer-science hover:text-blue-700 bg-white px-4 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs font-semibold cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Composite Formula</span>
              {isFormulaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
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

      {/* 2. FUTURISTIC BI CENTERWISE INNOVATION HUB (Interactive Infographic Filter) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Futuristic BI Model • Centerwise Talent Pipeline
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click a center to filter talent dossier</span>
        </div>

        {/* 6 Interactive Center Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {centreBiStats.map((center) => {
            const isSelected = selectedCentre === center.city;
            return (
              <button
                key={center.id}
                type="button"
                onClick={() => {
                  setSelectedCentre(center.city);
                  setVisibleLimit(5);
                }}
                className={`text-left p-3.5 rounded-2xl transition-all duration-200 relative overflow-hidden cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-b from-blue-50/90 to-white border-blue-500 shadow-md ring-2 ring-blue-500/20"
                    : "bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{center.flag}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {center.code}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 truncate">
                  {center.city}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {center.country}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-display font-black text-slate-900">
                      {center.candidateCount}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">leads</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {center.avgScore} FR
                  </div>
                </div>

                <div className="mt-1.5 text-[9px] font-medium text-slate-500 truncate" title={center.specialty}>
                  {center.specialty}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MULTI-CHOICE STREAMER LEVEL FILTER BAR */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Multi-Choice STREAMER Level Filter (Select to inspect candidates & matching roles):
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {selectedPillars.length > 0 && (
              <button
                onClick={() => setSelectedPillars([])}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Clear Pillars ({selectedPillars.length} active)
              </button>
            )}
            <button
              onClick={() => setSelectedPillars(STREAMER_PILLARS_LIST.map(p => p.name))}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Select All 8
            </button>
          </div>
        </div>

        {/* 8 Multi-Select Pill Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {STREAMER_PILLARS_LIST.map((p) => {
            const isSelected = selectedPillars.includes(p.name);
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => togglePillar(p.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900/30"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: p.color }} 
                />
                <span>{p.name}</span>
                {isSelected && <span className="text-[10px] text-cyan-300 font-mono">✓</span>}
              </button>
            );
          })}
        </div>

        {selectedPillars.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              Targeting candidates with high mastery in: <strong className="text-slate-900">{selectedPillars.join(" • ")}</strong>
            </span>
            <span className="font-mono text-blue-700 font-bold">
              {rankedStudents.length} candidates match
            </span>
          </div>
        )}
      </div>

      {/* 4. CENTER BI INTELLIGENCE STRIP & LIVE SCOPE SUMMARY */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Scope Summary */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-base shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-display font-bold text-slate-900">
                  {selectedCentre === "All Centres" ? "Global Talent Network (All Labs)" : `${selectedCentre} Innovation Lab`}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Verified Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Producing <strong className="text-slate-800 font-semibold">{activeCentreMetrics.distinctRolesCount} distinct career trajectories</strong> from {activeCentreMetrics.totalCandidates} candidates • Avg Readiness: <span className="text-emerald-700 font-bold">{activeCentreMetrics.avgScore}/100</span>
              </p>
            </div>
          </div>

          {/* Hiring Enterprise Ecosystem */}
          <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mr-1">
              Active Enterprise Demand:
            </span>
            {["NASA", "Tesla", "ISRO", "ESA", "TATA", "SpaceX"].map((company) => (
              <span
                key={company}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[11px] shadow-2xs"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Roles Produced in this scope */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center space-x-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span>Roles Produced in this Lab:</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedRole("All Roles");
              setVisibleLimit(5);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedRole === "All Roles"
                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
            }`}
          >
            All Tracks ({activeCentreMetrics.totalCandidates})
          </button>

          {activeCentreMetrics.roles.map(r => {
            const isSelected = selectedRole === r.shortTitle || selectedRole === r.roleTitle;
            return (
              <button
                key={r.shortTitle}
                type="button"
                onClick={() => {
                  setSelectedRole(isSelected ? "All Roles" : r.shortTitle);
                  setVisibleLimit(5);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: r.sectorColor }}
                />
                <span>{r.shortTitle}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {r.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. COMPACT SINGLE-ROW SLICERS TOOLBAR */}
      <div className="mb-6 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, role, or company (e.g. Tesla)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleLimit(5);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 w-64 sm:w-72"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Domain Slicer */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setVisibleLimit(5);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {domains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Role Slicer Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setVisibleLimit(5);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer max-w-[180px] truncate"
            >
              <option value="All Roles">All Roles</option>
              {availableRoles.map(r => (
                <option key={r.shortTitle} value={r.shortTitle}>{r.shortTitle} ({r.count})</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedCentre !== "All Centres" || selectedDomain !== "All Domains" || selectedRole !== "All Roles" || selectedPillars.length > 0 || searchQuery !== "") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium shrink-0">
          Showing <strong className="text-slate-900 font-mono">{displayedStudents.length}</strong> of <strong className="text-slate-900 font-mono">{rankedStudents.length}</strong> matching candidates
        </div>
      </div>

      {/* 6. SPOTLIGHTED INFOGRAPHIC CANDIDATE DOSSIERS */}
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
            const { student, breakdown, topPillars, careerRole } = item;
            const rank = index + 1;

            return (
              <div
                key={student.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                {/* Visual Rank Accent Bar on Left Border */}
                <div 
                  className="absolute top-0 left-0 bottom-0 w-2.5"
                  style={{
                    backgroundColor: 
                      rank === 1 ? "#F59E0B" :
                      rank === 2 ? "#94A3B8" :
                      rank === 3 ? "#D97706" : "#E2E8F0"
                  }}
                />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pl-2">
                  
                  {/* LEFT & CENTER ZONE: Student Spotlight & Real-World Career Role */}
                  <div className="flex-1 min-w-0">
                    
                    {/* ZONE A: Student Rank, Name, Domain & Driver Competencies */}
                    <div className="flex items-start gap-4">
                      {/* Executive Podium Rank Badge */}
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs ${
                        rank === 1 ? "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white shadow-amber-200/60" :
                        rank === 2 ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white shadow-slate-300/60" :
                        rank === 3 ? "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white shadow-orange-300/60" :
                        "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        <span className="text-xl font-display font-black leading-none">
                          #{rank < 10 ? `0${rank}` : rank}
                        </span>
                        <span className="text-[8px] uppercase font-bold tracking-wider opacity-90 mt-0.5">
                          {rank === 1 ? "Alpha" : rank === 2 ? "Elite" : rank === 3 ? "Honors" : "Rank"}
                        </span>
                      </div>

                      {/* Student Name & Academic Meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Link 
                            to={`/profiles/student/${student.id}`}
                            className="text-xl sm:text-2xl font-display font-black text-slate-900 hover:text-blue-600 transition-colors group flex items-center space-x-1.5"
                          >
                            <span>{student.name}</span>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </Link>

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

                        {/* Streamlined Origin & Lab Tag */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="flex items-center space-x-1 text-slate-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{student.centre.city} Lab, {student.centre.country}</span>
                          </span>
                          <span>•</span>
                          <span>Grade {student.grade}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">{student.batch}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-semibold">{student.badges.length} Badges Earned</span>
                        </div>

                        {/* Top 3 Competency Drivers (Clean, Uncluttered Infographic Badges) */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mr-0.5">
                            Key Drivers:
                          </span>
                          {topPillars.map((p, idx) => (
                            <div 
                              key={idx}
                              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800"
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                              <span>{p.pillar}</span>
                              <span className="font-mono text-slate-500 font-semibold text-[11px]">{p.ytd}</span>
                            </div>
                          ))}
                          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>{breakdown.distinctSdgs.length} SDGs Targeted</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ZONE B: TARGET CAREER ROLE, SALARY SPOTLIGHT & DEMANDING ENTERPRISES */}
                    <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-50/60 to-blue-50/30 border border-slate-200/90 shadow-2xs">
                      
                      {/* Role Header with Spotlighted Market Salary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                            Target Real-World Career Role
                          </span>
                          <h3 className="text-base sm:text-lg font-display font-black text-slate-900 mt-0.5">
                            {careerRole.roleTitle}
                          </h3>
                        </div>

                        {/* TENTATIVE MARKET SALARY SPOTLIGHT BADGE */}
                        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-1">
                          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold font-display shadow-2xs">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Market Salary: {careerRole.tentativeSalary}</span>
                            <span className="text-[10px] text-emerald-700 font-mono font-normal">({careerRole.tentativeSalaryInr})</span>
                          </div>
                          
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs"
                            style={{ backgroundColor: careerRole.sectorColor }}
                          >
                            {careerRole.sector}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 font-mono">
                            {careerRole.industryDemand}
                          </span>
                        </div>
                      </div>

                      {/* DEMANDED BY ENTERPRISE GIANTS (NASA, TESLA, ISRO, ESA, TATA, ETC.) */}
                      <div className="mt-3.5 pt-3.5 border-t border-slate-200/80">
                        <div className="flex items-center space-x-1.5 mb-2">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono">
                            Skills Demanded By Industry Giants:
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {careerRole.hiringOrganizations.map((org) => (
                            <span
                              key={org}
                              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900 text-white font-display font-bold text-xs shadow-xs hover:bg-slate-800 transition-colors"
                            >
                              <Briefcase className="w-3 h-3 text-cyan-400" />
                              <span>{org}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Concise Competency Synergy & Triad */}
                      <div className="mt-3 text-xs text-slate-600 leading-relaxed font-normal flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-200/60">
                        <p className="flex-1">
                          <strong className="text-slate-800 font-semibold">Competency Synergy: </strong>
                          {careerRole.matchReason}
                        </p>
                        <div className="shrink-0 flex items-center space-x-2 text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-700">{careerRole.competencyTriplet}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">{careerRole.fitScore}% Match</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ZONE: INFOGRAPHIC FUTURE READY SCORE HUB */}
                  <div className="lg:w-72 shrink-0 p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="text-center pb-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Future Ready Score
                        </span>
                        
                        {/* Semi-circular Futuristic Arc Gauge */}
                        <div className="relative flex flex-col items-center justify-center mt-1">
                          <svg viewBox="0 0 100 58" className="w-36 h-22 overflow-visible">
                            <path
                              d="M 15 50 A 35 35 0 0 1 85 50"
                              fill="none"
                              stroke="#F1F5F9"
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
                          <div className="-mt-7 text-center">
                            <div className="text-3xl font-display font-black text-slate-900 tracking-tight">
                              {breakdown.futureReadyScore}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 font-mono -mt-0.5">OUT OF 100</div>
                          </div>
                        </div>

                        <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{breakdown.futureReadyScore >= 90 ? "Top 5% Global Elite" : "Industry Ready"}</span>
                        </div>
                      </div>

                      {/* Balanced 3-Component Score Breakdown */}
                      <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100">
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-slate-500">STREAMER Core (50%)</span>
                            <span className="font-mono font-bold text-slate-800">{breakdown.streamerAvg}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${breakdown.streamerAvg}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-slate-500">21st Century Skills (30%)</span>
                            <span className="font-mono font-bold text-slate-800">{breakdown.twentyFirstCenturyAvg}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${breakdown.twentyFirstCenturyAvg}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-slate-500">SDG Impact Breadth (20%)</span>
                            <span className="font-mono font-bold text-slate-800">{Math.round(breakdown.sdgBreadthPct)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.sdgBreadthPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DEDICATED FUTURE READY DOSSIER LINK */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Link
                        to={`/profiles/student/${student.id}`}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs group cursor-pointer"
                      >
                        <span>Inspect Future Ready Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Show Next Candidates ({rankedStudents.length - visibleLimit} remaining)
          </button>
        </div>
      )}
      </div>

      {/* Single-Page Landscape Printable Report for PDF Export */}
      <div className="hidden print-only-block">
        <ExecutiveFutureReadyReport
          enrichedStudents={rankedStudents}
          selectedCentre={selectedCentre}
          selectedPillars={selectedPillars}
          selectedDomain={selectedDomain}
          selectedRole={selectedRole}
          isPrintOnly={true}
        />
      </div>
    </>
  );
};
