import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Info, Calendar } from "lucide-react";
import type { Student } from "../../data/students";
import { useStudentData } from "../../context/StudentDataContext";
import { BRAND_COLORS } from "../../constants/brandColors";

interface PerformanceTrendChartProps {
  students?: Student[];
  selectedYear?: string;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ selectedYear }) => {
  const { quarterlyMilestones, monthlyMilestones } = useStudentData();

  // View mode: "quarterly" vs "monthly"
  const [timeMode, setTimeMode] = useState<"quarterly" | "monthly">("quarterly");
  // Metric mode: "avgScore" vs "passRate" vs "weightedAvg"
  const [metricMode, setMetricMode] = useState<"avgScore" | "passRate" | "weightedAvg">("passRate");

  // Select dataset based on time mode and selected academic year
  const chartData = React.useMemo(() => {
    const list = timeMode === "quarterly" ? quarterlyMilestones : monthlyMilestones;
    const targetAcademicYear = selectedYear && selectedYear.includes("2024-2025") ? "2024-2025" : "2025-2026";
    const filtered = list.filter(item => item.academicYear === targetAcademicYear);
    const activeList = filtered.length > 0 ? filtered : list.slice(0, timeMode === "quarterly" ? 5 : 8);

    return activeList.map(item => ({
      label: item.label,
      period: item.period,
      value: metricMode === "avgScore" ? item.avgScore : metricMode === "passRate" ? item.passRate : item.weightedAvg,
      fullItem: item,
    }));
  }, [timeMode, quarterlyMilestones, monthlyMilestones, metricMode, selectedYear]);

  const metricLabel = metricMode === "passRate" ? "Pass Rate" : metricMode === "avgScore" ? "Average Score" : "Weighted Avg";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Header with Title & Time Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <span>Performance Trend</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Cohort trajectory by {timeMode === "quarterly" ? "academic quarter" : "academic month"}
          </p>
        </div>

        {/* Time Switcher (Quarterly vs Monthly) matching user request */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setTimeMode("quarterly")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                timeMode === "quarterly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Quarter
            </button>
            <button
              type="button"
              onClick={() => setTimeMode("monthly")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                timeMode === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Month
            </button>
          </div>
          <div title="Milestone progression synchronized with backend source data">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Target Benchmark Clean Legend (NO CLUMSY TEXT OVERLAP OVER BARS) */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 py-1 mb-1 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 border-t-2 border-dashed inline-block" style={{ borderColor: BRAND_COLORS.orangeRed }} />
          <span>Target Pass: <strong className="text-slate-700">80.5%</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 border-t-2 border-dashed inline-block" style={{ borderColor: BRAND_COLORS.darkGrey }} />
          <span>Target Avg: <strong className="text-slate-700">75.0</strong></span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400 font-mono">
          <Calendar className="w-3 h-3" />
          <span>{timeMode === "quarterly" ? "5 Quarters" : "8 Months"}</span>
        </div>
      </div>

      {/* Chart Canvas with Brand Blue Bars */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 105]}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 100 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs shadow-xl border border-slate-700">
                      <div className="font-bold flex items-center space-x-1">
                        <span>{d.label}</span>
                        <span className="text-slate-400 font-normal">({d.period})</span>
                      </div>
                      <div className="text-sm font-black mt-0.5" style={{ color: BRAND_COLORS.electricBlue }}>
                        {d.value}%
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">
                        {metricLabel}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Clean Reference Lines without overlapping text collision */}
            <ReferenceLine
              y={80.5}
              stroke={BRAND_COLORS.orangeRed}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceLine
              y={75.0}
              stroke={BRAND_COLORS.darkGrey}
              strokeDasharray="3 3"
              strokeWidth={1.2}
            />
            <Bar
              dataKey="value"
              fill={BRAND_COLORS.blue}
              radius={[6, 6, 0, 0]}
              maxBarSize={timeMode === "quarterly" ? 36 : 22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Mode Toggles matching Power BI screenshot */}
      <div className="flex items-center justify-center space-x-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setMetricMode("avgScore")}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            metricMode === "avgScore"
              ? "bg-[#1E222D] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
          }`}
        >
          Average Score
        </button>
        <button
          type="button"
          onClick={() => setMetricMode("passRate")}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            metricMode === "passRate"
              ? "bg-[#1E222D] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
          }`}
        >
          Pass Rate
        </button>
        <button
          type="button"
          onClick={() => setMetricMode("weightedAvg")}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            metricMode === "weightedAvg"
              ? "bg-[#1E222D] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
          }`}
        >
          Weighted Average
        </button>
      </div>
    </div>
  );
};
