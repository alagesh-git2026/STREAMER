import React from "react";
import { Info } from "lucide-react";
import type { Student } from "../../data/students";
import { calculateStreamerPillars } from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";

interface PowerBiKpiCardsProps {
  students: Student[];
}

export const PowerBiKpiCards: React.FC<PowerBiKpiCardsProps> = ({ students }) => {
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
      };
    }

    let totalScoreSum = 0;
    let totalPillarsCount = 0;
    let entrepreneurshipHighCount = 0;
    let resilienceHighCount = 0;
    let proficientStudentsCount = 0;

    students.forEach(student => {
      const pillars = calculateStreamerPillars(student);
      const studentAvg = pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length;
      totalScoreSum += studentAvg;
      totalPillarsCount += 1;

      if (studentAvg >= 65) {
        proficientStudentsCount += 1;
      }

      const ent = pillars.find(p => p.pillar === "Entrepreneurship");
      if (ent && ent.ytd >= 80) {
        entrepreneurshipHighCount += 1;
      }

      const res = pillars.find(p => p.pillar === "Resilience");
      if (res && res.ytd >= 80) {
        resilienceHighCount += 1;
      }
    });

    const avgScore = totalScoreSum / totalPillarsCount;
    const entrepreneurshipPct = (entrepreneurshipHighCount / students.length) * 100;
    const resiliencePct = (resilienceHighCount / students.length) * 100;
    const passRate = (proficientStudentsCount / students.length) * 100;

    return {
      avgScore: Number(avgScore.toFixed(2)),
      entrepreneurshipPct: Number(entrepreneurshipPct.toFixed(1)),
      entrepreneurshipCount: entrepreneurshipHighCount,
      resiliencePct: Number(resiliencePct.toFixed(1)),
      resilienceCount: resilienceHighCount,
      passRate: Number(passRate.toFixed(1)),
      proficientCount: proficientStudentsCount,
    };
  }, [students]);

  // Speedometer calculation for Card 1: Overall Average Score (0 - 100 pts)
  const avgAngle = Math.min(180, Math.max(0, (metrics.avgScore / 100) * 180));
  const avgNeedleRad = ((180 - avgAngle) * Math.PI) / 180;
  const avgNeedleX = 50 + 32 * Math.cos(avgNeedleRad);
  const avgNeedleY = 50 - 32 * Math.sin(avgNeedleRad);

  // Speedometer calculation for Card 2: Entrepreneurship (0 - 100%)
  const entAngle = Math.min(180, Math.max(0, (metrics.entrepreneurshipPct / 100) * 180));
  const entNeedleRad = ((180 - entAngle) * Math.PI) / 180;
  const entNeedleX = 50 + 32 * Math.cos(entNeedleRad);
  const entNeedleY = 50 - 32 * Math.sin(entNeedleRad);

  // Speedometer calculation for Card 3: Resilience & Troubleshooting (0 - 100%)
  const resAngle = Math.min(180, Math.max(0, (metrics.resiliencePct / 100) * 180));
  const resNeedleRad = ((180 - resAngle) * Math.PI) / 180;
  const resNeedleX = 50 + 32 * Math.cos(resNeedleRad);
  const resNeedleY = 50 - 32 * Math.sin(resNeedleRad);

  // Gauge calculation for Pass Rate (semi-circle radius=34, stroke-dasharray)
  const gaugeCircumference = Math.PI * 34; // approx 106.8
  const gaugeOffset = gaugeCircumference - (metrics.passRate / 100) * gaugeCircumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. SPEEDOMETER: Overall Average Score */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Overall Average Score
          </span>
          <div title="Composite academic evaluation across all STREAMER learning pillars">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Speedometer Gauge Visual */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <svg viewBox="0 0 100 60" className="w-40 h-24 overflow-visible">
            <defs>
              <linearGradient id="speedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={BRAND_COLORS.orangeRed} />
                <stop offset="50%" stopColor={BRAND_COLORS.darkGrey} />
                <stop offset="100%" stopColor={BRAND_COLORS.blue} />
              </linearGradient>
            </defs>
            {/* Background Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored Segment Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="url(#speedometerGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Target 75.0 marker tick */}
            {/* 75% angle = 180 - (0.75 * 180) = 45 deg */}
            <line
              x1={50 + 31 * Math.cos((45 * Math.PI) / 180)}
              y1={50 - 31 * Math.sin((45 * Math.PI) / 180)}
              x2={50 + 41 * Math.cos((45 * Math.PI) / 180)}
              y2={50 - 41 * Math.sin((45 * Math.PI) / 180)}
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2={avgNeedleX}
              y2={avgNeedleY}
              stroke={BRAND_COLORS.darkGrey}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pivot Center Pin */}
            <circle cx="50" cy="50" r="4.5" fill="#0F172A" />
            <circle cx="50" cy="50" r="2" fill="white" />
          </svg>

          {/* Speedometer Score Value */}
          <div className="-mt-3 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              {metrics.avgScore}
            </span>
            <span className="text-xs text-slate-400 font-bold ml-1 font-mono">/ 100</span>
          </div>
        </div>

        {/* Target Benchmark Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
          <span className="font-mono">0 pts</span>
          <span className="font-bold text-slate-700">Target: 75.0</span>
          <span className="font-mono">100 pts</span>
        </div>
      </div>

      {/* 2. SPEEDOMETER: Entrepreneurship (≥80%) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Entrepreneurship
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-[#E04627]">
              ≥80%
            </span>
          </div>
          <div title="Percentage of cohort students achieving high-mastery (≥80 pts) in Entrepreneurship & pitch criteria">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Speedometer Gauge Visual */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <svg viewBox="0 0 100 60" className="w-40 h-24 overflow-visible">
            <defs>
              <linearGradient id="entSpeedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="60%" stopColor="#FB923C" />
                <stop offset="100%" stopColor={BRAND_COLORS.orangeRed} />
              </linearGradient>
            </defs>
            {/* Background Track Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored Segment Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="url(#entSpeedometerGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Target 70.0% marker tick (54 deg) */}
            <line
              x1={50 + 31 * Math.cos((54 * Math.PI) / 180)}
              y1={50 - 31 * Math.sin((54 * Math.PI) / 180)}
              x2={50 + 41 * Math.cos((54 * Math.PI) / 180)}
              y2={50 - 41 * Math.sin((54 * Math.PI) / 180)}
              stroke={BRAND_COLORS.orangeRed}
              strokeWidth="2.5"
            />
            {/* Needle pointing to entAngle */}
            <line
              x1="50"
              y1="50"
              x2={entNeedleX}
              y2={entNeedleY}
              stroke={BRAND_COLORS.orangeRed}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pivot Center Pin */}
            <circle cx="50" cy="50" r="4.5" fill={BRAND_COLORS.orangeRed} />
            <circle cx="50" cy="50" r="2" fill="white" />
          </svg>

          {/* Speedometer Score Value */}
          <div className="-mt-3 text-center">
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight" style={{ color: BRAND_COLORS.orangeRed }}>
                {metrics.entrepreneurshipPct}%
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                ({metrics.entrepreneurshipCount}/{students.length})
              </span>
            </div>
          </div>
        </div>

        {/* Target Benchmark Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
          <span className="font-mono">0%</span>
          <span className="font-bold text-slate-700">Target: 70.0%</span>
          <span className="font-mono">100%</span>
        </div>
      </div>

      {/* 3. SPEEDOMETER: Resilience & Troubleshooting (≥80%) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Resilience
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4F9C]">
              ≥80%
            </span>
          </div>
          <div title="Percentage of cohort students achieving high-mastery (≥80 pts) in Root-Cause Troubleshooting & Failure Recovery">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Speedometer Gauge Visual */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <svg viewBox="0 0 100 60" className="w-40 h-24 overflow-visible">
            <defs>
              <linearGradient id="resSpeedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="60%" stopColor={BRAND_COLORS.electricBlue} />
                <stop offset="100%" stopColor={BRAND_COLORS.blue} />
              </linearGradient>
            </defs>
            {/* Background Track Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored Segment Arc */}
            <path
              d="M 14 50 A 36 36 0 0 1 86 50"
              fill="none"
              stroke="url(#resSpeedometerGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Target 75.0% marker tick (45 deg) */}
            <line
              x1={50 + 31 * Math.cos((45 * Math.PI) / 180)}
              y1={50 - 31 * Math.sin((45 * Math.PI) / 180)}
              x2={50 + 41 * Math.cos((45 * Math.PI) / 180)}
              y2={50 - 41 * Math.sin((45 * Math.PI) / 180)}
              stroke={BRAND_COLORS.blue}
              strokeWidth="2.5"
            />
            {/* Needle pointing to resAngle */}
            <line
              x1="50"
              y1="50"
              x2={resNeedleX}
              y2={resNeedleY}
              stroke={BRAND_COLORS.blue}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pivot Center Pin */}
            <circle cx="50" cy="50" r="4.5" fill={BRAND_COLORS.blue} />
            <circle cx="50" cy="50" r="2" fill="white" />
          </svg>

          {/* Speedometer Score Value */}
          <div className="-mt-3 text-center">
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tight" style={{ color: BRAND_COLORS.blue }}>
                {metrics.resiliencePct}%
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                ({metrics.resilienceCount}/{students.length})
              </span>
            </div>
          </div>
        </div>

        {/* Target Benchmark Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
          <span className="font-mono">0%</span>
          <span className="font-bold text-slate-700">Target: 75.0%</span>
          <span className="font-mono">100%</span>
        </div>
      </div>

      {/* 4. GAUGE CHART: Pass Rate (Proficient) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pass Rate (Proficient)
          </span>
          <div title="Percentage of cohort students meeting Proficient (≥65 pts) or Advanced standards">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        {/* Gauge Chart Visual */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <svg viewBox="0 0 100 60" className="w-40 h-24 overflow-visible">
            {/* Background Track Arc */}
            <path
              d="M 16 50 A 34 34 0 0 1 84 50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Animated Value Arc in Brand Blue */}
            <path
              d="M 16 50 A 34 34 0 0 1 84 50"
              fill="none"
              stroke={BRAND_COLORS.blue}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={gaugeOffset}
              className="transition-all duration-700"
            />
            {/* Target 85.0% Tick */}
            {/* 85% angle = 180 - (0.85 * 180) = 27 deg */}
            <line
              x1={50 + 29 * Math.cos((27 * Math.PI) / 180)}
              y1={50 - 29 * Math.sin((27 * Math.PI) / 180)}
              x2={50 + 39 * Math.cos((27 * Math.PI) / 180)}
              y2={50 - 39 * Math.sin((27 * Math.PI) / 180)}
              stroke={BRAND_COLORS.orangeRed}
              strokeWidth="2.5"
            />
          </svg>

          {/* Gauge Center Value */}
          <div className="-mt-4 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              {metrics.passRate}%
            </span>
          </div>
        </div>

        {/* Footer Target */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
          <span className="font-mono">Proficient: ≥65 pts</span>
          <span className="font-bold text-slate-700">Target: 85.0%</span>
        </div>
      </div>
    </div>
  );
};
