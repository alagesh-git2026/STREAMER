import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import { SDG_LIST } from "../data/frameworkData";
import { 
  calculateFutureReadyScore, 
  calculateStreamerPillars, 
  calculate21stCenturySkills 
} from "../utils/calculations";
import { 
  Award, 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ExternalLink
} from "lucide-react";

export const FutureReadyProfilesPage: React.FC = () => {
  const { students } = useStudentData();
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [visibleLimit, setVisibleLimit] = useState<number>(5);
  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);

  const domains = ["All Domains", "Aerospace", "Robotics", "Space & Astro"];

  // Enrich students with computed Future Ready data and sort descending
  const rankedStudents = useMemo(() => {
    const list = students.map((student) => {
      const breakdown = calculateFutureReadyScore(student);
      const pillars = calculateStreamerPillars(student);
      const topPillars = [...pillars].sort((a, b) => b.ytd - a.ytd).slice(0, 3);
      
      const skills21 = calculate21stCenturySkills(student);
      const topSkills21 = [...skills21].sort((a, b) => b.score - a.score).slice(0, 2);

      return {
        student,
        breakdown,
        topPillars,
        topSkills21
      };
    });

    // Filter by domain
    const filtered = selectedDomain === "All Domains"
      ? list
      : list.filter(item => item.student.domain === selectedDomain);

    // Sort descending by Future Ready Score
    return filtered.sort((a, b) => b.breakdown.futureReadyScore - a.breakdown.futureReadyScore);
  }, [selectedDomain]);

  const displayedStudents = rankedStudents.slice(0, visibleLimit);
  const hasMore = visibleLimit < rankedStudents.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-background text-slate-900">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Talent Scouting & Center Head Intelligence</span>
        </div>
        <div className="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Future Ready Leaderboard & Candidate Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Objective cross-domain rankings evaluated by the unified Future Ready Score formula.
            </p>
          </div>

          <button
            onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
            className="inline-flex items-center space-x-1.5 text-xs text-streamer-science hover:text-blue-700 bg-white px-4 py-2 rounded-xl border border-slate-200 transition-colors self-start md:self-auto shadow-xs font-semibold"
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

      {/* 1. Domain Filter Tabs */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 px-3 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Domain:</span>
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setVisibleLimit(5);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? "bg-streamer-science text-white shadow-md shadow-streamer-science/20"
                  : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 px-3 font-medium">
          Showing top <strong className="text-slate-900 font-mono">{displayedStudents.length}</strong> of <strong className="text-slate-900 font-mono">{rankedStudents.length}</strong> candidates
        </div>
      </div>

      {/* 2. Ranked Profile Cards */}
      <div className="space-y-5">
        {displayedStudents.map((item, index) => {
          const { student, breakdown, topPillars, topSkills21 } = item;
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

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-2">
                {/* Left: Rank, Name, Badges & Origin */}
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

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        to={`/insights/student/${student.id}`}
                        className="text-lg sm:text-xl font-display font-bold text-slate-900 hover:text-streamer-science transition-colors flex items-center space-x-1.5"
                      >
                        <span>{student.name}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-70" />
                      </Link>
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

                    {/* Chips: Top 3 STREAMER Strengths + Top 2 21st Century Skills */}
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
                    </div>

                    {/* SDGs Addressed Chips */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">
                        SDGs ({breakdown.distinctSdgs.length}/6):
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

                {/* Right: Headline Future Ready Score & 3-Component Breakdown */}
                <div className="lg:w-80 shrink-0 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      Future Ready Score
                    </span>
                    <span className="text-3xl font-display font-bold text-emerald-600">
                      {breakdown.futureReadyScore}
                    </span>
                  </div>

                  {/* 3-Component Stacked / Sub-bar Breakdown */}
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

      {/* Show More Pagination Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleLimit(prev => prev + 5)}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            Show Next Candidates ({rankedStudents.length - visibleLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
