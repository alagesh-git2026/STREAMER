import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Users,
  Building2,
  ShieldCheck,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import type { Student } from "../../data/students";
import {
  calculateStreamerPillars,
  calculateFutureReadyScore,
  getRubricBand
} from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";

interface AnonymousPeerComparisonProps {
  students: Student[];
  onSelectStudentForDossier?: (id: string) => void;
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
  comparisonScope?: "centre" | "all";
  onSelectComparisonScope?: (scope: "centre" | "all") => void;
}

export const AnonymousPeerComparison: React.FC<AnonymousPeerComparisonProps> = ({
  students,
  onSelectStudentForDossier,
  selectedStudentId: controlledStudentId,
  onSelectStudentId,
  comparisonScope: controlledScope,
  onSelectComparisonScope,
}) => {
  const [internalStudentId, setInternalStudentId] = useState<string>(
    students[0]?.id || ""
  );
  const [internalScope, setInternalScope] = useState<"centre" | "all">("centre");

  const selectedStudentId = controlledStudentId !== undefined ? controlledStudentId : internalStudentId;
  const setSelectedStudentId = (id: string) => {
    setInternalStudentId(id);
    if (onSelectStudentId) onSelectStudentId(id);
  };

  const comparisonScope = controlledScope !== undefined ? controlledScope : internalScope;
  const setComparisonScope = (scope: "centre" | "all") => {
    setInternalScope(scope);
    if (onSelectComparisonScope) onSelectComparisonScope(scope);
  };

  // Centers list
  const centres = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.centre.city)));
    return list;
  }, [students]);

  // Selected Student
  const focalStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Focal Student Pillars & Average
  const focalStats = useMemo(() => {
    if (!focalStudent) return null;
    const pillars = calculateStreamerPillars(focalStudent);
    const avg = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
    const fr = calculateFutureReadyScore(focalStudent);
    return {
      pillars,
      avg,
      futureReady: fr.futureReadyScore,
      band: getRubricBand(avg),
    };
  }, [focalStudent]);

  // Cohort peer group: either students in the same centre or all
  const peerGroup = useMemo(() => {
    if (!focalStudent) return [];
    let group = comparisonScope === "centre"
      ? students.filter(s => s.centre.city === focalStudent.centre.city)
      : [...students];

    // Compute averages and sort descending
    return group.map(s => {
      const pillars = calculateStreamerPillars(s);
      const avg = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
      const fr = calculateFutureReadyScore(s);
      const isFocal = s.id === focalStudent.id;
      return {
        id: s.id,
        isFocal,
        rawStudent: s,
        realName: s.name,
        // Anonymous name: if focal, show real name; else show "Student X"
        displayName: isFocal ? s.name : "",
        avg,
        futureReady: fr.futureReadyScore,
        pillars,
        band: getRubricBand(avg),
      };
    }).sort((a, b) => b.avg - a.avg).map((item, index) => ({
      ...item,
      rank: index + 1,
      // Assign anonymous label e.g. "Student 2", "Student 3", etc.
      displayName: item.isFocal ? item.realName : `Student ${index + 1}`,
    }));
  }, [students, focalStudent, comparisonScope]);

  // Centre Average Benchmark
  const centreBenchmark = useMemo(() => {
    if (peerGroup.length === 0) return 0;
    const total = peerGroup.reduce((acc, p) => acc + p.avg, 0);
    return Number((total / peerGroup.length).toFixed(1));
  }, [peerGroup]);

  // Focal student rank in group
  const focalRank = useMemo(() => {
    const found = peerGroup.find(p => p.isFocal);
    return found ? found.rank : 1;
  }, [peerGroup]);

  // Ranked Chart Data for Custom Combo Chart (Bar = Composite Score, Line = Rank)
  // The focal student is ALWAYS shown as the first item in the chart (irrespective of rank), followed by Student 1, Student 2...
  const rankedChartData = useMemo(() => {
    if (peerGroup.length === 0) return [];

    const focal = peerGroup.find((p) => p.isFocal);
    const others = peerGroup.filter((p) => !p.isFocal);

    const items = [];

    // 1. Focal student ALWAYS placed first in chart
    if (focal) {
      items.push({
        id: focal.id,
        name: `${focal.realName} (You)`,
        shortLabel: `${focal.realName.split(" ")[0]} (You)`,
        fullName: focal.realName,
        score: focal.avg,
        rank: focal.rank,
        isFocal: true,
        band: focal.band,
        futureReady: focal.futureReady,
      });
    }

    // 2. Followed by anonymous peers labeled "Student X" based on their cohort rank
    others.forEach((peer) => {
      items.push({
        id: peer.id,
        name: `Student ${peer.rank}`,
        shortLabel: `Student ${peer.rank}`,
        fullName: `Student ${peer.rank} (Anon #${peer.rank})`,
        score: peer.avg,
        rank: peer.rank,
        isFocal: false,
        band: peer.band,
        futureReady: peer.futureReady,
      });
    });

    return items;
  }, [peerGroup]);

  // Pillar Comparison Data for Bar Chart: Focal Student vs Anonymous Group Mean
  const pillarComparisonData = useMemo(() => {
    if (!focalStats) return [];

    return focalStats.pillars.map(p => {
      let groupPillarSum = 0;
      peerGroup.forEach(peer => {
        const match = peer.pillars.find(pp => pp.pillar === p.pillar);
        if (match) groupPillarSum += match.ytd;
      });
      const groupAvg = Number((groupPillarSum / peerGroup.length).toFixed(1));
      const delta = Number((p.ytd - groupAvg).toFixed(1));

      return {
        pillar: p.pillar,
        focalScore: p.ytd,
        groupAvg,
        delta,
        color: p.color,
      };
    });
  }, [focalStats, peerGroup]);

  // Cross-centre aggregation stats
  const centreComparisonStats = useMemo(() => {
    return centres.map(city => {
      const centreStudents = students.filter(s => s.centre.city === city);
      let scoreSum = 0;
      let frSum = 0;

      centreStudents.forEach(s => {
        const pillars = calculateStreamerPillars(s);
        scoreSum += pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length;
        frSum += calculateFutureReadyScore(s).futureReadyScore;
      });

      const avgScore = Number((scoreSum / centreStudents.length).toFixed(1));
      const avgFr = Number((frSum / centreStudents.length).toFixed(1));

      return {
        city,
        country: centreStudents[0]?.centre.country || "",
        studentCount: centreStudents.length,
        avgScore,
        avgFr,
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [centres, students]);

  if (!focalStudent || !focalStats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Institutional FERPA / Privacy-Safe Benchmarking</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
            Anonymous In-Centre & Between-Centre Peer Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare a selected student directly against classroom peers where peer identities are masked as <strong className="text-slate-700">Student 2, Student 3...</strong>
          </p>
        </div>

        {/* Student Selector & Scope Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Focal Student:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.centre.city} • {s.batch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Comparison Scope:
            </label>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setComparisonScope("centre")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  comparisonScope === "centre"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                In-Centre ({focalStudent.centre.city})
              </button>
              <button
                type="button"
                onClick={() => setComparisonScope("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  comparisonScope === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Global Cohort (All)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Focal Student Spotlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Spotlight card */}
        <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-display font-black shadow-inner">
                {focalStudent.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-display font-bold text-white tracking-wide">
                    {focalStudent.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Focal Profile
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                  <span>{focalStudent.grade}</span>
                  <span>•</span>
                  <span>{focalStudent.centre.city}, {focalStudent.centre.country}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-mono">{focalStudent.id}</span>
                </div>
              </div>
            </div>

            {onSelectStudentForDossier && (
              <button
                type="button"
                onClick={() => onSelectStudentForDossier(focalStudent.id)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <span>View Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Benchmark Comparison Bar */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Rank in {focalStudent.centre.city}</div>
              <div className="text-2xl font-black font-display text-white mt-0.5 flex items-baseline space-x-1">
                <span>#{focalRank}</span>
                <span className="text-xs font-normal text-slate-400">of {peerGroup.length}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">Composite Average</div>
              <div className="text-2xl font-black font-display text-emerald-400 mt-0.5">
                {focalStats.avg} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">Centre Mean Benchmark</div>
              <div className="text-2xl font-black font-display text-slate-300 mt-0.5">
                {centreBenchmark} <span className="text-xs text-slate-400 font-normal">pts</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">Performance Delta (vs Peers)</div>
              <div className={`text-2xl font-black font-display mt-0.5 ${
                focalStats.avg >= centreBenchmark ? "text-emerald-400" : "text-amber-400"
              }`}>
                {focalStats.avg >= centreBenchmark ? `+${(focalStats.avg - centreBenchmark).toFixed(1)}` : (focalStats.avg - centreBenchmark).toFixed(1)}
                <span className="text-xs text-slate-400 font-normal ml-1">pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rubric Mastery Tier
            </span>
            <div className="mt-2">
              <span
                className="px-3 py-1 rounded-xl text-xs font-display font-black tracking-wide inline-block"
                style={{
                  backgroundColor: `${focalStats.band.color}15`,
                  color: focalStats.band.color,
                  border: `1.5px solid ${focalStats.band.color}40`,
                }}
              >
                {focalStats.band.name} ({focalStats.band.range[0]}–{focalStats.band.range[1]} pts)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
              {focalStats.band.description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Future Ready Index:</span>
            <span className="font-display font-black text-slate-900 text-sm">
              {focalStats.futureReady} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pillar-by-Pillar Comparison Bar Chart (Focal Student vs Anonymous Class Average) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-streamer-science" />
              <span>{focalStudent.name} vs Anonymous Peer Benchmark by Pillar</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side comparison across all 8 STREAMER competencies against {focalStudent.centre.city} cohort mean.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRAND_COLORS.blue }} />
              <span>{focalStudent.name} (Focal)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRAND_COLORS.darkGrey }} />
              <span>Anonymous Peers Mean</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pillarComparisonData}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="pillar"
                tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                axisLine={{ stroke: "#CBD5E1" }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <div className="font-bold text-sm text-slate-100 mb-1">{d.pillar}</div>
                        <div className="flex items-center justify-between space-x-4 text-slate-300">
                          <span>{focalStudent.name}:</span>
                          <span className="font-bold font-mono" style={{ color: BRAND_COLORS.electricBlue }}>{d.focalScore} pts</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4 text-slate-400 mt-0.5">
                          <span>Peers Mean:</span>
                          <span className="font-bold text-white font-mono">{d.groupAvg} pts</span>
                        </div>
                        <div className="flex items-center justify-between space-x-4 text-slate-300 pt-1 mt-1 border-t border-slate-700">
                          <span>Delta:</span>
                          <span className="font-bold font-mono" style={{ color: d.delta >= 0 ? BRAND_COLORS.electricBlue : BRAND_COLORS.orangeRed }}>
                            {d.delta >= 0 ? `+${d.delta}` : d.delta} pts
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={centreBenchmark} stroke="#94A3B8" strokeDasharray="3 3" />
              <Bar dataKey="focalScore" name={focalStudent.name} fill={BRAND_COLORS.blue} radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="groupAvg" name="Peers Mean" fill={BRAND_COLORS.darkGrey} radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Anonymous Classroom Peer Rankings Custom Combo Chart (Bar: Score, Line: Rank) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combined Chart: Focal Student Always First, Followed by Anonymous Classmates */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-streamer-science" />
                  <span>Classroom Peer Rankings & Score Distribution in {focalStudent.centre.city}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combined composite score (bars) and classroom rank (line) with identity masking
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-bold border border-blue-200 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: BRAND_COLORS.blue }} />
                  <span>Composite Score (pts)</span>
                </span>
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-[#E04627] font-bold border border-orange-200 text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS.orangeRed }} />
                  <span>Rank (#)</span>
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {peerGroup.length} Enrolled
                </span>
              </div>
            </div>

            {/* Custom Combo Chart: Rank (Line) + Composite Score (Bar) */}
            <div className="h-80 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={rankedChartData}
                  margin={{ top: 25, right: 30, left: -10, bottom: 20 }}
                  onClick={(state) => {
                    if (state && state.activePayload && state.activePayload.length > 0) {
                      const clicked = state.activePayload[0].payload;
                      if (clicked && clicked.id && clicked.id !== selectedStudentId) {
                        setSelectedStudentId(clicked.id);
                      }
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: "#334155", fontWeight: 700 }}
                    axisLine={{ stroke: "#CBD5E1" }}
                    tickLine={false}
                    interval={0}
                  />
                  {/* Left Y-Axis: Composite Score (50 - 100 pts) */}
                  <YAxis
                    yAxisId="scoreAxis"
                    orientation="left"
                    domain={[50, 100]}
                    tick={{ fontSize: 10, fill: "#64748B", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Score (pts)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#64748B", fontSize: 10, fontWeight: 700 },
                    }}
                  />
                  {/* Right Y-Axis: Rank (#1 at the top) */}
                  <YAxis
                    yAxisId="rankAxis"
                    orientation="right"
                    domain={[1, Math.max(peerGroup.length, 3)]}
                    reversed={true}
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: BRAND_COLORS.orangeRed, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `#${val}`}
                    label={{
                      value: "Rank (#)",
                      angle: 90,
                      position: "insideRight",
                      style: { fill: BRAND_COLORS.orangeRed, fontSize: 10, fontWeight: 700 },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs min-w-[210px] z-50">
                            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                              <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                                {d.isFocal && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                <span>{d.name}</span>
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black"
                                style={{
                                  backgroundColor: `${d.band.color}25`,
                                  color: d.band.color,
                                  border: `1px solid ${d.band.color}40`,
                                }}
                              >
                                {d.band.name}
                              </span>
                            </div>
                            <div className="space-y-1 font-mono">
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="text-slate-400 font-sans">Classroom Rank:</span>
                                <span className="font-black text-sm text-amber-400">#{d.rank} of {peerGroup.length}</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="text-slate-400 font-sans">Composite Score:</span>
                                <span className="font-black text-blue-400 text-sm">{d.score} pts</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1.5 mt-1 border-t border-slate-800 font-sans">
                                <span>Delta vs Mean ({centreBenchmark}):</span>
                                <span className={`font-bold font-mono ${d.score >= centreBenchmark ? "text-emerald-400" : "text-amber-400"}`}>
                                  {d.score >= centreBenchmark ? `+${(d.score - centreBenchmark).toFixed(1)}` : (d.score - centreBenchmark).toFixed(1)} pts
                                </span>
                              </div>
                            </div>
                            {!d.isFocal && (
                              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-blue-300 flex items-center justify-center font-sans">
                                <span>Click bar to spotlight this student</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Bars: Composite Score */}
                  <Bar
                    yAxisId="scoreAxis"
                    dataKey="score"
                    name="Composite Score (pts)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    cursor="pointer"
                  >
                    {rankedChartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.isFocal ? BRAND_COLORS.blue : "#94A3B8"}
                        opacity={entry.isFocal ? 1 : 0.65}
                        stroke={entry.isFocal ? "#0F172A" : "none"}
                        strokeWidth={entry.isFocal ? 2 : 0}
                      />
                    ))}
                  </Bar>

                  {/* Line: Classroom Rank (#) with reversed axis */}
                  <Line
                    yAxisId="rankAxis"
                    type="monotone"
                    dataKey="rank"
                    name="Classroom Rank (#)"
                    stroke={BRAND_COLORS.orangeRed}
                    strokeWidth={3}
                    dot={{ r: 6, fill: BRAND_COLORS.orangeRed, stroke: "#FFFFFF", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: BRAND_COLORS.orangeRed, stroke: "#FFFFFF", strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Card Footer with Focal Summary & Helper */}
          <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Selected Profile:</span>
              <span className="font-bold text-slate-900">
                {focalStudent.name} is ranked <span className="text-[#E04627] font-black font-mono">#{focalRank}</span> of {peerGroup.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-bold text-blue-700">{focalStats.avg} pts</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium italic">
              Click any bar in the chart to spotlight that student
            </span>
          </div>
        </div>

        {/* Cross-Centre Comparison Cards */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-streamer-science" />
                <span>Between-Centre Comparison</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Regional benchmark averages across all international innovation labs.
            </p>

            <div className="space-y-3">
              {centreComparisonStats.map((c, idx) => (
                <div
                  key={c.city}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    c.city === focalStudent.centre.city
                      ? "bg-blue-50/50 border-blue-200 shadow-xs"
                      : "bg-slate-50 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{c.city}</span>
                      <span className="text-[10px] text-slate-400">({c.country})</span>
                      {c.city === focalStudent.centre.city && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-sm">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {c.avgScore} pts
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full"
                      style={{ width: `${(c.avgScore / 100) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                    <span>{c.studentCount} active students</span>
                    <span>Future Ready: {c.avgFr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 italic text-center">
            Scores normalized across standardized rubric matrix
          </div>
        </div>
      </div>
    </div>
  );
};
