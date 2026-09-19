import type { Student } from "../data/students";
import { calculateStreamerPillars, calculate21stCenturySkills } from "./calculations";

export interface FutureReadyRole {
  roleTitle: string;
  shortTitle: string;
  sector: string;
  sectorColor: string;
  hiringOrganizations: string[];
  matchReason: string;
  competencyTriplet: string;
  requiredCompetencies: string[];
  fitScore: number;
  industryDemand: "High Growth" | "Critical Scarcity" | "Strategic Frontier";
}

/**
 * Maps a student's unique combination of STREAMER pillars, 21st century skills,
 * and academic domain into an industry-demanded real-world career trajectory.
 */
export function determineFutureReadyRole(student: Student): FutureReadyRole {
  const pillars = calculateStreamerPillars(student);
  const sortedPillars = [...pillars].sort((a, b) => b.ytd - a.ytd);
  const topPillars = sortedPillars.slice(0, 3);
  const topPillarNames = topPillars.map(p => p.pillar);

  const skills21 = calculate21stCenturySkills(student);
  const sortedSkills = [...skills21].sort((a, b) => b.score - a.score);
  const topSkillNames = sortedSkills.slice(0, 2).map(s => s.name);

  const domain = student.domain;
  const hasArt = topPillarNames.includes("Arts");
  const hasMath = topPillarNames.includes("Mathematics");
  const hasResearch = topPillarNames.includes("Research");
  const hasScience = topPillarNames.includes("Science");
  const hasTech = topPillarNames.includes("Technology");
  const hasResilience = topPillarNames.includes("Resilience");
  const hasEntrepreneurship = topPillarNames.includes("Entrepreneurship");

  // Calculate fit score from top 3 pillars
  const avgTopScore = Math.round(
    topPillars.reduce((sum, p) => sum + p.ytd, 0) / topPillars.length
  );

  // 1. Combination: Maths + Research + Arts (User Example: Scientific Technical Illustrator / Storyteller)
  if (hasArt && hasResearch && hasMath) {
    if (domain === "Space & Astro") {
      return {
        roleTitle: "Scientific Technical Illustrator & Planetary Storyteller",
        shortTitle: "Scientific Technical Illustrator",
        sector: "Scientific Visualization & Media",
        sectorColor: "#C23768",
        hiringOrganizations: ["NASA", "National Geographic", "ESA", "ISRO", "BBC Science"],
        matchReason: `Leverages rare synergy in Arts (${topPillars.find(p=>p.pillar==="Arts")?.ytd}), Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}), and Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) to translate deep astrophysical telemetry into photorealistic illustrations and mission narratives.`,
        competencyTriplet: "Maths + Research + Arts",
        requiredCompetencies: ["Mathematics", "Research", "Arts", "Creativity"],
        fitScore: avgTopScore,
        industryDemand: "High Growth",
      };
    } else if (domain === "Robotics") {
      return {
        roleTitle: "Robotics UI/UX & Scientific Technical Illustrator",
        shortTitle: "Robotics UI/UX & Illustrator",
        sector: "Human-Robot Interaction & Design",
        sectorColor: "#C23768",
        hiringOrganizations: ["Boston Dynamics", "Tesla", "NASA JPL", "Apple", "Tata Elxsi"],
        matchReason: `Blends high Arts design thinking (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) with analytical Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}) and Maths (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) to craft intuitive robot teleoperation dashboards and technical schematics.`,
        competencyTriplet: "Arts + Research + Maths",
        requiredCompetencies: ["Arts", "Research", "Mathematics", "Design Thinking"],
        fitScore: avgTopScore,
        industryDemand: "Critical Scarcity",
      };
    } else {
      return {
        roleTitle: "Aerospace Data Illustrator & Scientific Storyteller",
        shortTitle: "Aerospace Data Illustrator",
        sector: "Aerospace Visualization & CAD",
        sectorColor: "#C23768",
        hiringOrganizations: ["Airbus", "ISRO", "NASA", "Tata Advanced Systems", "ESA"],
        matchReason: `Transforms complex flight dynamics and aerodynamic data into compelling technical visualizations and executive design blueprints using Arts (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) and Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}).`,
        competencyTriplet: "Arts + Research + Maths",
        requiredCompetencies: ["Arts", "Research", "Mathematics", "Communication"],
        fitScore: avgTopScore,
        industryDemand: "High Growth",
      };
    }
  }

  // 2. Combination: Mathematics + Technology + Science + Robotics Domain (Mei-Ling Chen profile)
  if (hasMath && (hasTech || hasScience) && domain === "Robotics") {
    return {
      roleTitle: "Autonomous Robotics Systems & Kinematics Engineer",
      shortTitle: "Autonomous Robotics Engineer",
      sector: "Robotics & Autonomous AI",
      sectorColor: "#0E7C6F",
      hiringOrganizations: ["Tesla", "Boston Dynamics", "NASA JPL", "ISRO", "Tata Motors"],
      matchReason: `High quantitative mastery in Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) combined with Technology (${topPillars.find(p=>p.pillar==="Technology")?.ytd || 90}) and Science enables algorithmic path planning, sensor fusion, and actuator kinematics.`,
      competencyTriplet: "Maths + Technology + Science",
      requiredCompetencies: ["Mathematics", "Technology", "Science", "Digital Literacy"],
      fitScore: avgTopScore,
      industryDemand: "Critical Scarcity",
    };
  }

  // 3. Combination: Research + Mathematics + Science + Aerospace Domain (Elena Rostova profile)
  if (hasResearch && hasMath && hasScience && domain === "Aerospace") {
    return {
      roleTitle: "Orbital Trajectory & Deep-Space Navigation Analyst",
      shortTitle: "Orbital Trajectory Analyst",
      sector: "Space Exploration & Astrodynamics",
      sectorColor: "#2255A4",
      hiringOrganizations: ["NASA", "ESA", "ISRO", "SpaceX", "Lockheed Martin"],
      matchReason: `Exceptional empirical scores across Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}), Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}), and Science (${topPillars.find(p=>p.pillar==="Science")?.ytd}) ideal for orbital mechanics, Lagrange points, and gravity assists.`,
      competencyTriplet: "Research + Maths + Science",
      requiredCompetencies: ["Research", "Mathematics", "Science", "Critical Thinking"],
      fitScore: avgTopScore,
      industryDemand: "Strategic Frontier",
    };
  }

  // 4. Combination: Research + Mathematics + Science + Space & Astro (Sunil Varma profile)
  if (hasResearch && hasMath && hasScience && domain === "Space & Astro") {
    return {
      roleTitle: "Astrophysical Data Scientist & Deep-Space Telemetry Specialist",
      shortTitle: "Astrophysical Data Scientist",
      sector: "Deep-Space Telemetry & Big Data",
      sectorColor: "#B65529",
      hiringOrganizations: ["ISRO", "NASA Goddard", "ESA", "SpaceX", "TATA (TIFR)"],
      matchReason: `Near-perfect dual scores in Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}) and Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) provide the mathematical foundation for deep-sky observation, pulsar signals, and gravitational wave data reduction.`,
      competencyTriplet: "Research + Maths + Science",
      requiredCompetencies: ["Research", "Mathematics", "Science", "Data Analysis"],
      fitScore: avgTopScore,
      industryDemand: "Strategic Frontier",
    };
  }

  // 5. Combination: Research + Technology + Mathematics (Li Wei profile)
  if (hasResearch && hasTech && hasMath) {
    return {
      roleTitle: "Satellite Telemetry & Remote Sensing AI Engineer",
      shortTitle: "Satellite Remote Sensing AI",
      sector: "Earth Observation & Geospatial AI",
      sectorColor: "#0E7C6F",
      hiringOrganizations: ["ISRO", "ESA", "Planet Labs", "SpaceX", "Airbus Defence"],
      matchReason: `Combines Research (${topPillars.find(p=>p.pillar==="Research")?.ytd}), Technology (${topPillars.find(p=>p.pillar==="Technology")?.ytd}), and Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) for multi-spectral Earth observation satellite analysis and spaceborne telemetry.`,
      competencyTriplet: "Research + Technology + Maths",
      requiredCompetencies: ["Research", "Technology", "Mathematics", "Critical Thinking"],
      fitScore: avgTopScore,
      industryDemand: "High Growth",
    };
  }

  // 6. Combination: Mathematics + Science + Arts in Aerospace (Aarav Sharma profile)
  if (hasMath && hasScience && hasArt && domain === "Aerospace") {
    return {
      roleTitle: "Aerodynamic Flight Modeling & Generative Aircraft Architect",
      shortTitle: "Aerodynamic Modeling Architect",
      sector: "Advanced Aerospace & CFD Design",
      sectorColor: "#41722E",
      hiringOrganizations: ["Airbus", "ISRO", "Tata Advanced Systems", "Boeing", "NASA"],
      matchReason: `Seamless synthesis of rigorous Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) with Science (${topPillars.find(p=>p.pillar==="Science")?.ytd}) and Arts design thinking (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) for computational fluid dynamics (CFD) and aerodynamic wing topology.`,
      competencyTriplet: "Maths + Science + Arts",
      requiredCompetencies: ["Mathematics", "Science", "Arts", "Creativity"],
      fitScore: avgTopScore,
      industryDemand: "Strategic Frontier",
    };
  }

  // 7. Combination: Resilience + Technology + Mathematics in Robotics (Marcus Vance profile)
  if (hasResilience && (hasTech || hasMath)) {
    return {
      roleTitle: "Extreme-Environment Roboticist & Fault-Tolerant Systems Engineer",
      shortTitle: "Extreme-Environment Roboticist",
      sector: "High-Reliability Robotics & Defense",
      sectorColor: "#1D6FA5",
      hiringOrganizations: ["Boston Dynamics", "NASA JPL", "Tesla", "ISRO", "Northrop Grumman"],
      matchReason: `High Resilience (${topPillars.find(p=>p.pillar==="Resilience")?.ytd}) with Technology (${topPillars.find(p=>p.pillar==="Technology")?.ytd || 90}) and Maths ensures rock-solid diagnostic troubleshooting under harsh space/industrial conditions.`,
      competencyTriplet: "Resilience + Technology + Maths",
      requiredCompetencies: ["Resilience", "Technology", "Troubleshooting", "Adaptability"],
      fitScore: avgTopScore,
      industryDemand: "Critical Scarcity",
    };
  }

  // 8. Combination: Entrepreneurship + Arts + Mathematics (Tariq Mansoor profile)
  if (hasEntrepreneurship && (hasArt || hasMath)) {
    return {
      roleTitle: "Commercial Space Architect & DeepTech Venture Lead",
      shortTitle: "DeepTech Space Venture Lead",
      sector: "NewSpace Commercial Strategy",
      sectorColor: "#9A6C10",
      hiringOrganizations: ["SpaceX", "Axiom Space", "ISRO In-SPACe", "Tata Aerospace", "Blue Origin"],
      matchReason: `Strategic blend of Entrepreneurship (${topPillars.find(p=>p.pillar==="Entrepreneurship")?.ytd}) and creative Arts (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) positions candidate to spearhead commercial orbital payloads and startup missions.`,
      competencyTriplet: "Entrepreneurship + Arts + Maths",
      requiredCompetencies: ["Entrepreneurship", "Decision Making", "Leadership", "Arts"],
      fitScore: avgTopScore,
      industryDemand: "High Growth",
    };
  }

  // 9. Combination: Arts + Research + Entrepreneurship in Robotics (Rohan Kulkarni profile)
  if (hasArt && hasEntrepreneurship) {
    return {
      roleTitle: "Assistive Robotics Product Designer & Social Tech Lead",
      shortTitle: "Assistive Robotics Product Lead",
      sector: "Humanitarian Robotics & MedTech",
      sectorColor: "#9A6C10",
      hiringOrganizations: ["Tata Motors", "Intuitive Surgical", "Siemens Healthineers", "SoftBank Robotics"],
      matchReason: `Combines Arts (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) and Entrepreneurship (${topPillars.find(p=>p.pillar==="Entrepreneurship")?.ytd}) with social impact to pioneer accessible assistive devices.`,
      competencyTriplet: "Arts + Entrepreneurship + Research",
      requiredCompetencies: ["Arts", "Entrepreneurship", "Empathy", "Creativity"],
      fitScore: avgTopScore,
      industryDemand: "High Growth",
    };
  }

  // 10. Combination: Arts + Resilience + Research in Robotics (Devanshi Patel profile)
  if (hasArt && hasResilience) {
    return {
      roleTitle: "Robotic Ergonomics & Human-Machine Interface (HMI) Specialist",
      shortTitle: "Robotic Ergonomics & HMI Specialist",
      sector: "Industrial Design & Cyber-Physical Systems",
      sectorColor: "#C23768",
      hiringOrganizations: ["Tesla", "Tata Elxsi", "Intuitive Surgical", "ABB Robotics", "Apple"],
      matchReason: `Blends Arts aesthetic sensibility (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) with Resilience troubleshooting (${topPillars.find(p=>p.pillar==="Resilience")?.ytd}) to build fail-safe human-robot operating consoles.`,
      competencyTriplet: "Arts + Resilience + Research",
      requiredCompetencies: ["Arts", "Resilience", "Human Factors", "Creativity"],
      fitScore: avgTopScore,
      industryDemand: "Critical Scarcity",
    };
  }

  // 11. Combination: Arts + Mathematics + Research in Aerospace (Zhang Tao profile)
  if (hasArt && hasMath) {
    return {
      roleTitle: "Computational Aerospace Structural Designer & Technical Illustrator",
      shortTitle: "Computational Aerospace Designer",
      sector: "Aerospace Visualization & Generative CAD",
      sectorColor: "#C23768",
      hiringOrganizations: ["Airbus", "COMAC", "Tata Advanced Systems", "DJI", "Siemens"],
      matchReason: `Bridges Mathematics (${topPillars.find(p=>p.pillar==="Mathematics")?.ytd}) and Arts design thinking (${topPillars.find(p=>p.pillar==="Arts")?.ytd}) to optimize lightweight structural aerospace components.`,
      competencyTriplet: "Arts + Maths + Research",
      requiredCompetencies: ["Arts", "Mathematics", "Research", "Design Thinking"],
      fitScore: avgTopScore,
      industryDemand: "High Growth",
    };
  }

  // Default Fallback: Systems Engineering & Innovation Architect
  return {
    roleTitle: `${domain} Systems Engineering & Innovation Specialist`,
    shortTitle: `${domain} Systems Engineer`,
    sector: "Interdisciplinary Engineering",
    sectorColor: "#2255A4",
    hiringOrganizations: ["ISRO", "NASA", "Tata Motors", "Tesla", "Siemens"],
    matchReason: `Demonstrates well-rounded multidisciplinary aptitude across ${topPillarNames.slice(0, 2).join(" and ")}, enabling systems-level integration and mission execution.`,
    competencyTriplet: `${topPillarNames[0]} + ${topPillarNames[1]}`,
    requiredCompetencies: [...topPillarNames.slice(0, 2), topSkillNames[0]],
    fitScore: avgTopScore,
    industryDemand: "High Growth",
  };
}
