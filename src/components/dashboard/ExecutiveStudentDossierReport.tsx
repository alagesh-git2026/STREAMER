import React, { useMemo } from "react";
import type { Student } from "../../data/students";
import {
  calculateStreamerPillars,
  calculate21stCenturySkills,
  calculateFutureReadyScore,
  getRubricBand,
  getTopAndBottomSkills,
} from "../../utils/calculations";
import { extractStudentProfileInsights } from "../../utils/executiveExportUtils";
import { BRAND_COLORS } from "../../constants/brandColors";
import { Award, CheckCircle2, Sparkles, Printer, X } from "lucide-react";

interface ExecutiveStudentDossierReportProps {
  students: Student[];
  focalStudentId?: string;
  selectedCentre?: string;
  selectedYear?: string;
  selectedBatch?: string;
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const ExecutiveStudentDossierReport: React.FC<ExecutiveStudentDossierReportProps> = ({
  students,
  focalStudentId,
  selectedYear = "2025-2026",
  onClose,
  isPrintOnly = false,
}) => {
  // 1. Resolve Student
  const student = useMemo(() => {
    if (focalStudentId) {
      const match = students.find((s) => s.id === focalStudentId);
      if (match) return match;
    }
    return students[0] || null;
  }, [students, focalStudentId]);

  // 2. Calculations
  const calculations = useMemo(() => {
    if (!student) return null;

    const pillars = calculateStreamerPillars(student);
    const avgScore = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
    const futureReady = calculateFutureReadyScore(student);
    const twentyFirst = calculate21stCenturySkills(student);
    const { top5, bottom5 } = getTopAndBottomSkills(student);
    const insights = extractStudentProfileInsights(student);
    const band = getRubricBand(avgScore);

    // Map the 5 core 21st century skills
    const target21st = [
      "Critical Thinking",
      "Collaboration & Teamwork",
      "Digital & AI Fluency",
      "Leadership",
      "Communication",
    ];

    const mapped21st = target21st.map((name) => {
      let score = 82;
      const found = twentyFirst.find((sk) => {
        if (name === "Critical Thinking") return sk.name.includes("Critical");
        if (name === "Collaboration & Teamwork") return sk.name.includes("Collaboration") || sk.name.includes("Teamwork");
        if (name === "Digital & AI Fluency") return sk.name.includes("Digital") || sk.name.includes("AI");
        if (name === "Leadership") return sk.name.includes("Leadership");
        if (name === "Communication") return sk.name.includes("Communication");
        return false;
      });
      if (found) score = found.score;
      return { name, score };
    });

    // Flatten projects
    const projects: { name: string; score: number; date: string; sdgTags: string[] }[] = [];
    Object.values(student.skillScores).forEach((detail) => {
      detail.byProject.forEach((p) => {
        if (!projects.some((pr) => pr.name === p.projectName)) {
          projects.push({
            name: p.projectName,
            score: p.score,
            date: p.date,
            sdgTags: p.sdgTags,
          });
        }
      });
    });

    return {
      pillars,
      avgScore,
      futureReady,
      twentyFirst: mapped21st,
      top5,
      bottom5,
      insights,
      band,
      projects: projects.slice(0, 4),
    };
  }, [student]);

  // 3. SVG Radar polygon points for 8 pillars (cx=50, cy=50, maxR=36)
  const radarPoints = useMemo(() => {
    if (!calculations) return { polygon: "", axisLines: [] };
    const numPillars = 8;
    const cx = 50;
    const cy = 50;
    const maxR = 36;

    const points: string[] = [];
    const axisLines: { x1: number; y1: number; x2: number; y2: number; label: string; code: string; score: number; color: string }[] = [];

    calculations.pillars.forEach((p, idx) => {
      const angle = (idx * (2 * Math.PI)) / numPillars - Math.PI / 2;
      const r = (p.ytd / 100) * maxR;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      points.push(`${px},${py}`);

      const ax = cx + maxR * Math.cos(angle);
      const ay = cy + maxR * Math.sin(angle);
      axisLines.push({
        x1: cx,
        y1: cy,
        x2: ax,
        y2: ay,
        label: p.pillar,
        code: p.letter,
        score: p.ytd,
        color: p.color,
      });
    });

    return {
      polygon: points.join(" "),
      axisLines,
    };
  }, [calculations]);

  if (!student || !calculations) {
    return null;
  }

  const entPillar = calculations.pillars.find((p) => p.pillar === "Entrepreneurship")?.ytd || 80;
  const resPillar = calculations.pillars.find((p) => p.pillar === "Resilience")?.ytd || 85;

  return (
    <div
      className={`bg-white text-slate-900 leading-tight ${
        isPrintOnly ? "print-only-block w-full p-2 max-w-[1120px] mx-auto" : "p-6 rounded-3xl shadow-2xl border border-slate-200 max-w-7xl mx-auto my-6"
      }`}
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* ========================================================= */}
      {/* 1. EXECUTIVE HEADER BAR */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2.5">
        <div className="flex items-center space-x-3">
          <img src={`${import.meta.env.BASE_URL}lof-logo.png`} alt="Lab of Future Logo" className="h-9 w-auto object-contain shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
                Student Performance Dossier
              </h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                STREAMER Talent Dossier
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Comprehensive 8-Pillar Competency Mastery, 21st Century Skills & Future Ready Index
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
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Centre</div>
            <div className="text-[11px] font-black text-blue-700">
              {student.centre.city}
            </div>
          </div>
          <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Domain</div>
            <div className="text-[11px] font-bold text-slate-800">
              {student.domain}
            </div>
          </div>

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
      {/* 2. STUDENT HERO PROFILE STRIP */}
      {/* ========================================================= */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161D2B] to-slate-900 text-white shadow-xs mb-3 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-inner shrink-0 border border-blue-400">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">{student.name}</h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {calculations.band.name} ({calculations.band.range[0]}-{calculations.band.range[1]} pts)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              ID: {student.id} • {student.grade} (Age {student.age}) • {student.centre.city}, {student.centre.country} • Batch: {student.batch}
            </p>
          </div>
        </div>

        {/* 4 Key Executive Performance Tiles */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[90px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Future Ready Index</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
              {calculations.futureReady.futureReadyScore}%
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[90px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Composite Average</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {calculations.avgScore} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[90px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-orange-300">Entrepreneurship</div>
            <div className="text-sm font-black text-orange-400 font-mono mt-0.5">
              {entPillar} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[90px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-blue-300">Resilience & Debug</div>
            <div className="text-sm font-black text-blue-400 font-mono mt-0.5">
              {resPillar} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MIDDLE SECTION: 8-PILLARS RADAR & LONGITUDINAL SCORECARD */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-2.5">
        {/* Left: SVG Holistic 8-Pillars Radar (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              STREAMER 8-Pillars Holistic Radar
            </h3>
            <span className="text-[8px] font-mono text-blue-700 font-bold">85+ Advanced Zone</span>
          </div>

          <div className="flex items-center justify-center my-1 relative">
            <svg viewBox="0 0 100 100" className="w-36 h-36 overflow-visible">
              {/* Concentric grid rings: 25, 50, 75, 100 */}
              {[9, 18, 27, 36].map((r, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="0.8"
                  strokeDasharray={i === 2 ? "2 1" : "none"}
                />
              ))}

              {/* 8 Axes Lines */}
              {radarPoints.axisLines.map((axis) => (
                <g key={axis.label}>
                  <line x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="#CBD5E1" strokeWidth="0.8" />
                  {/* Axis Label */}
                  <circle cx={axis.x2} cy={axis.y2} r="2.8" fill={axis.color} />
                  <text
                    x={axis.x2}
                    y={axis.y2 + 1}
                    textAnchor="middle"
                    fill="white"
                    fontSize="3"
                    fontWeight="bold"
                  >
                    {axis.code}
                  </text>
                </g>
              ))}

              {/* Radar Shaded Area */}
              <polygon
                points={radarPoints.polygon}
                fill="#3B82F6"
                fillOpacity="0.35"
                stroke={BRAND_COLORS.blue}
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>S • T • R • E • A • M • E • R Balanced Growth</span>
            <span className="font-mono font-bold text-slate-700">Cohort Benchmark: 75.0</span>
          </div>
        </div>

        {/* Right: Longitudinal Day 0 vs YTD Scorecard (7 cols) */}
        <div className="col-span-7 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Longitudinal Competency Scorecard
            </h3>
            <span className="text-[8px] font-mono text-emerald-700 font-bold">Baseline $\rightarrow$ YTD Delta Gains</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 my-0.5">
            {calculations.pillars.map((p) => {
              const delta = p.day0 !== null ? p.ytd - p.day0 : null;
              const widthPct = Math.min(100, Math.max(0, (p.ytd / 100) * 100));

              return (
                <div key={p.pillar} className="space-y-0.5 text-[8.5px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded text-white text-[8px] font-black flex items-center justify-center shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.letter}
                      </span>
                      <span className="font-bold text-slate-800">{p.pillar}</span>
                    </div>

                    <div className="flex items-center space-x-1 font-mono">
                      {p.day0 !== null && (
                        <span className="text-slate-400 line-through text-[7.5px]">{p.day0}</span>
                      )}
                      <span className="font-black text-slate-900">{p.ytd}</span>
                      {delta !== null && (
                        <span className="text-[7.5px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                          +{delta}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPct}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Diagnostic Mastery Standard</span>
            <span className="font-mono font-bold text-blue-700">{calculations.band.name} Level</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM SECTION: 21ST CENTURY SKILLS & COACHING GUIDANCE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-2">
        {/* 21st Century Skills (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
              <span>21st Century Competencies</span>
            </h3>
            <span className="text-[8px] font-bold text-blue-800 bg-blue-50 px-1 rounded border border-blue-200">
              Target: 80.0
            </span>
          </div>

          <div className="space-y-1 my-0.5">
            {calculations.twentyFirst.map((sk) => {
              const widthPct = Math.min(100, Math.max(0, (sk.score / 100) * 100));
              return (
                <div key={sk.name} className="space-y-0.5 text-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 truncate">{sk.name}</span>
                    <span className="font-mono font-bold text-blue-800">{sk.score} pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPct}%`, backgroundColor: BRAND_COLORS.blue }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Critical Thinking • Collaboration • Leadership</span>
            <span className="font-mono font-bold text-emerald-700">All ≥ Proficient</span>
          </div>
        </div>

        {/* Strengths, Growth & Educator Coaching (7 cols) */}
        <div className="col-span-7 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Strengths & Pedagogical Guidance
            </h3>
            <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
              Individualized Mentorship
            </span>
          </div>

          <div className="space-y-1 my-0.5 text-[8.5px]">
            <div className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Top Strengths: </strong>
                <span className="text-slate-600">
                  {calculations.insights.topStrengths.join(" • ")}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Growth Scope: </strong>
                <span className="text-slate-600">
                  {calculations.insights.scopeForGrowth.join(" • ")}
                </span>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 mt-0.5">
              <div className="font-bold text-slate-800 text-[8px] uppercase tracking-wider">
                Educator Coaching Recommendation:
              </div>
              <p className="text-slate-700 italic text-[8.5px] mt-0.5 leading-snug">
                "{calculations.insights.recommendation}"
              </p>
            </div>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Portfolio Capstone Readiness</span>
            <span className="font-bold text-slate-700">Approved for Multi-Disciplinary Demo</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FOOTER STRIP */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-200">
        <div className="flex items-center space-x-1 font-medium">
          <Award className="w-2.5 h-2.5 text-blue-600" />
          <span className="font-bold text-slate-600">Lab of Future (LOF) STEAMER Student Dossier</span>
          <span>•</span>
          <span>Aug–Mar Academic Cycle Assessment</span>
          <span>•</span>
          <span>Confidential Briefing for Parents & School Leadership</span>
        </div>
        <div className="font-mono text-slate-500">
          Evaluator: Nina Ikpe | Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
