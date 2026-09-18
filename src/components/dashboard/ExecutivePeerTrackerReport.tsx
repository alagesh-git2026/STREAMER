import React, { useMemo } from "react";
import type { Student } from "../../data/students";
import {
  calculateStreamerPillars,
  calculateFutureReadyScore,
  getRubricBand,
} from "../../utils/calculations";
import { extractStudentProfileInsights } from "../../utils/executiveExportUtils";
import { BRAND_COLORS } from "../../constants/brandColors";
import { ShieldCheck, Award, TrendingUp, CheckCircle2, Printer, X } from "lucide-react";

interface ExecutivePeerTrackerReportProps {
  students: Student[];
  focalStudentId?: string;
  selectedCentre: string;
  selectedYear: string;
  selectedBatch: string;
  comparisonScope?: "centre" | "all";
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const ExecutivePeerTrackerReport: React.FC<ExecutivePeerTrackerReportProps> = ({
  students,
  focalStudentId,
  selectedCentre,
  selectedYear,
  selectedBatch,
  comparisonScope = "centre",
  onClose,
  isPrintOnly = false,
}) => {
  // 1. Identify Focal Student
  const focalStudent = useMemo(() => {
    if (focalStudentId) {
      const match = students.find((s) => s.id === focalStudentId);
      if (match) return match;
    }
    return students[0] || null;
  }, [students, focalStudentId]);

  // 2. Focal Student Stats & Profile Insights
  const focalData = useMemo(() => {
    if (!focalStudent) return null;
    const pillars = calculateStreamerPillars(focalStudent);
    const avg = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
    const fr = calculateFutureReadyScore(focalStudent);
    const band = getRubricBand(avg);
    const insights = extractStudentProfileInsights(focalStudent);

    return {
      pillars,
      avg,
      futureReady: fr.futureReadyScore,
      band,
      insights,
    };
  }, [focalStudent]);

  // 3. Cohort Peer Group (Anonymous privacy-safe mapping)
  const peerGroup = useMemo(() => {
    if (!focalStudent) return [];
    const group =
      comparisonScope === "centre"
        ? students.filter((s) => s.centre.city === focalStudent.centre.city)
        : [...students];

    return group
      .map((s) => {
        const pillars = calculateStreamerPillars(s);
        const avg = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
        const fr = calculateFutureReadyScore(s);
        const isFocal = s.id === focalStudent.id;
        return {
          id: s.id,
          isFocal,
          realName: s.name,
          displayName: isFocal ? s.name : "",
          avg,
          futureReady: fr.futureReadyScore,
          pillars,
          band: getRubricBand(avg),
        };
      })
      .sort((a, b) => b.avg - a.avg)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        displayName: item.isFocal ? item.realName : `Student ${index + 1}`,
      }));
  }, [students, focalStudent, comparisonScope]);

  // 4. Ranked Chart Data: Focal Student ALWAYS first (irrespective of rank), followed by Student 1, Student 2...
  const rankedChartData = useMemo(() => {
    if (peerGroup.length === 0) return [];
    const focal = peerGroup.find((p) => p.isFocal);
    const others = peerGroup.filter((p) => !p.isFocal);
    const items = [];
    if (focal) {
      items.push({
        id: focal.id,
        name: `${focal.realName.split(" ")[0]} (You)`,
        score: focal.avg,
        rank: focal.rank,
        isFocal: true,
      });
    }
    others.forEach((p) => {
      items.push({
        id: p.id,
        name: `Student ${p.rank}`,
        score: p.avg,
        rank: p.rank,
        isFocal: false,
      });
    });
    return items;
  }, [peerGroup]);

  // 5. Benchmarks & Ranks
  const centreBenchmark = useMemo(() => {
    if (peerGroup.length === 0) return 0;
    const total = peerGroup.reduce((acc, p) => acc + p.avg, 0);
    return Number((total / peerGroup.length).toFixed(1));
  }, [peerGroup]);

  const focalRank = useMemo(() => {
    const found = peerGroup.find((p) => p.isFocal);
    return found ? found.rank : 1;
  }, [peerGroup]);

  const deltaFromMean = useMemo(() => {
    if (!focalData) return 0;
    return Number((focalData.avg - centreBenchmark).toFixed(1));
  }, [focalData, centreBenchmark]);

  // 5. Side-by-Side 8 STREAMER Pillars Benchmark
  const pillarComparisons = useMemo(() => {
    if (!focalData || peerGroup.length === 0) return [];

    return focalData.pillars.map((p) => {
      let groupSum = 0;
      peerGroup.forEach((peer) => {
        const match = peer.pillars.find((pp) => pp.pillar === p.pillar);
        if (match) groupSum += match.ytd;
      });
      const groupAvg = Number((groupSum / peerGroup.length).toFixed(1));
      const delta = Number((p.ytd - groupAvg).toFixed(1));

      return {
        pillar: p.pillar,
        code: p.letter,
        color: p.color,
        focalScore: p.ytd,
        groupAvg,
        delta,
      };
    });
  }, [focalData, peerGroup]);

  // 6. Cross-Centre Regional Benchmarks
  const regionalBenchmarks = useMemo(() => {
    const centres = ["Bengaluru", "New Delhi", "Dubai", "Austin", "Shanghai"];
    const map: Record<string, { sum: number; count: number }> = {};
    centres.forEach((c) => {
      map[c] = { sum: 0, count: 0 };
    });

    students.forEach((s) => {
      const city = s.centre.city;
      if (map[city]) {
        const pillars = calculateStreamerPillars(s);
        const avg = pillars.reduce((a, b) => a + b.ytd, 0) / pillars.length;
        map[city].sum += avg;
        map[city].count += 1;
      }
    });

    return centres.map((city) => {
      const item = map[city];
      const avg = item.count > 0 ? Number((item.sum / item.count).toFixed(1)) : 82.5;
      return { city, avg };
    });
  }, [students]);

  if (!focalStudent || !focalData) {
    return null;
  }

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
                Peer Comparison Analysis
              </h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Privacy-Safe Institutional Benchmark</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Anonymous In-Centre & Cross-Centre Peer Evaluation • Masked Classroom Classmates
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
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Focal Centre</div>
            <div className="text-[11px] font-black text-blue-700">
              {selectedCentre === "All" ? focalStudent.centre.city : selectedCentre}
            </div>
          </div>
          <div className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Batch / Scope</div>
            <div className="text-[11px] font-bold text-slate-800">
              {selectedBatch !== "All" ? selectedBatch : focalStudent.batch} ({comparisonScope === "centre" ? `In-Centre: ${peerGroup.length}` : `Global: ${students.length}`})
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
      {/* 2. FOCAL STUDENT HERO BENCHMARK STRIP */}
      {/* ========================================================= */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-[#121620] to-slate-900 text-white shadow-xs mb-3 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-inner shrink-0 border border-blue-400">
            {focalStudent.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">{focalStudent.name}</h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Focal Student
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {focalStudent.id} • {focalStudent.grade} • {focalStudent.centre.city}, {focalStudent.centre.country} • Domain: {focalStudent.domain}
            </p>
          </div>
        </div>

        {/* 4 Performance Metric Badges */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[85px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Rank in {focalStudent.centre.city}</div>
            <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
              #{focalRank} <span className="text-[9px] text-slate-400 font-normal">of {peerGroup.length}</span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[85px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Composite Average</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
              {focalData.avg} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[85px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Centre Mean</div>
            <div className="text-sm font-black text-slate-200 font-mono mt-0.5">
              {centreBenchmark} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[85px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Delta vs Peers</div>
            <div className={`text-sm font-black font-mono mt-0.5 ${deltaFromMean >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {deltaFromMean >= 0 ? `+${deltaFromMean}` : deltaFromMean} <span className="text-[9px] text-slate-400 font-normal">pts</span>
            </div>
          </div>

          <div className="bg-blue-600/30 px-3 py-1.5 rounded-xl border border-blue-400/30 text-center min-w-[95px]">
            <div className="text-[8px] font-bold uppercase tracking-wider text-blue-200">Future Ready Index</div>
            <div className="text-sm font-black text-white font-mono mt-0.5">
              {focalData.futureReady}%
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MIDDLE SECTION: ANONYMOUS PEER MATRIX & 8-PILLARS BENCHMARK */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-2.5">
        {/* Left: Privacy-Safe In-Centre Peer Rankings Custom Combo Chart (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span>Peer Rankings & Score Distribution</span>
            </h3>
            <div className="flex items-center space-x-2 text-[8px] font-bold">
              <span className="flex items-center space-x-1 text-blue-700">
                <span className="w-2 h-2 rounded-xs bg-blue-600" />
                <span>Score</span>
              </span>
              <span className="flex items-center space-x-1 text-[#E04627]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E04627]" />
                <span>Rank</span>
              </span>
            </div>
          </div>

          {/* SVG Vector Combo Chart (Bar: Score, Line: Rank) */}
          <div className="w-full my-1 bg-slate-50/70 p-2 rounded-lg border border-slate-200">
            <svg viewBox="0 0 320 120" className="w-full h-28 overflow-visible">
              {/* Baseline Grid lines */}
              <line x1="30" y1="20" x2="310" y2="20" stroke="#E2E8F0" strokeDasharray="2 2" />
              <text x="24" y="23" textAnchor="end" fontSize="7" fill="#94A3B8" fontFamily="monospace">100</text>
              <line x1="30" y1="55" x2="310" y2="55" stroke="#E2E8F0" strokeDasharray="2 2" />
              <text x="24" y="58" textAnchor="end" fontSize="7" fill="#94A3B8" fontFamily="monospace">75</text>
              <line x1="30" y1="90" x2="310" y2="90" stroke="#CBD5E1" strokeWidth="1" />
              <text x="24" y="93" textAnchor="end" fontSize="7" fill="#94A3B8" fontFamily="monospace">50</text>

              {/* Bars & Rank Line Points */}
              {(() => {
                const total = rankedChartData.length;
                if (total === 0) return null;
                const slotWidth = (310 - 40) / total;
                const points: { x: number; y: number; rank: number }[] = [];

                const barElements = rankedChartData.map((item, idx) => {
                  const cx = 40 + idx * slotWidth + slotWidth / 2;
                  // Score mapping (50 - 100 pts -> 90 to 20 Y)
                  const clampedScore = Math.max(50, Math.min(100, item.score));
                  const barHeight = ((clampedScore - 50) / 50) * 70;
                  const barY = 90 - barHeight;
                  const barWidth = Math.min(28, slotWidth * 0.65);
                  const barX = cx - barWidth / 2;

                  // Rank mapping (1 to total -> 25 to 80 Y)
                  const rankRatio = total > 1 ? (item.rank - 1) / (total - 1) : 0;
                  const rankY = 25 + rankRatio * 55;
                  points.push({ x: cx, y: rankY, rank: item.rank });

                  return (
                    <g key={item.id}>
                      {/* Bar */}
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        rx="3"
                        fill={item.isFocal ? "#1D4F9C" : "#94A3B8"}
                        opacity={item.isFocal ? 1 : 0.75}
                      />
                      {/* Score on bar */}
                      <text
                        x={cx}
                        y={barY - 3}
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={item.isFocal ? "#1D4F9C" : "#475569"}
                      >
                        {item.score}
                      </text>
                      {/* Name below axis */}
                      <text
                        x={cx}
                        y="102"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight={item.isFocal ? "bold" : "normal"}
                        fill={item.isFocal ? "#0F172A" : "#64748B"}
                      >
                        {item.name}
                      </text>
                    </g>
                  );
                });

                // Line connecting rank points
                const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                const lineElements = (
                  <g key="rank-line">
                    <path d={pathD} fill="none" stroke="#E04627" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (
                      <g key={`pt-${i}`}>
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#E04627" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#E04627" fontFamily="monospace">
                          #{p.rank}
                        </text>
                      </g>
                    ))}
                  </g>
                );

                return (
                  <>
                    {barElements}
                    {lineElements}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>
              {focalStudent.name}: <strong className="text-blue-700">Rank #{focalRank}</strong> of {peerGroup.length}
            </span>
            <span className="font-mono font-bold text-slate-700">Centre Mean: {centreBenchmark} pts</span>
          </div>
        </div>

        {/* Right: Side-by-Side 8 STREAMER Pillars Benchmark (7 cols) */}
        <div className="col-span-7 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <span>Side-by-Side 8-Pillars Benchmark</span>
            </h3>
            <div className="flex items-center space-x-3 text-[8px] font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>{focalStudent.name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Centre Mean ({centreBenchmark})</span>
              </span>
            </div>
          </div>

          {/* Comparative Horizontal Bars */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 my-1">
            {pillarComparisons.map((p) => {
              const focalWidth = Math.min(100, Math.max(0, (p.focalScore / 100) * 100));
              const groupWidth = Math.min(100, Math.max(0, (p.groupAvg / 100) * 100));
              return (
                <div key={p.pillar} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="font-bold text-slate-700 truncate">{p.pillar}</span>
                    <div className="flex items-center space-x-1 font-mono">
                      <span className="font-black text-blue-700">{p.focalScore}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">{p.groupAvg}</span>
                      <span
                        className={`text-[7px] font-black px-1 rounded ${
                          p.delta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.delta >= 0 ? `+${p.delta}` : p.delta}
                      </span>
                    </div>
                  </div>
                  {/* Two comparative bars */}
                  <div className="space-y-0.5">
                    {/* Focal Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${focalWidth}%` }} />
                    </div>
                    {/* Peer Mean Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-slate-400" style={{ width: `${groupWidth}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Standard Benchmark Target: 75.0 pts</span>
            <span className="font-mono font-bold text-blue-700">
              {pillarComparisons.filter((p) => p.focalScore >= p.groupAvg).length} of 8 Pillars Exceeding Peer Mean
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM SECTION: REGIONAL BENCHMARKS & STRATEGIC GUIDANCE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-12 gap-2.5 mb-2">
        {/* Regional Benchmarks (5 cols) */}
        <div className="col-span-5 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Cross-Centre Regional Benchmarks
            </h3>
            <span className="text-[8px] font-mono font-bold text-blue-700">Global Average: {centreBenchmark}</span>
          </div>

          <div className="space-y-1 my-0.5">
            {regionalBenchmarks.map((c) => {
              const widthPct = Math.min(100, Math.max(0, (c.avg / 100) * 100));
              const isSelected = c.city === focalStudent.centre.city;
              return (
                <div key={c.city} className="flex items-center space-x-2 text-[8px]">
                  <span className={`w-16 truncate ${isSelected ? "font-black text-blue-800" : "font-medium text-slate-600"}`}>
                    {c.city}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: isSelected ? BRAND_COLORS.blue : "#94A3B8",
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-8 text-right">{c.avg}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Cross-Centre Comparative Standing</span>
            <span className="font-mono font-bold text-blue-700">{focalStudent.centre.city} Centre Top Tier</span>
          </div>
        </div>

        {/* Focal Student Educational Guidance & Action Plan (7 cols) */}
        <div className="col-span-7 p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              Pedagogical Profile & Growth Action Plan
            </h3>
            <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
              Individualized Mentorship
            </span>
          </div>

          <div className="space-y-1 my-0.5 text-[8.5px]">
            {/* Top Strengths */}
            <div className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Top Strengths: </strong>
                <span className="text-slate-600">
                  {focalData.insights.topStrengths.join(" • ")}
                </span>
              </div>
            </div>

            {/* Scope for Growth */}
            <div className="flex items-start space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Growth Scope: </strong>
                <span className="text-slate-600">
                  {focalData.insights.scopeForGrowth.join(" • ")}
                </span>
              </div>
            </div>

            {/* Educator Guidance */}
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 mt-1">
              <div className="font-bold text-slate-800 text-[8px] uppercase tracking-wider">
                Educator Coaching Guidance:
              </div>
              <p className="text-slate-700 italic text-[8.5px] mt-0.5 leading-snug">
                "{focalData.insights.recommendation}"
              </p>
            </div>
          </div>

          <div className="text-[8px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Evaluator Action Priority</span>
            <span className="font-bold text-slate-700">Ready for Advanced Capstone Pitch</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FOOTER STRIP */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1.5 border-t border-slate-200">
        <div className="flex items-center space-x-1 font-medium">
          <Award className="w-2.5 h-2.5 text-blue-600" />
          <span className="font-bold text-slate-600">Lab of Future (LOF) Institutional Peer Evaluation</span>
          <span>•</span>
          <span>Aug–Mar Academic Cycle Assessment</span>
          <span>•</span>
          <span>Confidential Briefing for Parents & School Leadership</span>
        </div>
        <div className="font-mono text-slate-500">
          Generated on {new Date().toLocaleDateString()} | LOF-PEER-EVAL-FERPA
        </div>
      </div>
    </div>
  );
};
