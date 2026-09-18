import type { Student } from "../data/students";
import type { MilestoneItem } from "../context/StudentDataContext";
import { calculateStreamerPillars, calculateFutureReadyScore, getRubricBand } from "./calculations";

export interface StudentProfileSummary {
  id: string;
  name: string;
  centre: string;
  grade: string;
  domain: string;
  futureReadyScore: number;
  avgScore: number;
  band: string;
  topStrengths: string[];
  scopeForGrowth: string[];
  recommendation: string;
}

/**
 * Extracts top strengths, scope for growth, and actionable recommendations for a student.
 */
export function extractStudentProfileInsights(student: Student): StudentProfileSummary {
  const pillars = calculateStreamerPillars(student);
  const avgScore = Number((pillars.reduce((acc, p) => acc + p.ytd, 0) / pillars.length).toFixed(1));
  const fr = calculateFutureReadyScore(student);
  const band = getRubricBand(avgScore).name;

  // Sort pillars descending for strengths
  const sortedPillars = [...pillars].sort((a, b) => b.ytd - a.ytd);
  const topStrengths = sortedPillars.slice(0, 3).map(p => `${p.pillar} (${p.ytd} pts)`);

  // Bottom pillars for scope of growth
  const bottomPillars = [...pillars].sort((a, b) => a.ytd - b.ytd);
  const scopeForGrowth = bottomPillars.slice(0, 2).map(p => `${p.pillar} (${p.ytd} pts)`);

  // Actionable Recommendation tailored to primary growth area
  const primaryWeakness = bottomPillars[0]?.pillar || "Entrepreneurship";
  let recommendation = "";
  if (primaryWeakness === "Entrepreneurship") {
    recommendation = "Provide mentor-guided pitch clinics to build decision-making autonomy and real-world value articulation.";
  } else if (primaryWeakness === "Resilience") {
    recommendation = "Introduce structured hardware debugging sandboxes to foster diagnostic perseverance and root-cause analysis.";
  } else if (primaryWeakness === "Arts") {
    recommendation = "Encourage participation in bonus aesthetic casing challenges and creative exterior industrial design.";
  } else if (primaryWeakness === "Research") {
    recommendation = "Guide multi-trial experimental validation sweeps to ground theoretical hypotheses in empirical proof.";
  } else if (primaryWeakness === "Engineering") {
    recommendation = "Strengthen hands-on mechanical assembly tolerances and structural durability testing.";
  } else if (primaryWeakness === "Mathematics") {
    recommendation = "Deepen quantitative telemetry modeling and sensor calibration calculus.";
  } else {
    recommendation = "Engage in cross-disciplinary capstone projects to integrate and advance applied systems engineering.";
  }

  return {
    id: student.id,
    name: student.name,
    centre: student.centre.city,
    grade: student.grade,
    domain: student.domain,
    futureReadyScore: fr.futureReadyScore,
    avgScore,
    band,
    topStrengths,
    scopeForGrowth,
    recommendation,
  };
}

/**
 * Exports Performance Insights data into a neatly structured, Excel-ready CSV format.
 */
export function exportPerformanceToExcel(params: {
  students: Student[];
  quarterlyMilestones: MilestoneItem[];
  monthlyMilestones: MilestoneItem[];
  selectedCentre: string;
  selectedYear: string;
}) {
  const { students, quarterlyMilestones, monthlyMilestones, selectedCentre, selectedYear } = params;

  // 1. Compute summary stats
  const totalStudents = students.length;
  const profiles = students.map(extractStudentProfileInsights);
  const avgOverall = totalStudents > 0
    ? Number((profiles.reduce((acc, p) => acc + p.avgScore, 0) / totalStudents).toFixed(2))
    : 0;
  const passRateOverall = totalStudents > 0
    ? Number(((profiles.filter(p => p.avgScore >= 65).length / totalStudents) * 100).toFixed(1))
    : 0;
  const masteryRateOverall = totalStudents > 0
    ? Number(((profiles.filter(p => p.avgScore >= 85).length / totalStudents) * 100).toFixed(1))
    : 0;

  // 2. Centre breakdown
  const centreMap = new Map<string, { count: number; sumScore: number; passCount: number; masteryCount: number; country: string }>();
  students.forEach(s => {
    const city = s.centre.city;
    const country = s.centre.country;
    const profile = profiles.find(p => p.id === s.id)!;
    if (!centreMap.has(city)) {
      centreMap.set(city, { count: 0, sumScore: 0, passCount: 0, masteryCount: 0, country });
    }
    const c = centreMap.get(city)!;
    c.count += 1;
    c.sumScore += profile.avgScore;
    if (profile.avgScore >= 65) c.passCount += 1;
    if (profile.avgScore >= 85) c.masteryCount += 1;
  });

  const lines: string[] = [];
  const escapeCsv = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

  // Header Block
  lines.push("================================================================================");
  lines.push("LAB OF FUTURE - EDUCATION PERFORMANCE ANALYSIS (POWER BI EXECUTIVE REPORT)");
  lines.push("================================================================================");
  lines.push(`Export Date,${escapeCsv(new Date().toLocaleDateString())}`);
  lines.push(`Academic Year,${escapeCsv(selectedYear === "All" ? "2025-2026 (Aug–Mar)" : selectedYear)}`);
  lines.push(`Filter Centre,${escapeCsv(selectedCentre)}`);
  lines.push(`Total Students Filtered,${totalStudents}`);
  lines.push(`Cohort Average Score,${avgOverall}`);
  lines.push(`Cohort Pass Rate (Proficient+),${passRateOverall}%`);
  lines.push(`Cohort Top Mastery Rate (85+),${masteryRateOverall}%`);
  lines.push("");

  // SECTION 1: Centre Performance Benchmarks
  lines.push("--------------------------------------------------------------------------------");
  lines.push("1. CENTRE PERFORMANCE & REGIONAL BENCHMARKS");
  lines.push("--------------------------------------------------------------------------------");
  lines.push(["Centre City", "Country", "Active Cohort Size", "Centre Mean Score", "Pass Rate (%)", "Top Mastery Rate (%)"].map(escapeCsv).join(","));
  centreMap.forEach((c, city) => {
    const mean = Number((c.sumScore / c.count).toFixed(1));
    const pass = Number(((c.passCount / c.count) * 100).toFixed(1));
    const mastery = Number(((c.masteryCount / c.count) * 100).toFixed(1));
    lines.push([city, c.country, c.count, mean, `${pass}%`, `${mastery}%`].map(escapeCsv).join(","));
  });
  lines.push("");

  // SECTION 2: Overall Peer Rankings
  lines.push("--------------------------------------------------------------------------------");
  lines.push("2. OVERALL PEER COMPARISON & RANKINGS");
  lines.push("--------------------------------------------------------------------------------");
  lines.push(["Rank", "Student ID", "Student Name", "Centre", "Grade", "Domain Track", "Avg Score", "Future Ready Index", "Rubric Band"].map(escapeCsv).join(","));
  const ranked = [...profiles].sort((a, b) => b.futureReadyScore - a.futureReadyScore);
  ranked.forEach((p, idx) => {
    lines.push([
      idx + 1,
      p.id,
      p.name,
      p.centre,
      p.grade,
      p.domain,
      p.avgScore,
      `${p.futureReadyScore}%`,
      p.band,
    ].map(escapeCsv).join(","));
  });
  lines.push("");

  // SECTION 3: Detailed Student Diagnostic Profiles (Strengths & Scope for Growth)
  lines.push("--------------------------------------------------------------------------------");
  lines.push("3. STUDENT PROFILES: TOP STRENGTHS & SCOPE FOR GROWTH");
  lines.push("--------------------------------------------------------------------------------");
  lines.push([
    "Student ID",
    "Student Name",
    "Centre",
    "Domain Track",
    "Future Ready %",
    "Primary Strength",
    "Secondary Strength",
    "Tertiary Strength",
    "Primary Scope for Growth",
    "Secondary Scope for Growth",
    "Actionable Pedagogical Recommendation",
  ].map(escapeCsv).join(","));

  profiles.forEach(p => {
    lines.push([
      p.id,
      p.name,
      p.centre,
      p.domain,
      `${p.futureReadyScore}%`,
      p.topStrengths[0] || "N/A",
      p.topStrengths[1] || "N/A",
      p.topStrengths[2] || "N/A",
      p.scopeForGrowth[0] || "N/A",
      p.scopeForGrowth[1] || "N/A",
      p.recommendation,
    ].map(escapeCsv).join(","));
  });
  lines.push("");

  // SECTION 4: Milestone Progressions (Quarterly & Monthly)
  lines.push("--------------------------------------------------------------------------------");
  lines.push("4. ACADEMIC MILESTONE TREND PROGRESSION (AUG TO MAR CYCLE)");
  lines.push("--------------------------------------------------------------------------------");
  lines.push(["Series Type", "Milestone Label", "Academic Year", "Academic Period", "Average Score", "Pass Rate (%)", "Weighted Avg (%)"].map(escapeCsv).join(","));
  monthlyMilestones.forEach(m => {
    lines.push(["Monthly (Aug-Mar)", m.label, m.academicYear || "2025-2026", m.period, m.avgScore, `${m.passRate}%`, `${m.weightedAvg}%`].map(escapeCsv).join(","));
  });
  quarterlyMilestones.forEach(q => {
    lines.push(["Quarterly (Q1-Capstone)", q.label, q.academicYear || "2025-2026", q.period, q.avgScore, `${q.passRate}%`, `${q.weightedAvg}%`].map(escapeCsv).join(","));
  });

  // Convert to CSV blob and download
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const sanitizedCentre = selectedCentre.replace(/\s+/g, "_");
  link.setAttribute("download", `LOF_Performance_Analysis_${sanitizedCentre}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers landscape PDF generation by invoking native window print.
 */
export function triggerLandscapePdfPrint(titleSuffix = "Summary") {
  const originalTitle = document.title;
  const sanitized = titleSuffix.replace(/\s+/g, "_");
  document.title = `LOF_${sanitized}_${new Date().toISOString().slice(0, 10)}`;
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
