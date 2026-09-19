import React from "react";
import type { Student } from "../../data/students";
import type { FutureReadyRole } from "../../utils/careerMapping";
import { calculateFutureReadyScore } from "../../utils/calculations";
import { Award, Printer, X } from "lucide-react";

interface EnrichedStudentItem {
  student: Student;
  breakdown: ReturnType<typeof calculateFutureReadyScore>;
  topPillars: { pillar: string; ytd: number; color: string }[];
  topSkills21: { name: string; score: number }[];
  careerRole: FutureReadyRole;
}

interface ExecutiveFutureReadyReportProps {
  enrichedStudents: EnrichedStudentItem[];
  selectedCentre: string;
  selectedPillars: string[];
  selectedDomain: string;
  selectedRole: string;
  isPrintOnly?: boolean;
  onClose?: () => void;
}

export const ExecutiveFutureReadyReport: React.FC<ExecutiveFutureReadyReportProps> = ({
  enrichedStudents,
  selectedCentre,
  selectedPillars,
  selectedDomain,
  selectedRole,
  isPrintOnly = false,
  onClose,
}) => {
  // Aggregate KPIs
  const totalCandidates = enrichedStudents.length;
  const avgScore = totalCandidates > 0
    ? Math.round((enrichedStudents.reduce((sum, item) => sum + item.breakdown.futureReadyScore, 0) / totalCandidates) * 10) / 10
    : 0;

  const distinctRoles = new Set(enrichedStudents.map(i => i.careerRole.shortTitle)).size;

  const allSalariesUsd = enrichedStudents.map(i => i.careerRole.medianSalaryUsd);
  const minSalary = allSalariesUsd.length > 0 ? Math.min(...allSalariesUsd) : 95000;
  const maxSalary = allSalariesUsd.length > 0 ? Math.max(...allSalariesUsd) : 210000;

  return (
    <div
      className={`bg-white text-slate-900 leading-tight ${
        isPrintOnly ? "print-only-block w-full max-w-[1120px] mx-auto p-2" : "p-6 rounded-3xl border border-slate-200 shadow-xl max-w-6xl mx-auto my-6"
      }`}
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* Top Bar for Interactive Modal View (Hidden during print) */}
      {!isPrintOnly && (
        <div className="no-print flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-700" />
            <span className="font-display font-bold text-slate-900 text-sm">
              Single-Page Landscape PDF Preview • Future-Ready Talent Pipeline
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
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

      {/* 1. Print Header */}
      <div className="flex items-start justify-between pb-2 border-b-2 border-slate-900">
        <div className="flex items-center space-x-3">
          <img
            src={`${import.meta.env.BASE_URL}lof-logo.png`}
            alt="Lab of Future"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div>
            <h1 className="text-sm sm:text-base font-display font-black tracking-tight text-slate-950 uppercase">
              Lab of Future • Future-Ready Talent & Career Trajectories
            </h1>
            <div className="text-[9px] font-semibold text-slate-600 flex items-center space-x-2 mt-0.5">
              <span>Scope: <strong className="text-slate-900">{selectedCentre === "All Centres" ? "Global Innovation Network (All Labs)" : `${selectedCentre} Innovation Lab`}</strong></span>
              <span>•</span>
              <span>Domain: <strong className="text-slate-900">{selectedDomain}</strong></span>
              <span>•</span>
              <span>STEAMER Filter: <strong className="text-slate-900">{selectedPillars.length > 0 ? selectedPillars.join(", ") : "All 8 Pillars Active"}</strong></span>
              <span>•</span>
              <span>Role: <strong className="text-slate-900">{selectedRole}</strong></span>
            </div>
          </div>
        </div>

        <div className="text-right text-[9px] font-mono text-slate-500">
          <div>Verified Portfolio • Class of 2026</div>
          <div className="font-bold text-slate-700 mt-0.2">Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
        </div>
      </div>

      {/* 2. Executive KPI Strip */}
      <div className="grid grid-cols-5 gap-2 my-2">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[8px] uppercase font-bold text-slate-400 font-mono">Talent Headcount</div>
          <div className="text-sm font-display font-black text-slate-900 mt-0.2">
            {totalCandidates} Candidates
          </div>
        </div>

        <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200">
          <div className="text-[8px] uppercase font-bold text-blue-600 font-mono">Career Trajectories</div>
          <div className="text-sm font-display font-black text-blue-900 mt-0.2">
            {distinctRoles} Industry Tracks
          </div>
        </div>

        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="text-[8px] uppercase font-bold text-emerald-700 font-mono">Average FR Score</div>
          <div className="text-sm font-display font-black text-emerald-800 mt-0.2">
            {avgScore} / 100
          </div>
        </div>

        <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200">
          <div className="text-[8px] uppercase font-bold text-amber-700 font-mono">Market Salary Range</div>
          <div className="text-[11px] font-display font-black text-amber-900 mt-0.5">
            ${Math.round(minSalary / 1000)}K – ${Math.round(maxSalary / 1000)}K / yr
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 text-white">
          <div className="text-[8px] uppercase font-bold text-cyan-400 font-mono">Key Corporate Ecosystem</div>
          <div className="text-[9px] font-bold text-slate-200 mt-0.5 truncate">
            NASA • Tesla • ISRO • ESA • TATA
          </div>
        </div>
      </div>

      {/* 3. High-Density Printable Infographic Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-slate-200 text-[9px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase font-mono font-bold text-[8px] border-b border-slate-300">
              <th className="py-1.5 px-2 border-r border-slate-200 w-10 text-center">Rank</th>
              <th className="py-1.5 px-2 border-r border-slate-200 w-32">Student & Centre</th>
              <th className="py-1.5 px-2 border-r border-slate-200 w-20 text-center">FR Score</th>
              <th className="py-1.5 px-2 border-r border-slate-200">Target Career Role & Sector</th>
              <th className="py-1.5 px-2 border-r border-slate-200 w-32">Tentative Market Salary</th>
              <th className="py-1.5 px-2 border-r border-slate-200 w-40">Demanding Industry Giants</th>
              <th className="py-1.5 px-2 w-32">Key Competency Triad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {enrichedStudents.map((item, idx) => {
              const rank = idx + 1;
              const { student, breakdown, careerRole } = item;
              return (
                <tr key={student.id} className={idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                  {/* Rank */}
                  <td className="py-1 px-1.5 border-r border-slate-200 text-center font-display font-bold">
                    <span className={`inline-block px-1 py-0.2 rounded text-[9px] font-black ${
                      rank === 1 ? "bg-amber-100 text-amber-900 border border-amber-300" :
                      rank === 2 ? "bg-slate-200 text-slate-800 border border-slate-300" :
                      rank === 3 ? "bg-orange-100 text-orange-900 border border-orange-300" :
                      "text-slate-700"
                    }`}>
                      #{rank < 10 ? `0${rank}` : rank}
                    </span>
                  </td>

                  {/* Student & Centre */}
                  <td className="py-1 px-2 border-r border-slate-200">
                    <div className="font-bold text-slate-900 text-[9.5px] leading-tight">{student.name}</div>
                    <div className="text-[8px] text-slate-500">{student.centre.city} • {student.domain}</div>
                  </td>

                  {/* Future Ready Score */}
                  <td className="py-1 px-2 border-r border-slate-200 text-center">
                    <div className="font-display font-black text-xs text-emerald-700 leading-none">
                      {breakdown.futureReadyScore}
                    </div>
                    <div className="text-[7px] text-slate-400 font-mono mt-0.2">
                      {breakdown.streamerAvg}/{breakdown.twentyFirstCenturyAvg}
                    </div>
                  </td>

                  {/* Target Career Role */}
                  <td className="py-1 px-2 border-r border-slate-200">
                    <div className="font-bold text-slate-900 text-[9px] leading-tight">{careerRole.roleTitle}</div>
                    <div className="text-[7.5px] text-slate-500 flex items-center space-x-1">
                      <span className="font-semibold text-slate-700">{careerRole.sector}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-medium">{careerRole.industryDemand}</span>
                    </div>
                  </td>

                  {/* Tentative Market Salary */}
                  <td className="py-1 px-2 border-r border-slate-200">
                    <div className="font-display font-bold text-emerald-800 leading-tight">
                      {careerRole.tentativeSalary}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono">
                      {careerRole.tentativeSalaryInr}
                    </div>
                  </td>

                  {/* Demanding Giants */}
                  <td className="py-1 px-2 border-r border-slate-200">
                    <div className="flex flex-wrap gap-0.5">
                      {careerRole.hiringOrganizations.slice(0, 4).map(org => (
                        <span key={org} className="px-1 py-0.2 rounded bg-slate-100 border border-slate-200 font-bold text-[7.5px] text-slate-800">
                          {org}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Competency Triad */}
                  <td className="py-1 px-2">
                    <div className="font-semibold text-slate-800 leading-tight">{careerRole.competencyTriplet}</div>
                    <div className="text-[7.5px] text-emerald-700 font-mono font-bold">
                      {careerRole.fitScore}% Fit Index
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Footer */}
      <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
        <div className="flex items-center space-x-2">
          <span>Lab of Future K-12 STEM Innovation Ecosystem</span>
          <span>•</span>
          <span>Bengaluru | New Delhi | Dubai | Austin | Shanghai</span>
        </div>
        <div className="font-mono">
          Page 1 of 1 • Official Credential • Confidential Corporate Talent Dossier
        </div>
      </div>
    </div>
  );
};
