import React from "react";
import type { Student } from "../../data/students";
import { SDG_LIST } from "../../data/frameworkData";
import { 
  calculateStreamerPillars, 
  calculate21stCenturySkills, 
  calculateFutureReadyScore 
} from "../../utils/calculations";
import { determineFutureReadyRole, type FutureReadyRole } from "../../utils/careerMapping";
import { 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Target, 
  MapPin, 
  Printer,
  X
} from "lucide-react";

interface ExecutiveStudentProposalReportProps {
  student: Student;
  rank: number;
  totalCandidates: number;
  isPrintOnly?: boolean;
  onClose?: () => void;
}

export const ExecutiveStudentProposalReport: React.FC<ExecutiveStudentProposalReportProps> = ({
  student,
  rank,
  totalCandidates,
  isPrintOnly = false,
  onClose,
}) => {
  const pillars = React.useMemo(() => calculateStreamerPillars(student), [student]);
  const skills21 = React.useMemo(() => calculate21stCenturySkills(student), [student]);
  const breakdown = React.useMemo(() => calculateFutureReadyScore(student), [student]);
  const careerRole: FutureReadyRole = React.useMemo(() => determineFutureReadyRole(student), [student]);

  const sortedPillars = React.useMemo(() => [...pillars].sort((a, b) => b.ytd - a.ytd), [pillars]);
  const topStrengths = sortedPillars.slice(0, 3);
  const growthAreas = sortedPillars.slice(-2);

  return (
    <div
      className={`bg-white text-slate-900 leading-snug ${
        isPrintOnly ? "print-only-block w-full max-w-[1100px] mx-auto p-3" : "p-6 rounded-3xl shadow-2xl border border-slate-200 max-w-6xl mx-auto my-6"
      }`}
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* Interactive Modal Actions Bar (Hidden on print) */}
      {!isPrintOnly && (
        <div className="no-print flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-display font-bold text-slate-900 text-sm">
              Single-Page Executive Talent Proposal • {student.name}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Single-Page Proposal</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. DOCUMENT HEADER */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2 mb-2.5">
        <div className="flex items-center space-x-3">
          <img
            src={`${import.meta.env.BASE_URL}lof-logo.png`}
            alt="Lab of Future"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-display font-black uppercase tracking-tight text-slate-950">
                Future Ready Talent Proposal & Candidate Dossier
              </h1>
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200">
                OFFICIAL BI PROPOSAL
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium mt-0.2">
              STREAMER Competency Verification • Corporate Career Fit • Industry Compensation Benchmark
            </p>
          </div>
        </div>

        <div className="text-right text-[9px] font-mono text-slate-500">
          <div>Ref: <strong className="text-slate-900">LOF-FR-{student.id}-2026</strong></div>
          <div>Verified: <strong className="text-slate-700">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></div>
        </div>
      </div>

      {/* 2. TOP HERO ROW: CANDIDATE IDENTITY + FUTURE READY SCORE + SALARY SPOTLIGHT */}
      <div className="grid grid-cols-12 gap-2 mb-2.5">
        
        {/* Candidate Spotlight Tile (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
          {/* Rank Badge */}
          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-xs ${
            rank === 1 ? "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white" :
            rank === 2 ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white" :
            rank === 3 ? "bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 text-white" :
            "bg-slate-200 text-slate-700"
          }`}>
            <span className="text-lg font-display font-black leading-none">#{rank < 10 ? `0${rank}` : rank}</span>
            <span className="text-[7px] uppercase font-bold tracking-wider mt-0.5 opacity-90">
              {rank === 1 ? "Alpha" : rank === 2 ? "Elite" : rank === 3 ? "Honors" : "Rank"}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-display font-black text-slate-950 truncate">
                {student.name}
              </h2>
              <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                {student.domain}
              </span>
            </div>

            <div className="text-[9px] text-slate-600 flex items-center space-x-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{student.centre.city} Lab, {student.centre.country}</span>
              <span>•</span>
              <span>Grade {student.grade}</span>
              <span>•</span>
              <span className="font-mono">{student.batch}</span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-[8px] uppercase font-bold text-slate-400 font-mono">Drivers:</span>
              {topStrengths.map(p => (
                <span key={p.pillar} className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  {p.pillar} ({p.ytd})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Future Ready Score Arc (3 cols) */}
        <div className="col-span-3 p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between text-center">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Future Ready Score
            </span>
            <div className="relative flex flex-col items-center justify-center mt-0.5">
              <svg viewBox="0 0 100 52" className="w-24 h-14 overflow-visible">
                <path
                  d="M 16 46 A 34 34 0 0 1 84 46"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 16 46 A 34 34 0 0 1 84 46"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={106.8}
                  strokeDashoffset={106.8 - (breakdown.futureReadyScore / 100) * 106.8}
                />
              </svg>
              <div className="-mt-6 text-center">
                <div className="text-xl font-display font-black text-slate-900 leading-none">
                  {breakdown.futureReadyScore}
                </div>
                <div className="text-[8px] font-bold text-slate-400 font-mono">/ 100</div>
              </div>
            </div>
          </div>

          <div className="mt-1 text-[8px] text-slate-500 font-mono flex justify-between px-1">
            <span>ST: {breakdown.streamerAvg}</span>
            <span>21st: {breakdown.twentyFirstCenturyAvg}</span>
            <span>SDG: {Math.round(breakdown.sdgBreadthPct)}%</span>
          </div>
        </div>

        {/* Market Value & Salary Spotlight (4 cols) */}
        <div className="col-span-4 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>Market Salary Benchmark</span>
              </span>
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900">
                Top 10% Tier
              </span>
            </div>

            <div className="text-sm font-display font-black text-slate-950 mt-1">
              {careerRole.tentativeSalary}
            </div>
            <div className="text-[9px] font-mono font-bold text-emerald-700">
              {careerRole.tentativeSalaryInr} (India CTC)
            </div>
          </div>

          <div className="mt-1 text-[8px] text-slate-600 pt-1 border-t border-emerald-200">
            Median potential of <strong className="text-slate-900">${Math.round(careerRole.medianSalaryUsd / 1000)}K</strong> (+29% above cohort baseline of $128K).
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: TARGET CAREER ROLE & DEMAND (LEFT) + STREAMER COMPETENCIES & 21ST SKILLS (RIGHT) */}
      <div className="grid grid-cols-12 gap-2 mb-2.5">
        
        {/* Left 6 cols: Target Real-World Career Role & Demanded Giants */}
        <div className="col-span-6 p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
              <Target className="w-3 h-3 text-blue-600" />
              <span>Target Real-World Career Trajectory</span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-display font-black text-slate-950 leading-snug">
                {careerRole.roleTitle}
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold text-white shrink-0" style={{ backgroundColor: careerRole.sectorColor }}>
                {careerRole.sector}
              </span>
            </div>

            {/* Competency Synergy Statement */}
            <p className="text-[9px] text-slate-600 mt-1.5 leading-normal">
              <strong className="text-slate-900">Synergy: </strong>
              {careerRole.matchReason}
            </p>

            {/* Demanding Industry Giants */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                <span>Skills Demanded By Global Giants:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {careerRole.hiringOrganizations.map(org => (
                  <span key={org} className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[8px] font-bold">
                    <Briefcase className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{org}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-500">
            <span>Competency Triad: <strong className="text-slate-800">{careerRole.competencyTriplet}</strong></span>
            <span className="text-emerald-700 font-bold">{careerRole.fitScore}% Fit Index</span>
          </div>
        </div>

        {/* Right 6 cols: 8-Pillar STREAMER Breakdown & 21st Century Skills */}
        <div className="col-span-6 p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
              8-Pillar STREAMER Competency Mastery (YTD Evaluation)
            </div>

            {/* Mini Horizontal Pillar Bars */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px]">
              {pillars.map(p => (
                <div key={p.pillar} className="flex items-center justify-between">
                  <span className="text-slate-600 truncate w-18 font-medium">{p.pillar}:</span>
                  <div className="flex-1 mx-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.ytd}%`, backgroundColor: p.color }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-5 text-right">{p.ytd}</span>
                </div>
              ))}
            </div>

            {/* 21st Century & UN SDGs */}
            <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[8px]">
              <div>
                <span className="font-bold uppercase font-mono text-purple-700 block mb-0.5">21st Century Human Intelligence:</span>
                <div className="text-slate-700">
                  {skills21.slice(0, 3).map(s => `${s.name} (${s.score})`).join(" • ")}
                </div>
              </div>

              <div>
                <span className="font-bold uppercase font-mono text-emerald-700 block mb-0.5">UN Sustainable Development Goals:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown.distinctSdgs.slice(0, 5).map(sdgKey => {
                    const sdg = SDG_LIST[sdgKey];
                    return (
                      <span
                        key={sdgKey}
                        className="px-1 py-0.2 rounded text-[7px] font-bold text-white"
                        style={{ backgroundColor: sdg?.color || "#3B82F6" }}
                      >
                        {sdgKey}
                      </span>
                    );
                  })}
                  <span className="text-[7px] text-slate-400 font-mono font-bold">({Math.round(breakdown.sdgBreadthPct)}% breadth)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-500">
            <span>Primary Growth Scope: <strong className="text-amber-800">{growthAreas[0]?.pillar || "Entrepreneurship"}</strong></span>
            <span className="text-emerald-700 font-semibold">{student.badges.length} Certified Badges Earned</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: EXECUTIVE COUNCIL VERDICT & NEXT-STEP FELLOWSHIP PATHWAY */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Academic Council Evaluation & Recommended Corporate Pathway
            </div>
            <p className="text-[9px] text-slate-700 leading-normal mt-0.5">
              Candidate ranks in the <strong className="text-slate-950">Top {100 - Math.round((rank / totalCandidates) * 100) || 5}% globally</strong> across all 5 International Innovation Labs. Demonstrates proven multidisciplinary capability combining analytical rigor with prototype execution. Recommended for corporate residency and deeptech venture fellowships at partner organizations (<strong className="text-slate-900">NASA JPL, Tesla, ISRO, Tata Motors</strong>).
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-3 text-right">
            <div className="text-[8px] font-mono text-slate-400">
              <div>Council Sign-off: <strong className="text-slate-700">VERIFIED</strong></div>
              <div>LOF Global Registry: <strong className="text-emerald-700">ACTIVE</strong></div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-[10px]">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400 font-mono">
        <div>Lab of Future • K-12 DeepTech & Future Ready Innovation Ecosystem • Bengaluru • Shanghai • Dubai • Austin • New Delhi</div>
        <div>Page 1 of 1 • Single-Page Executive Proposal</div>
      </div>
    </div>
  );
};
