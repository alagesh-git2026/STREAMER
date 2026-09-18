import type { Student } from "../data/students";
import { RUBRIC_BANDS, type RubricBand } from "../data/frameworkData";

export interface StreamerPillarScore {
  pillar: string;
  letter: string;
  color: string;
  day0: number | null;
  ytd: number;
}

export interface TwentyFirstCenturySkill {
  name: string;
  score: number;
  formula: string;
  derivedFrom: string[];
}

export interface FutureReadyBreakdown {
  futureReadyScore: number;
  streamerAvg: number;
  streamerContribution: number; // 0.5 * avg
  twentyFirstCenturyAvg: number;
  twentyFirstCenturyContribution: number; // 0.3 * avg
  sdgBreadthPct: number;
  sdgBreadthContribution: number; // 0.2 * breadth
  distinctSdgs: string[];
}

export interface SkillRankedItem {
  skillName: string;
  pillar: string;
  pillarColor: string;
  day0: number | null;
  ytd: number;
  delta: number | null;
  rubric: RubricBand;
}

export function getRubricBand(score: number): RubricBand {
  const rounded = Math.round(score);
  const band = RUBRIC_BANDS.find(b => rounded >= b.range[0] && rounded <= b.range[1]);
  return band || RUBRIC_BANDS[0];
}

export function calculateStreamerPillars(student: Student): StreamerPillarScore[] {
  const s = student.skillScores;

  // Engineering is average of Awareness of Materials and Equipment Handling
  const engDay0 = (s["Awareness of Materials"].day0 !== null && s["Equipment Handling"].day0 !== null)
    ? Math.round((s["Awareness of Materials"].day0! + s["Equipment Handling"].day0!) / 2)
    : null;
  const engYtd = Math.round((s["Awareness of Materials"].ytd + s["Equipment Handling"].ytd) / 2);

  return [
    {
      pillar: "Science",
      letter: "S",
      color: "#2255A4",
      day0: s["Conceptual Foundation"].day0,
      ytd: s["Conceptual Foundation"].ytd
    },
    {
      pillar: "Technology",
      letter: "T",
      color: "#0E7C6F",
      day0: s["Circuit Basics"].day0,
      ytd: s["Circuit Basics"].ytd
    },
    {
      pillar: "Research",
      letter: "R",
      color: "#B65529",
      day0: s["Data Analysis"].day0,
      ytd: s["Data Analysis"].ytd
    },
    {
      pillar: "Engineering",
      letter: "E",
      color: "#5A3FA0",
      day0: engDay0,
      ytd: engYtd
    },
    {
      pillar: "Arts",
      letter: "A",
      color: "#C23768",
      day0: s["Creativity / Design Thinking"].day0,
      ytd: s["Creativity / Design Thinking"].ytd
    },
    {
      pillar: "Mathematics",
      letter: "M",
      color: "#41722E",
      day0: s["Mathematics (blended)"].day0,
      ytd: s["Mathematics (blended)"].ytd
    },
    {
      pillar: "Entrepreneurship",
      letter: "E",
      color: "#9A6C10",
      day0: s["Decision Making"].day0,
      ytd: s["Decision Making"].ytd
    },
    {
      pillar: "Resilience",
      letter: "R",
      color: "#1D6FA5",
      day0: s["Troubleshooting"].day0,
      ytd: s["Troubleshooting"].ytd
    }
  ];
}

export function calculate21stCenturySkills(student: Student): TwentyFirstCenturySkill[] {
  const pillars = calculateStreamerPillars(student);
  const getPillarYtd = (name: string) => pillars.find(p => p.pillar === name)?.ytd || 0;

  const science = getPillarYtd("Science");
  const tech = getPillarYtd("Technology");
  const research = getPillarYtd("Research");
  const eng = getPillarYtd("Engineering");
  const arts = getPillarYtd("Arts");
  const entrep = getPillarYtd("Entrepreneurship");
  const res = getPillarYtd("Resilience");
  const commAddon = student.skillScores["Communication & Collaboration"].ytd;

  const round = (val: number) => Math.round(val * 10) / 10;

  return [
    {
      name: "Critical Thinking",
      score: round((research + science) / 2),
      formula: "average(Research, Science)",
      derivedFrom: ["Research", "Science"]
    },
    {
      name: "Creativity",
      score: arts,
      formula: "Arts (direct)",
      derivedFrom: ["Arts"]
    },
    {
      name: "Communication",
      score: commAddon,
      formula: "Communication & Collaboration add-on (direct)",
      derivedFrom: ["Communication & Collaboration"]
    },
    {
      name: "Collaboration",
      score: round((commAddon + entrep) / 2),
      formula: "average(Communication & Collaboration, Entrepreneurship)",
      derivedFrom: ["Communication & Collaboration", "Entrepreneurship"]
    },
    {
      name: "Digital Literacy",
      score: round((tech + eng) / 2),
      formula: "average(Technology, Engineering)",
      derivedFrom: ["Technology", "Engineering"]
    },
    {
      name: "Leadership",
      score: round((entrep + commAddon) / 2),
      formula: "average(Entrepreneurship, Communication & Collaboration)",
      derivedFrom: ["Entrepreneurship", "Communication & Collaboration"]
    },
    {
      name: "Adaptability",
      score: res,
      formula: "Resilience (direct)",
      derivedFrom: ["Resilience"]
    },
    {
      name: "Initiative",
      score: round((entrep + res) / 2),
      formula: "average(Entrepreneurship, Resilience)",
      derivedFrom: ["Entrepreneurship", "Resilience"]
    }
  ];
}

export function getDistinctSdgs(student: Student): string[] {
  const sdgSet = new Set<string>();
  Object.values(student.skillScores).forEach(skill => {
    skill.byProject.forEach(project => {
      project.sdgTags.forEach(tag => sdgSet.add(tag));
    });
  });
  return Array.from(sdgSet).sort();
}

export function calculateFutureReadyScore(student: Student): FutureReadyBreakdown {
  const pillars = calculateStreamerPillars(student);
  const streamerAvg = pillars.reduce((sum, p) => sum + p.ytd, 0) / pillars.length;

  const skills21 = calculate21stCenturySkills(student);
  const skills21Avg = skills21.reduce((sum, s) => sum + s.score, 0) / skills21.length;

  const distinctSdgs = getDistinctSdgs(student);
  const sdgBreadthPct = (distinctSdgs.length / 6) * 100;

  const streamerContrib = 0.5 * streamerAvg;
  const skills21Contrib = 0.3 * skills21Avg;
  const sdgContrib = 0.2 * sdgBreadthPct;

  const total = Math.round((streamerContrib + skills21Contrib + sdgContrib) * 10) / 10;

  return {
    futureReadyScore: total,
    streamerAvg: Math.round(streamerAvg * 10) / 10,
    streamerContribution: Math.round(streamerContrib * 10) / 10,
    twentyFirstCenturyAvg: Math.round(skills21Avg * 10) / 10,
    twentyFirstCenturyContribution: Math.round(skills21Contrib * 10) / 10,
    sdgBreadthPct: Math.round(sdgBreadthPct * 10) / 10,
    sdgBreadthContribution: Math.round(sdgContrib * 10) / 10,
    distinctSdgs
  };
}

export function getAllSkillsRanked(student: Student): SkillRankedItem[] {
  const mapping: Record<string, { pillar: string; color: string }> = {
    "Conceptual Foundation": { pillar: "Science", color: "#2255A4" },
    "Circuit Basics": { pillar: "Technology", color: "#0E7C6F" },
    "Data Analysis": { pillar: "Research", color: "#B65529" },
    "Awareness of Materials": { pillar: "Engineering", color: "#5A3FA0" },
    "Equipment Handling": { pillar: "Engineering", color: "#5A3FA0" },
    "Creativity / Design Thinking": { pillar: "Arts", color: "#C23768" },
    "Mathematics (blended)": { pillar: "Mathematics", color: "#41722E" },
    "Decision Making": { pillar: "Entrepreneurship", color: "#9A6C10" },
    "Troubleshooting": { pillar: "Resilience", color: "#1D6FA5" },
    "Communication & Collaboration": { pillar: "Portfolio Add-On", color: "#64748B" }
  };

  const list: SkillRankedItem[] = Object.entries(student.skillScores).map(([skillName, score]) => {
    const meta = mapping[skillName] || { pillar: "General", color: "#3B82F6" };
    const delta = score.day0 !== null ? score.ytd - score.day0 : null;
    return {
      skillName,
      pillar: meta.pillar,
      pillarColor: meta.color,
      day0: score.day0,
      ytd: score.ytd,
      delta,
      rubric: getRubricBand(score.ytd)
    };
  });

  return list.sort((a, b) => b.ytd - a.ytd);
}

export function getTopAndBottomSkills(student: Student) {
  const ranked = getAllSkillsRanked(student);
  const top5 = ranked.slice(0, 5);
  const bottom5 = [...ranked.slice(-5)].reverse(); // lowest first
  return { top5, bottom5 };
}

export function getTopStrengthPillar(student: Student, preferredPillar?: string): StreamerPillarScore {
  const pillars = calculateStreamerPillars(student);
  const maxScore = Math.max(...pillars.map(p => p.ytd));

  if (preferredPillar && preferredPillar !== "All") {
    const pref = preferredPillar.trim().toLowerCase();
    const matching = pillars.find(
      p => (p.pillar.toLowerCase() === pref || (pref.startsWith("math") && p.pillar.toLowerCase().startsWith("math"))) && p.ytd === maxScore
    );
    if (matching) return matching;
  }

  return [...pillars].sort((a, b) => b.ytd - a.ytd)[0];
}

export function getTopStrengthPillars(student: Student, preferredPillar?: string): StreamerPillarScore[] {
  const pillars = calculateStreamerPillars(student);
  const maxScore = Math.max(...pillars.map(p => p.ytd));
  const tied = pillars.filter(p => p.ytd === maxScore);

  if (preferredPillar && preferredPillar !== "All") {
    const pref = preferredPillar.trim().toLowerCase();
    const matching = tied.filter(
      p => p.pillar.toLowerCase() === pref || (pref.startsWith("math") && p.pillar.toLowerCase().startsWith("math"))
    );
    if (matching.length > 0) return matching;
  }

  return tied;
}

