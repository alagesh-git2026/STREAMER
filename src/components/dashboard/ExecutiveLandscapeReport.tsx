import React from "react";
import type { Student } from "../../data/students";
import { calculateStreamerPillars, calculate21stCenturySkills } from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";
import { Award, CheckCircle2, Sparkles, Printer, X } from "lucide-react";

interface ExecutiveLandscapeReportProps {
  students: Student[];
  selectedCentre: string;
  selectedYear: string;
  selectedBatch: string;
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const ExecutiveLandscapeReport: React.FC<ExecutiveLandscapeReportProps> = ({
  students,
  selectedCentre,
  selectedYear,
  selectedBatch,
  onClose,
  isPrintOnly = false,
}) => {
  // -------------------------------------------------------------
  // 1. COMPUTE SPEEDOMETER & GAUGE METRICS
  // -------------------------------------------------------------
  const metrics = React.useMemo(() => {
    if (students.length === 0) {
      return {
        avgScore: 0,
        entrepreneurshipPct: 0,
        entrepreneurshipCount: 0,
        resiliencePct: 0,
        resilienceCount: 0,
        passRate: 0,
        proficientCount: 0,
        masteryRate: 0,
        masteryCount: 0,
        totalPillars: 0,
        rubricCounts: { advanced: 0, proficient: 0, developing: 0, emerging: 0 },
      };
    }

    let totalScoreSum = 0;
    let totalPillarsCount = 0;
    let entrepreneurshipHighCount = 0;
    let resilienceHighCount = 0;
    let proficientStudentsCount = 0;
    let masteryStudentsCount = 0;

    const rubricCounts = { advanced: 0, proficient: 0, developing: 0, emerging: 0 };

    students.forEach((student) => {
      const pillars = calculateStreamerPillars(student);
      const studentAvg = pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length;
      totalScoreSum += studentAvg;
      totalPillarsCount += 1;

      if (studentAvg >= 65) proficientStudentsCount += 1;
      if (studentAvg >= 85) masteryStudentsCount += 1;

      pillars.forEach((p) => {
        if (p.ytd >= 85) rubricCounts.advanced += 1;
        else if (p.ytd >= 65) rubricCounts.proficient += 1;
        else if (p.ytd >= 40) rubricCounts.developing += 1;
        else rubricCounts.emerging += 1;
      });

      const ent = pillars.find((p) => p.pillar === "Entrepreneurship");
      if (ent && ent.ytd >= 80) entrepreneurshipHighCount += 1;

      const res = pillars.find((p) => p.pillar === "Resilience");
      if (res && res.ytd >= 80) resilienceHighCount += 1;
    });

    const avgScore = totalScoreSum / totalPillarsCount;
    const entrepreneurshipPct = (entrepreneurshipHighCount / students.length) * 100;
    const resiliencePct = (resilienceHighCount / students.length) * 100;
    const passRate = (proficientStudentsCount / students.length) * 100;
    const masteryRate = (masteryStudentsCount / students.length) * 100;

    return {
      avgScore: Number(avgScore.toFixed(2)),
      entrepreneurshipPct: Number(entrepreneurshipPct.toFixed(1)),
      entrepreneurshipCount: entrepreneurshipHighCount,
      resiliencePct: Number(resiliencePct.toFixed(1)),
      resilienceCount: resilienceHighCount,
      passRate: Number(passRate.toFixed(1)),
      proficientCount: proficientStudentsCount,
      masteryRate: Number(masteryRate.toFixed(1)),
      masteryCount: masteryStudentsCount,
      totalPillars: students.length * 8,
      rubricCounts,
    };
  }, [students]);

  // Speedometer 1: Overall Average Score Needle (0-100 pts)
  const avgAngle = Math.min(180, Math.max(0, (metrics.avgScore / 100) * 180));
  const avgNeedleRad = ((180 - avgAngle) * Math.PI) / 180;
  const avgNeedleX = 50 + 31 * Math.cos(avgNeedleRad);
  const avgNeedleY = 50 - 31 * Math.sin(avgNeedleRad);

  // Speedometer 2: Entrepreneurship Needle (0-100%)
  const entAngle = Math.min(180, Math.max(0, (metrics.entrepreneurshipPct / 100) * 180));
  const entNeedleRad = ((180 - entAngle) * Math.PI) / 180;
  const entNeedleX = 50 + 31 * Math.cos(entNeedleRad);
  const entNeedleY = 50 - 31 * Math.sin(entNeedleRad);

  // Speedometer 3: Resilience Needle (0-100%)
  const resAngle = Math.min(180, Math.max(0, (metrics.resiliencePct / 100) * 180));
  const resNeedleRad = ((180 - resAngle) * Math.PI) / 180;
  const resNeedleX = 50 + 31 * Math.cos(resNeedleRad);
  const resNeedleY = 50 - 31 * Math.sin(resNeedleRad);

  // Gauge 4: Pass Rate Arc
  const gaugeCircumference = Math.PI * 34; // approx 106.8
  const gaugeOffset = gaugeCircumference - (metrics.passRate / 100) * gaugeCircumference;

  // -------------------------------------------------------------
  // 2. COMPUTE 21ST CENTURY SKILLS
  // -------------------------------------------------------------
  const centurySkills = React.useMemo(() => {
    const targetSkills = [
      "Critical Thinking",
      "Collaboration & Teamwork",
      "Digital & AI Fluency",
      "Leadership",
      "Communication",
    ];

    if (students.length === 0) {
      return targetSkills.map((name) => ({ name, score: 80 }));
    }

    const sums: Record<string, { sum: number; count: number }> = {};
    targetSkills.forEach((s) => {
      sums[s] = { sum: 0, count: 0 };
    });

    students.forEach((student) => {
      const skills = calculate21stCenturySkills(student);
      skills.forEach((sk) => {
        let matched = "";
        if (sk.name === "Critical Thinking" || sk.name.includes("Critical")) matched = "Critical Thinking";
        else if (sk.name === "Collaboration" || sk.name.includes("Collaboration") || sk.name.includes("Teamwork")) matched = "Collaboration & Teamwork";
        else if (sk.name === "Digital Literacy" || sk.name.includes("Digital") || sk.name.includes("AI")) matched = "Digital & AI Fluency";
        else if (sk.name === "Leadership" || sk.name.includes("Leadership")) matched = "Leadership";
        else if (sk.name === "Communication" || sk.name.includes("Communication")) matched = "Communication";

        if (matched && sums[matched]) {
          sums[matched].sum += sk.score;
          sums[matched].count += 1;
        }
      });
    });

    return targetSkills.map((name) => {
      const entry = sums[name];
      const avg = entry.count > 0 ? Number((entry.sum / entry.count).toFixed(1)) : 82.0;
      return { name, score: avg };
    });
  }, [students]);

  // -------------------------------------------------------------
  // 3. COMPUTE 8 STREAMER PILLARS COHORT AVERAGES
  // -------------------------------------------------------------
  const pillarAverages = React.useMemo(() => {
    const pillarsDef = [
      { name: "Science", code: "S", color: "#2255A4" },
      { name: "Technology", code: "T", color: "#0E7C6F" },
      { name: "Research", code: "R", color: "#B65529" },
      { name: "Engineering", code: "E", color: "#5A3FA0" },
      { name: "Arts", code: "A", color: "#C23768" },
      { name: "Mathematics", code: "M", color: "#41722E" },
      { name: "Entrepreneurship", code: "E", color: BRAND_COLORS.orangeRed },
      { name: "Resilience", code: "R", color: BRAND_COLORS.blue },
    ];

    if (students.length === 0) {
      return pillarsDef.map((p) => ({ ...p, avg: 0 }));
    }

    return pillarsDef.map((pDef) => {
      let sum = 0;
      students.forEach((student) => {
        const studentPillars = calculateStreamerPillars(student);
        const match = studentPillars.find((p) => p.pillar === pDef.name);
        if (match) sum += match.ytd;
      });
      return {
        ...pDef,
        avg: Number((sum / students.length).toFixed(1)),
      };
    });
  }, [students]);

  // -------------------------------------------------------------
  // 4. COMPUTE RUBRIC DONUT SEGMENTS
  // -------------------------------------------------------------
  const donutData = React.useMemo(() => {
    const total = metrics.rubricCounts.advanced + metrics.rubricCounts.proficient + metrics.rubricCounts.developing + metrics.rubricCounts.emerging;
    const advPct = total > 0 ? (metrics.rubricCounts.advanced / total) * 100 : 0;
    const proPct = total > 0 ? (metrics.rubricCounts.proficient / total) * 100 : 0;
    const devPct = total > 0 ? (metrics.rubricCounts.developing / total) * 100 : 0;
    const emgPct = total > 0 ? (metrics.rubricCounts.emerging / total) * 100 : 0;

    const circumference = 2 * Math.PI * 35; // approx 219.91
    const advDash = (advPct / 100) * circumference;
    const proDash = (proPct / 100) * circumference;
    const devDash = (devPct / 100) * circumference;
    const emgDash = (emgPct / 100) * circumference;

    return {
      total,
      advPct: Number(advPct.toFixed(1)),
      proPct: Number(proPct.toFixed(1)),
      devPct: Number(devPct.toFixed(1)),
      emgPct: Number(emgPct.toFixed(1)),
      circumference,
      advDash,
      proDash,
      devDash,
      emgDash,
    };
  }, [metrics]);

  // -------------------------------------------------------------
  // 5. REGIONAL CENTRE BENCHMARKS
  // -------------------------------------------------------------
  const centreBenchmarks = React.useMemo(() => {
    const centres = ["Bengaluru", "New Delhi", "Dubai", "Austin", "Shanghai"];
    const map: Record<string, { sum: number; count: number }> = {};
    centres.forEach((c) => {
      map[c] = { sum: 0, count: 0 };
    });

    students.forEach((student) => {
      const city = student.centre.city;
      if (map[city]) {
        const pillars = calculateStreamerPillars(student);
        const avg = pillars.reduce((a, b) => a + b.ytd, 0) / pillars.length;
        map[city].sum += avg;
        map[city].count += 1;
      }
    });

    return centres.map((name) => {
      const item = map[name];
      const avg = item.count > 0 ? Number((item.sum / item.count).toFixed(1)) : 82.5;
      return { name, avg };
    });
  }, [students]);

  // Milestone Progression (Q1-Capstone)
  const milestoneData = [
    { label: "Q1", stage: "Diagnostic", score: 78.4 },
    { label: "Q2", stage: "Prototype", score: 81.2 },
    { label: "Q3", stage: "System", score: 84.6 },
    { label: "Q4", stage: "Refinement", score: 87.9 },
    { label: "Capstone", stage: "Pitch & Demo", score: 90.5 },
  ];

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
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5 mb-3">
        <div className="flex items-center space-x-3">
          <img src="/lof-logo.png" alt="Lab of Future Logo" className="h-9 w-auto object-contain shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
                Education Performance Analysis
              </h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Executive Dashboard
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              STREAMER Competency Framework • 21st Century Skills • Institutional Benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
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
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Batch / Cohort</div>
            <div className="text-[11px] font-bold text-slate-800">
              {selectedBatch} ({students.length} Students)
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
      {/* 2. ROW 1: THE 4 SPEEDOMETERS & GAUGE KPI TILES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {/* Card 1: Speedometer of Overall Average Score */}
        <div className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Overall Average Score
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
              STREAMER
            </span>
          </div>

          <div className="flex flex-col items-center justify-center relative my-0.5">
            <svg viewBox="0 0 100 58" className="w-32 h-18 overflow-visible">
              <defs>
                <linearGradient id="printSpeedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={BRAND_COLORS.orangeRed} />
                  <stop offset="50%" stopColor={BRAND_COLORS.darkGrey} />
                  <stop offset="100%" stopColor={BRAND_COLORS.blue} />
                </linearGradient>
              </defs>
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="#E2E8F0" strokeWidth="7" strokeLinecap="round" />
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="url(#printSpeedometerGrad)" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
              {/* Target 75.0 line (45 deg) */}
              <line
                x1={50 + 31 * Math.cos((45 * Math.PI) / 180)}
                y1={50 - 31 * Math.sin((45 * Math.PI) / 180)}
                x2={50 + 40 * Math.cos((45 * Math.PI) / 180)}
                y2={50 - 40 * Math.sin((45 * Math.PI) / 180)}
                stroke="#0F172A"
                strokeWidth="2"
              />
              {/* Needle */}
              <line x1="50" y1="50" x2={avgNeedleX} y2={avgNeedleY} stroke={BRAND_COLORS.darkGrey} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="4" fill="#0F172A" />
              <circle cx="50" cy="50" r="1.8" fill="white" />
            </svg>
            <div className="-mt-2.5 text-center">
              <span className="text-xl font-display font-black text-slate-900 tracking-tight font-mono">{metrics.avgScore}</span>
              <span className="text-[10px] text-slate-400 font-bold ml-1 font-mono">/ 100</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100">
            <span className="font-mono">0 pts</span>
            <span className="font-bold text-slate-800">Target: 75.0</span>
            <span className="font-mono">100 pts</span>
          </div>
        </div>

        {/* Card 2: Speedometer of Entrepreneurship (≥80%) */}
        <div className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Entrepreneurship
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#E04627] font-mono">
              ≥80% Pitch
            </span>
          </div>

          <div className="flex flex-col items-center justify-center relative my-0.5">
            <svg viewBox="0 0 100 58" className="w-32 h-18 overflow-visible">
              <defs>
                <linearGradient id="printEntSpeedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="60%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor={BRAND_COLORS.orangeRed} />
                </linearGradient>
              </defs>
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="#E2E8F0" strokeWidth="7" strokeLinecap="round" />
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="url(#printEntSpeedometerGrad)" strokeWidth="7" strokeLinecap="round" opacity="0.95" />
              {/* Target 70.0% line (54 deg) */}
              <line
                x1={50 + 31 * Math.cos((54 * Math.PI) / 180)}
                y1={50 - 31 * Math.sin((54 * Math.PI) / 180)}
                x2={50 + 40 * Math.cos((54 * Math.PI) / 180)}
                y2={50 - 40 * Math.sin((54 * Math.PI) / 180)}
                stroke={BRAND_COLORS.orangeRed}
                strokeWidth="2.5"
              />
              {/* Needle */}
              <line x1="50" y1="50" x2={entNeedleX} y2={entNeedleY} stroke={BRAND_COLORS.orangeRed} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="4" fill={BRAND_COLORS.orangeRed} />
              <circle cx="50" cy="50" r="1.8" fill="white" />
            </svg>
            <div className="-mt-2.5 text-center">
              <span className="text-xl font-display font-black tracking-tight font-mono" style={{ color: BRAND_COLORS.orangeRed }}>
                {metrics.entrepreneurshipPct}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 font-mono ml-1">
                ({metrics.entrepreneurshipCount}/{students.length})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100">
            <span className="font-mono">0%</span>
            <span className="font-bold text-slate-800">Target: 70.0%</span>
            <span className="font-mono">100%</span>
          </div>
        </div>

        {/* Card 3: Speedometer of Resilience (≥80%) */}
        <div className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Resilience & Debug
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#1D4F9C] font-mono">
              ≥80% Grit
            </span>
          </div>

          <div className="flex flex-col items-center justify-center relative my-0.5">
            <svg viewBox="0 0 100 58" className="w-32 h-18 overflow-visible">
              <defs>
                <linearGradient id="printResSpeedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="60%" stopColor={BRAND_COLORS.electricBlue} />
                  <stop offset="100%" stopColor={BRAND_COLORS.blue} />
                </linearGradient>
              </defs>
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="#E2E8F0" strokeWidth="7" strokeLinecap="round" />
              <path d="M 14 50 A 36 36 0 0 1 86 50" fill="none" stroke="url(#printResSpeedometerGrad)" strokeWidth="7" strokeLinecap="round" opacity="0.95" />
              {/* Target 75.0% line (45 deg) */}
              <line
                x1={50 + 31 * Math.cos((45 * Math.PI) / 180)}
                y1={50 - 31 * Math.sin((45 * Math.PI) / 180)}
                x2={50 + 40 * Math.cos((45 * Math.PI) / 180)}
                y2={50 - 40 * Math.sin((45 * Math.PI) / 180)}
                stroke={BRAND_COLORS.blue}
                strokeWidth="2.5"
              />
              {/* Needle */}
              <line x1="50" y1="50" x2={resNeedleX} y2={resNeedleY} stroke={BRAND_COLORS.blue} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="4" fill={BRAND_COLORS.blue} />
              <circle cx="50" cy="50" r="1.8" fill="white" />
            </svg>
            <div className="-mt-2.5 text-center">
              <span className="text-xl font-display font-black tracking-tight font-mono" style={{ color: BRAND_COLORS.blue }}>
                {metrics.resiliencePct}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 font-mono ml-1">
                ({metrics.resilienceCount}/{students.length})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100">
            <span className="font-mono">0%</span>
            <span className="font-bold text-slate-800">Target: 75.0%</span>
            <span className="font-mono">100%</span>
          </div>
        </div>

        {/* Card 4: Pass Rate Gauge Chart */}
        <div className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Pass Rate (Proficient)
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-mono">
              ≥65 pts
            </span>
          </div>

          <div className="flex flex-col items-center justify-center relative my-0.5">
            <svg viewBox="0 0 100 58" className="w-32 h-18 overflow-visible">
              <path d="M 16 50 A 34 34 0 0 1 84 50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
              <path
                d="M 16 50 A 34 34 0 0 1 84 50"
                fill="none"
                stroke={BRAND_COLORS.blue}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeOffset}
              />
              {/* Target 85.0% line (27 deg) */}
              <line
                x1={50 + 29 * Math.cos((27 * Math.PI) / 180)}
                y1={50 - 29 * Math.sin((27 * Math.PI) / 180)}
                x2={50 + 38 * Math.cos((27 * Math.PI) / 180)}
                y2={50 - 38 * Math.sin((27 * Math.PI) / 180)}
                stroke={BRAND_COLORS.orangeRed}
                strokeWidth="2.5"
              />
            </svg>
            <div className="-mt-3 text-center">
              <span className="text-xl font-display font-black text-slate-900 tracking-tight font-mono">{metrics.passRate}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100">
            <span className="font-mono">Standard: ≥65 pts</span>
            <span className="font-bold text-slate-800">Target: 85.0%</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ROW 2: CORE ANALYTICS VISUALIZATIONS (DONUT, 21ST CENTURY, TREND) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-3">
        {/* 1. Rubric Band Grade Distribution Donut (3.5 cols) */}
        <div className="col-span-4 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Rubric Grade Distribution
            </h3>
            <span className="text-[8px] font-mono text-slate-400 font-bold">{metrics.totalPillars} Assessments</span>
          </div>

          <div className="flex items-center justify-around my-1">
            {/* SVG Donut Visual */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {/* Advanced */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={BRAND_COLORS.blue}
                  strokeWidth="12"
                  strokeDasharray={`${donutData.advDash} ${donutData.circumference}`}
                  strokeDashoffset="0"
                />
                {/* Proficient */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={BRAND_COLORS.electricBlue}
                  strokeWidth="12"
                  strokeDasharray={`${donutData.proDash} ${donutData.circumference}`}
                  strokeDashoffset={-donutData.advDash}
                />
                {/* Developing */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={BRAND_COLORS.orangeRed}
                  strokeWidth="12"
                  strokeDasharray={`${donutData.devDash} ${donutData.circumference}`}
                  strokeDashoffset={-(donutData.advDash + donutData.proDash)}
                />
                {/* Emerging */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={BRAND_COLORS.darkGrey}
                  strokeWidth="12"
                  strokeDasharray={`${donutData.emgDash} ${donutData.circumference}`}
                  strokeDashoffset={-(donutData.advDash + donutData.proDash + donutData.devDash)}
                />
              </svg>
              {/* Donut Center text */}
              <div className="absolute text-center">
                <div className="text-xs font-black text-slate-900 font-mono">{metrics.totalPillars}</div>
                <div className="text-[7px] font-bold uppercase text-slate-400">Total</div>
              </div>
            </div>

            {/* Compact Legend */}
            <div className="space-y-1 text-[9px] min-w-[125px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.blue }} />
                  <span>Adv (85-100)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{donutData.advPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.electricBlue }} />
                  <span>Prof (65-84)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{donutData.proPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.orangeRed }} />
                  <span>Dev (40-64)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{donutData.devPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.darkGrey }} />
                  <span>Emg (0-39)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{donutData.emgPct}%</span>
              </div>
            </div>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Overall Proficient+ Band</span>
            <span className="font-mono font-bold text-emerald-700">{(donutData.advPct + donutData.proPct).toFixed(1)}%</span>
          </div>
        </div>

        {/* 2. 21st Century Skills Ranked Bar Chart (4 cols) */}
        <div className="col-span-4 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
              <span>21st Century Skills</span>
              <Sparkles className="w-2.5 h-2.5 text-blue-500" />
            </h3>
            <span className="text-[8px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
              Target: 80.0 pts
            </span>
          </div>

          <div className="space-y-1.5 my-1">
            {centurySkills.map((sk) => {
              const widthPct = Math.min(100, Math.max(0, (sk.score / 100) * 100));
              return (
                <div key={sk.name} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-semibold text-slate-700 truncate max-w-[130px]">{sk.name}</span>
                    <span className="font-mono font-black text-blue-800">{sk.score} pts</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%`, backgroundColor: BRAND_COLORS.blue }}
                    />
                    {/* Benchmark line at 80% */}
                    <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-amber-500 z-10 opacity-75" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>5 Core Interdisciplinary Capabilities</span>
            <span className="font-mono font-bold text-blue-700">All ≥ Proficient</span>
          </div>
        </div>

        {/* 3. Academic Milestone Performance Trend (4.5 cols) */}
        <div className="col-span-4 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Academic Milestone Trend
            </h3>
            <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
              Aug–Mar Progression
            </span>
          </div>

          {/* SVG Milestone Bar Chart */}
          <div className="my-1">
            <svg viewBox="0 0 200 65" className="w-full h-18 overflow-visible">
              {/* Target 75 line */}
              <line x1="10" y1="20" x2="190" y2="20" stroke="#CBD5E1" strokeDasharray="3 2" strokeWidth="1" />
              <text x="192" y="21" fill="#94A3B8" fontSize="6" fontFamily="monospace">75</text>

              {milestoneData.map((m, idx) => {
                const x = 20 + idx * 36;
                const barHeight = ((m.score - 50) / 50) * 40;
                const y = 50 - barHeight;
                return (
                  <g key={m.label}>
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width="16"
                      height={barHeight}
                      rx="3"
                      fill={idx === 4 ? BRAND_COLORS.blue : BRAND_COLORS.electricBlue}
                      opacity="0.9"
                    />
                    {/* Score value */}
                    <text x={x + 8} y={y - 2.5} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#0F172A" fontFamily="monospace">
                      {m.score}
                    </text>
                    {/* Label */}
                    <text x={x + 8} y="58" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#475569">
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span className="italic">Q1 Diagnostic $\rightarrow$ Capstone Pitch</span>
            <span className="font-mono font-bold text-emerald-700">+12.1 pts Net Growth</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. ROW 3: 8 STREAMER PILLARS & REGIONAL BENCHMARKS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-2.5">
        {/* Left: 8 STREAMER Pillars Performance Breakdown (7 cols) */}
        <div className="col-span-7 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <span>STREAMER 8-Pillars Mastery Profile</span>
            </h3>
            <div className="flex items-center space-x-2 text-[8px] font-mono">
              <span className="text-slate-500">Benchmark:</span>
              <span className="font-bold text-blue-700">75.0 pts</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {pillarAverages.map((p) => {
              const widthPct = Math.min(100, Math.max(0, (p.avg / 100) * 100));
              return (
                <div key={p.name} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded text-white text-[9px] font-black flex items-center justify-center shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[8px] mb-0.5">
                      <span className="font-bold text-slate-700 truncate">{p.name}</span>
                      <span className="font-mono font-black text-slate-900">{p.avg}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full" style={{ width: `${widthPct}%`, backgroundColor: p.color }} />
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-400 opacity-60" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 mt-1 flex items-center justify-between">
            <span>Science • Technology • Research • Engineering • Arts • Mathematics • Entrepreneurship • Resilience</span>
            <span className="font-mono font-bold text-slate-700">8 Mastery Dimensions</span>
          </div>
        </div>

        {/* Right: Regional Centre Comparison & Executive Takeaways (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Regional Centre Benchmarks
            </h3>
            <span className="text-[8px] font-mono font-bold text-blue-700">Global Avg: {metrics.avgScore}</span>
          </div>

          <div className="space-y-1 my-0.5">
            {centreBenchmarks.map((c) => {
              const widthPct = Math.min(100, Math.max(0, (c.avg / 100) * 100));
              return (
                <div key={c.name} className="flex items-center space-x-2 text-[8px]">
                  <span className="w-16 truncate font-semibold text-slate-600">{c.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: c.name === selectedCentre ? BRAND_COLORS.orangeRed : BRAND_COLORS.blue,
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-8 text-right">{c.avg}</span>
                </div>
              );
            })}
          </div>

          {/* Executive Educational Takeaways for Parents & Schools */}
          <div className="mt-1 pt-1 border-t border-slate-100 space-y-0.5 text-[8px]">
            <div className="font-bold uppercase text-slate-800 tracking-wider">Key Executive Takeaways:</div>
            <div className="flex items-start space-x-1 text-slate-600">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pitch & Decision Autonomy:</strong> 80% achieved high-impact pitch confidence.</span>
            </div>
            <div className="flex items-start space-x-1 text-slate-600">
              <CheckCircle2 className="w-2.5 h-2.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Diagnostic Grit:</strong> 93.3% mastered systematic hardware troubleshooting.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FOOTER STRIP */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-200">
        <div className="flex items-center space-x-1 font-medium">
          <Award className="w-2.5 h-2.5 text-blue-600" />
          <span className="font-bold text-slate-600">Lab of Future (LOF) STEAMER Talent Intelligence System</span>
          <span>•</span>
          <span>Aug–Mar Academic Cycle Assessment</span>
          <span>•</span>
          <span>Confidential Briefing for Parents & School Leadership</span>
        </div>
        <div className="font-mono text-slate-500">
          Generated on {new Date().toLocaleDateString()} | LOF-EVAL-CERTIFIED
        </div>
      </div>
    </div>
  );
};
