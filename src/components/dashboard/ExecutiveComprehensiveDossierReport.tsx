import React, { useMemo } from "react";
import type { Student } from "../../data/students";
import {
  calculateStreamerPillars,
  calculateFutureReadyScore,
  getTopStrengthPillars,
  getRubricBand,
} from "../../utils/calculations";
import { Award, Users, TrendingUp, ShieldCheck, Printer, X, Building2 } from "lucide-react";

interface ExecutiveComprehensiveDossierReportProps {
  students: Student[];
  selectedCentre: string;
  selectedYear: string;
  selectedBatch: string;
  selectedStrength?: string;
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const ExecutiveComprehensiveDossierReport: React.FC<ExecutiveComprehensiveDossierReportProps> = ({
  students,
  selectedCentre,
  selectedYear,
  selectedBatch,
  selectedStrength = "All",
  onClose,
  isPrintOnly = false,
}) => {
  // Cohort Summary Metrics
  const cohortMetrics = useMemo(() => {
    if (students.length === 0) {
      return { avgScore: 0, avgFutureReady: 0, passRate: 0, masteryRate: 0 };
    }

    let totalScoreSum = 0;
    let totalFrSum = 0;
    let proficientCount = 0;
    let masteryCount = 0;

    students.forEach((s) => {
      const pillars = calculateStreamerPillars(s);
      const studentAvg = pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length;
      totalScoreSum += studentAvg;
      totalFrSum += calculateFutureReadyScore(s).futureReadyScore;

      if (studentAvg >= 65) proficientCount += 1;
      if (studentAvg >= 85) masteryCount += 1;
    });

    return {
      avgScore: Number((totalScoreSum / students.length).toFixed(1)),
      avgFutureReady: Number((totalFrSum / students.length).toFixed(1)),
      passRate: Number(((proficientCount / students.length) * 100).toFixed(1)),
      masteryRate: Number(((masteryCount / students.length) * 100).toFixed(1)),
    };
  }, [students]);

  return (
    <div
      className={`bg-white text-slate-900 leading-tight ${
        isPrintOnly ? "print-only-block w-full p-2 max-w-[1120px] mx-auto" : "p-6 rounded-3xl shadow-2xl border border-slate-200 max-w-7xl mx-auto my-6"
      }`}
    >
      {/* ========================================================= */}
      {/* 1. EXECUTIVE HEADER BAR */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2.5">
        <div className="flex items-center space-x-3">
          <img src="/lof-logo.png" alt="Lab of Future Logo" className="h-9 w-auto object-contain shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
                Comprehensive Student Dossiers
              </h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                Cohort Dossier Report
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              8-Pillar STREAMER Progressions • Calibrated Competency Heights • Future Ready Indices
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 text-right">
          <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Academic Cycle</div>
            <div className="text-[11px] font-black text-slate-900 font-mono">
              {selectedYear === "All" ? "2025-2026 (Aug–Mar)" : selectedYear}
            </div>
          </div>
          <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Scope / Centre</div>
            <div className="text-[11px] font-black text-blue-700">
              {selectedCentre === "All" ? "All Global Centres" : selectedCentre}
            </div>
          </div>
          <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Batch</div>
            <div className="text-[11px] font-bold text-slate-800">
              {selectedBatch} ({students.length} Profiles)
            </div>
          </div>

          {selectedStrength && selectedStrength !== "All" && (
            <div className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <div className="text-[8px] font-bold uppercase tracking-wider text-amber-600">Top Strength</div>
              <div className="text-[11px] font-black text-amber-800">
                {selectedStrength}
              </div>
            </div>
          )}

          {!isPrintOnly && onClose && (
            <div className="flex items-center space-x-1 ml-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. COHORT SUMMARY STRIP */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Cohort Enrolled</div>
            <div className="text-xs font-black text-slate-900 font-mono">{students.length} Students</div>
          </div>
        </div>

        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Cohort Average</div>
            <div className="text-xs font-black text-slate-900 font-mono">{cohortMetrics.avgScore} pts</div>
          </div>
        </div>

        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Future Ready Mean</div>
            <div className="text-xs font-black text-emerald-700 font-mono">{cohortMetrics.avgFutureReady}%</div>
          </div>
        </div>

        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Top Mastery (≥85)</div>
            <div className="text-xs font-black text-slate-900 font-mono">{cohortMetrics.masteryRate}%</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. COMPREHENSIVE DOSSIER CARDS GRID WITH CALIBRATED BARS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-3 gap-2.5">
        {students.map((student) => {
          const pillars = calculateStreamerPillars(student);
          const topStrengths = getTopStrengthPillars(student, selectedStrength);
          const primaryStrength = topStrengths[0];
          const topRubric = getRubricBand(primaryStrength.ytd);
          const futureReady = calculateFutureReadyScore(student);

          return (
            <div
              key={student.id}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <div>
                {/* Top Bar: Centre & Batch */}
                <div className="flex items-center justify-between text-[8px] text-slate-500 mb-1">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Building2 className="w-2.5 h-2.5 text-slate-400" />
                    <span>{student.centre.city}, {student.centre.country}</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 font-mono font-semibold text-slate-700">
                    {student.batch}
                  </span>
                </div>

                {/* Student Info & Future Ready Index */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-xs font-black text-slate-950 truncate max-w-[140px]">
                      {student.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-[8px] text-slate-500 font-medium mt-0.2">
                      <span>{student.grade} • Age {student.age}</span>
                      <span>•</span>
                      <span
                        className={`font-bold px-1 rounded ${
                          student.domain === "Aerospace"
                            ? "bg-blue-50 text-blue-700"
                            : student.domain === "Robotics"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {student.domain}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[7px] font-bold uppercase tracking-wider text-slate-400">Future Ready</div>
                    <div className="text-xs font-black text-emerald-600 font-mono">
                      {futureReady.futureReadyScore}%
                    </div>
                  </div>
                </div>

                {/* 8-Pillar Sparklines with True, Calibrated Height Differences */}
                <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-200 my-1">
                  <div className="flex items-center justify-between text-[8px] text-slate-500 mb-1 font-semibold">
                    <span>8 STREAMER Pillars (YTD)</span>
                    <span className="font-mono text-[7.5px] text-slate-400">Scale: 65–100 pts</span>
                  </div>

                  {/* Dedicated Bar Track: Explicit pixel heights ensure even 2-3 pt differences are clearly visible */}
                  <div className="grid grid-cols-8 gap-1 items-end">
                    {pillars.map((p, pIdx) => {
                      const TRACK_HEIGHT = 52;
                      const MIN_BAR = 8;
                      const MAX_BAR = 42;
                      const BASELINE = 65;
                      const MAX_SCORE = 100;

                      const clamped = Math.max(BASELINE, Math.min(MAX_SCORE, p.ytd));
                      const ratio = (clamped - BASELINE) / (MAX_SCORE - BASELINE);
                      const barHeightPx = Math.round(MIN_BAR + ratio * (MAX_BAR - MIN_BAR));

                      return (
                        <div key={pIdx} className="flex flex-col items-center">
                          {/* Dedicated Bar Track with explicit pixel height */}
                          <div
                            className="w-full flex flex-col justify-end items-center relative"
                            style={{ height: `${TRACK_HEIGHT}px` }}
                          >
                            {/* Visible Numeric Score atop bar */}
                            <span className="text-[7.5px] font-mono font-bold text-slate-700 leading-none mb-0.5 select-none">
                              {p.ytd}
                            </span>
                            {/* Bar with True Calibrated Height in exact pixels */}
                            <div
                              className="w-full rounded-t-sm"
                              style={{
                                height: `${barHeightPx}px`,
                                backgroundColor: p.color,
                              }}
                            />
                          </div>
                          {/* Letter below bar */}
                          <span className="text-[7.5px] font-mono text-slate-500 font-bold mt-0.5 shrink-0">
                            {p.letter}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Card Meta: Top Strength & Rubric Tier */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px]">
                <div className="flex items-center space-x-1 flex-wrap gap-y-0.5">
                  <span className="text-slate-400">Top:</span>
                  {topStrengths.map((ts) => (
                    <span
                      key={ts.pillar}
                      className="px-1.5 py-0.2 rounded font-bold text-white shadow-2xs text-[7.5px]"
                      style={{ backgroundColor: ts.color }}
                    >
                      {ts.pillar} ({ts.ytd})
                    </span>
                  ))}
                </div>
                <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                  {topRubric.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. FOOTER STRIP */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-200 mt-2.5">
        <div className="flex items-center space-x-1 font-medium">
          <Award className="w-2.5 h-2.5 text-blue-600" />
          <span className="font-bold text-slate-600">Lab of Future (LOF) Comprehensive Student Dossiers</span>
          <span>•</span>
          <span>Aug–Mar Academic Cycle Assessment</span>
          <span>•</span>
          <span>Parent & School Institutional Briefing</span>
        </div>
        <div className="font-mono text-slate-500">
          Generated on {new Date().toLocaleDateString()} | LOF-COMPREHENSIVE-DOSSIER
        </div>
      </div>
    </div>
  );
};
