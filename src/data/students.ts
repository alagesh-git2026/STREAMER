export interface ProjectRecord {
  projectName: string;
  date: string;
  score: number;
  sdgTags: string[];
}

export interface SkillScoreDetail {
  day0: number | null; // null if no diagnostic attended
  ytd: number;
  byProject: ProjectRecord[];
}

export interface BadgeRecord {
  name: string;
  tier: "Explorer" | "Builder" | "Innovator" | "Skill Mastery";
  dateEarned: string;
  relatedSkill?: string;
}

export interface DiagnosticInfo {
  attended: boolean;
  date?: string;
  levelTested?: string;
  questionsTotal?: number;
  questionsCorrect?: number;
  timeUsedMinutes?: number;
  timeAllowedMinutes: number;
  placedLevel?: "Explorer" | "Builder" | "Innovator";
}

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  domain: "Aerospace" | "Robotics" | "Space & Astro";
  centre: {
    city: string;
    country: string;
  };
  batch: string;
  academicYear?: string; // e.g. "2025-2026" (Aug to Mar cycle)
  enrolledDate: string; // ISO date "Day 0"
  diagnostic: DiagnosticInfo | null;
  skillScores: {
    "Conceptual Foundation": SkillScoreDetail;
    "Circuit Basics": SkillScoreDetail;
    "Data Analysis": SkillScoreDetail;
    "Awareness of Materials": SkillScoreDetail;
    "Equipment Handling": SkillScoreDetail;
    "Creativity / Design Thinking": SkillScoreDetail;
    "Mathematics (blended)": SkillScoreDetail;
    "Decision Making": SkillScoreDetail;
    "Troubleshooting": SkillScoreDetail;
    "Communication & Collaboration": SkillScoreDetail;
  };
  badges: BadgeRecord[];
}

export const STUDENTS_DATA: Student[] = [
  {
    id: "LOF-2026-001",
    name: "Aarav Sharma",
    age: 15,
    grade: "Grade 10",
    domain: "Aerospace",
    centre: { city: "Bengaluru", country: "India" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-15",
    diagnostic: {
      attended: true,
      date: "2025-08-20",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 26,
      timeUsedMinutes: 38,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 74,
        ytd: 92,
        byProject: [
          { projectName: "Sub-Orbital Airfoil Aerodynamics", date: "2025-10-12", score: 90, sdgTags: ["SDG 9"] },
          { projectName: "High-Altitude Sounding Glider", date: "2026-01-18", score: 94, sdgTags: ["SDG 13", "SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 68,
        ytd: 86,
        byProject: [
          { projectName: "Telemetry Sensor Bus Integration", date: "2025-11-05", score: 85, sdgTags: ["SDG 9"] },
          { projectName: "Avionics Power Regulation Module", date: "2026-02-14", score: 88, sdgTags: ["SDG 7"] }
        ]
      },
      "Data Analysis": {
        day0: 72,
        ytd: 90,
        byProject: [
          { projectName: "Wind Tunnel Pressure Mapping", date: "2025-10-25", score: 89, sdgTags: ["SDG 9"] },
          { projectName: "Flight Telemetry Packet Analysis", date: "2026-02-28", score: 92, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 65,
        ytd: 88,
        byProject: [
          { projectName: "Composite Wing Rib Tensile Testing", date: "2025-11-20", score: 86, sdgTags: ["SDG 12"] },
          { projectName: "Carbon Fiber Wing Spar Prototyping", date: "2026-01-22", score: 90, sdgTags: ["SDG 9"] }
        ]
      },
      "Equipment Handling": {
        day0: 60,
        ytd: 84,
        byProject: [
          { projectName: "CNC Hot-Wire Wing Slicing", date: "2025-09-30", score: 82, sdgTags: ["SDG 9"] },
          { projectName: "Vacuum Bagging Epoxy Resin Layup", date: "2026-02-05", score: 86, sdgTags: ["SDG 12"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 70,
        ytd: 91,
        byProject: [
          { projectName: "Bio-Inspired Morphing Wingtip Concept", date: "2025-12-10", score: 93, sdgTags: ["SDG 9", "SDG 13"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 78,
        ytd: 94,
        byProject: [
          { projectName: "Reynolds Number & Drag Polar Matrix", date: "2025-11-15", score: 92, sdgTags: ["SDG 4"] },
          { projectName: "Glide Slope Vector Trigonometry", date: "2026-01-30", score: 96, sdgTags: ["SDG 9"] }
        ]
      },
      "Decision Making": {
        day0: 62,
        ytd: 85,
        byProject: [
          { projectName: "Payload Mass vs Battery Endurance Triage", date: "2025-12-18", score: 85, sdgTags: ["SDG 7", "SDG 12"] }
        ]
      },
      "Troubleshooting": {
        day0: 64,
        ytd: 89,
        byProject: [
          { projectName: "Elevon Flutter Damping & In-Flight Recovery", date: "2026-02-10", score: 91, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 88,
        byProject: [
          { projectName: "Aerospace Design Review Presentation", date: "2026-03-02", score: 88, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Aerodynamics Pioneer", tier: "Builder", dateEarned: "2025-11-15", relatedSkill: "Conceptual Foundation" },
      { name: "Wind Tunnel Analyst", tier: "Skill Mastery", dateEarned: "2026-01-20", relatedSkill: "Data Analysis" },
      { name: "Composite Craftsman", tier: "Innovator", dateEarned: "2026-02-25", relatedSkill: "Equipment Handling" }
    ]
  },
  {
    id: "LOF-2026-002",
    name: "Mei-Ling Chen",
    age: 16,
    grade: "Grade 11",
    domain: "Robotics",
    centre: { city: "Shanghai", country: "China" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-10",
    diagnostic: {
      attended: true,
      date: "2025-08-15",
      levelTested: "Innovator Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 28,
      timeUsedMinutes: 41,
      timeAllowedMinutes: 45,
      placedLevel: "Innovator"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 82,
        ytd: 95,
        byProject: [
          { projectName: "Forward Kinematics 6-DoF Arm", date: "2025-10-15", score: 96, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 85,
        ytd: 96,
        byProject: [
          { projectName: "H-Bridge Optoisolated Motor Controller", date: "2025-11-12", score: 95, sdgTags: ["SDG 9", "SDG 7"] },
          { projectName: "CAN-Bus Distributed Actuator Node", date: "2026-02-18", score: 98, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 80,
        ytd: 92,
        byProject: [
          { projectName: "Optical Flow Sensor Odometry Drift Study", date: "2025-12-05", score: 92, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Awareness of Materials": {
        day0: 74,
        ytd: 87,
        byProject: [
          { projectName: "PETG vs Polycarbonate Gear Stress Analysis", date: "2025-11-28", score: 88, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 78,
        ytd: 90,
        byProject: [
          { projectName: "SMD Soldering 0603 Surface Mount Hub", date: "2025-10-30", score: 91, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 81,
        ytd: 94,
        byProject: [
          { projectName: "Soft-Gripper Compliant Waste Sorting End-Effector", date: "2026-01-14", score: 95, sdgTags: ["SDG 12", "SDG 11"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 88,
        ytd: 98,
        byProject: [
          { projectName: "Jacobian Matrix Inverse Kinematics Solver", date: "2025-12-20", score: 99, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      },
      "Decision Making": {
        day0: 75,
        ytd: 89,
        byProject: [
          { projectName: "Autonomous Pathfinding Cost vs Latency Tradeoff", date: "2026-02-04", score: 90, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Troubleshooting": {
        day0: 82,
        ytd: 94,
        byProject: [
          { projectName: "Logic Analyzer SPI Bus Decoupling Debug", date: "2026-01-28", score: 95, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 91,
        byProject: [
          { projectName: "International Robotics Symposium Demo", date: "2026-02-22", score: 92, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      }
    },
    badges: [
      { name: "Master of Kinematics", tier: "Innovator", dateEarned: "2025-10-25", relatedSkill: "Conceptual Foundation" },
      { name: "SMD Precision Artisan", tier: "Skill Mastery", dateEarned: "2025-11-20", relatedSkill: "Equipment Handling" },
      { name: "Autonomous Architect", tier: "Innovator", dateEarned: "2026-02-15", relatedSkill: "Circuit Basics" }
    ]
  },
  {
    id: "LOF-2026-003",
    name: "Zayd Al-Maktoum",
    age: 14,
    grade: "Grade 9",
    domain: "Space & Astro",
    centre: { city: "Dubai", country: "UAE" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-01",
    diagnostic: {
      attended: true,
      date: "2025-09-05",
      levelTested: "Explorer Entry Diagnostic",
      questionsTotal: 25,
      questionsCorrect: 19,
      timeUsedMinutes: 34,
      timeAllowedMinutes: 45,
      placedLevel: "Explorer"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 58,
        ytd: 82,
        byProject: [
          { projectName: "Mars Solar Radiation Shielding Simulation", date: "2025-11-10", score: 81, sdgTags: ["SDG 7", "SDG 9"] },
          { projectName: "Lagrange Point Orbital Mechanics", date: "2026-01-19", score: 84, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 52,
        ytd: 78,
        byProject: [
          { projectName: "CubeSat Photovoltaic MPPT Array", date: "2025-11-25", score: 79, sdgTags: ["SDG 7"] }
        ]
      },
      "Data Analysis": {
        day0: 64,
        ytd: 86,
        byProject: [
          { projectName: "Exoplanet Transit Lightcurve Photometry", date: "2025-12-15", score: 87, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 48,
        ytd: 75,
        byProject: [
          { projectName: "Aerogel Thermal Insulation Prototype", date: "2025-10-30", score: 76, sdgTags: ["SDG 9", "SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 50,
        ytd: 74,
        byProject: [
          { projectName: "Optical Telescope Collimation & Alignment", date: "2025-10-14", score: 75, sdgTags: ["SDG 4"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 72,
        ytd: 90,
        byProject: [
          { projectName: "In-Situ Martian Regolith Greenhouse Concept", date: "2026-02-12", score: 92, sdgTags: ["SDG 11", "SDG 13"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 61,
        ytd: 83,
        byProject: [
          { projectName: "Hohmann Transfer Delta-V Calculations", date: "2025-12-22", score: 84, sdgTags: ["SDG 9"] }
        ]
      },
      "Decision Making": {
        day0: 55,
        ytd: 79,
        byProject: [
          { projectName: "Deep Space Comm Window Scheduling", date: "2026-01-27", score: 80, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 54,
        ytd: 80,
        byProject: [
          { projectName: "Star Tracker Calibration Star-Field Noise Filter", date: "2026-02-17", score: 82, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 85,
        byProject: [
          { projectName: "Youth Space Mission Briefing", date: "2026-02-28", score: 86, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Stargazer Explorer", tier: "Explorer", dateEarned: "2025-09-30", relatedSkill: "Conceptual Foundation" },
      { name: "Bio-Dome Architect", tier: "Builder", dateEarned: "2026-02-18", relatedSkill: "Creativity / Design Thinking" }
    ]
  },
  {
    id: "LOF-2026-004",
    name: "Elena Rostova",
    age: 17,
    grade: "Grade 12",
    domain: "Aerospace",
    centre: { city: "Austin", country: "USA" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-01",
    diagnostic: {
      attended: true,
      date: "2025-08-08",
      levelTested: "Innovator Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 29,
      timeUsedMinutes: 37,
      timeAllowedMinutes: 45,
      placedLevel: "Innovator"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 86,
        ytd: 97,
        byProject: [
          { projectName: "Supersonic Shockwave Mitigation Aerospike", date: "2025-10-18", score: 98, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 78,
        ytd: 92,
        byProject: [
          { projectName: "Redundant Pyro-Ignition Sequencer", date: "2025-11-14", score: 93, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 88,
        ytd: 99,
        byProject: [
          { projectName: "Fast Fourier Transform Vibration Telemetry", date: "2025-12-04", score: 100, sdgTags: ["SDG 9", "SDG 11"] },
          { projectName: "Pitot Static Calibration Polynomial Fit", date: "2026-01-25", score: 98, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 82,
        ytd: 94,
        byProject: [
          { projectName: "Inconel 718 Rocket Nozzle Thermal Creep Test", date: "2025-11-22", score: 95, sdgTags: ["SDG 12", "SDG 9"] }
        ]
      },
      "Equipment Handling": {
        day0: 80,
        ytd: 93,
        byProject: [
          { projectName: "Direct Metal Laser Sintering 3D Print Setup", date: "2025-10-28", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 76,
        ytd: 91,
        byProject: [
          { projectName: "Deployable Grid Fin Geometry Optimization", date: "2026-01-10", score: 92, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 90,
        ytd: 98,
        byProject: [
          { projectName: "Tsiolkovsky Multi-Stage Trajectory Differential", date: "2025-12-18", score: 99, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      },
      "Decision Making": {
        day0: 84,
        ytd: 95,
        byProject: [
          { projectName: "Launch Abort Window Risk Assessment", date: "2026-02-08", score: 96, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 85,
        ytd: 96,
        byProject: [
          { projectName: "Cold Gas Thruster Valve Stiction Resolution", date: "2026-02-24", score: 97, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 94,
        byProject: [
          { projectName: "Aerospace Industry Pitch to Defense Contractors", date: "2026-03-01", score: 95, sdgTags: ["SDG 9", "SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Propulsion Specialist", tier: "Innovator", dateEarned: "2025-10-30", relatedSkill: "Conceptual Foundation" },
      { name: "Data Titan", tier: "Skill Mastery", dateEarned: "2025-12-10", relatedSkill: "Data Analysis" },
      { name: "Flight Director Lead", tier: "Innovator", dateEarned: "2026-02-12", relatedSkill: "Decision Making" }
    ]
  },
  {
    id: "LOF-2026-005",
    name: "Rohan Kulkarni",
    age: 13,
    grade: "Grade 8",
    domain: "Robotics",
    centre: { city: "New Delhi", country: "India" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-10",
    diagnostic: null, // NO DIAGNOSTIC ON FILE (Trainer Placement)
    skillScores: {
      "Conceptual Foundation": {
        day0: null,
        ytd: 76,
        byProject: [
          { projectName: "Smart Irrigation Soil Moisture Robot", date: "2025-11-08", score: 77, sdgTags: ["SDG 11", "SDG 13"] }
        ]
      },
      "Circuit Basics": {
        day0: null,
        ytd: 73,
        byProject: [
          { projectName: "Relay Driver Pump Control Circuit", date: "2025-11-22", score: 74, sdgTags: ["SDG 7"] }
        ]
      },
      "Data Analysis": {
        day0: null,
        ytd: 79,
        byProject: [
          { projectName: "Soil Evapotranspiration Diurnal Curves", date: "2025-12-14", score: 81, sdgTags: ["SDG 13", "SDG 12"] }
        ]
      },
      "Awareness of Materials": {
        day0: null,
        ytd: 70,
        byProject: [
          { projectName: "Waterproof IP67 Enclosure Silicone Sealing", date: "2025-10-25", score: 72, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: null,
        ytd: 72,
        byProject: [
          { projectName: "Benchtop Power Supply & Digital Multimeter Usage", date: "2025-10-10", score: 73, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: null,
        ytd: 84,
        byProject: [
          { projectName: "Modular Track Chassis for Muddy Farmland", date: "2026-01-16", score: 86, sdgTags: ["SDG 11", "SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: null,
        ytd: 75,
        byProject: [
          { projectName: "Flow Rate Volumetric Water Delivery Formula", date: "2025-12-02", score: 76, sdgTags: ["SDG 12"] }
        ]
      },
      "Decision Making": {
        day0: null,
        ytd: 78,
        byProject: [
          { projectName: "Battery Swapping vs Fixed Solar Panel Tradeoff", date: "2026-01-29", score: 79, sdgTags: ["SDG 7"] }
        ]
      },
      "Troubleshooting": {
        day0: null,
        ytd: 77,
        byProject: [
          { projectName: "Analog Sensor Ground Loop Hum Elimination", date: "2026-02-11", score: 79, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 82,
        byProject: [
          { projectName: "Agri-Tech Community Showcase", date: "2026-02-26", score: 83, sdgTags: ["SDG 4", "SDG 11"] }
        ]
      }
    },
    badges: [
      { name: "Agri-Bot Creator", tier: "Builder", dateEarned: "2025-12-18", relatedSkill: "Creativity / Design Thinking" },
      { name: "Green Tech Champion", tier: "Explorer", dateEarned: "2026-01-20", relatedSkill: "Decision Making" }
    ]
  },
  {
    id: "LOF-2026-006",
    name: "Fatima Al-Nuaimi",
    age: 15,
    grade: "Grade 10",
    domain: "Space & Astro",
    centre: { city: "Dubai", country: "UAE" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-22",
    diagnostic: {
      attended: true,
      date: "2025-08-28",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 28,
      questionsCorrect: 24,
      timeUsedMinutes: 39,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 71,
        ytd: 89,
        byProject: [
          { projectName: "Lunar South Pole Water Ice Spectroscopy", date: "2025-11-04", score: 89, sdgTags: ["SDG 9", "SDG 13"] }
        ]
      },
      "Circuit Basics": {
        day0: 64,
        ytd: 84,
        byProject: [
          { projectName: "Cryogenic Thermistor Readout Circuit", date: "2025-11-19", score: 85, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 76,
        ytd: 93,
        byProject: [
          { projectName: "Hyperspectral Mineral Mapping Classification", date: "2025-12-12", score: 94, sdgTags: ["SDG 9", "SDG 12"] }
        ]
      },
      "Awareness of Materials": {
        day0: 68,
        ytd: 85,
        byProject: [
          { projectName: "Multilayer Insulation (MLI) Blanket Fabrication", date: "2025-12-28", score: 87, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 66,
        ytd: 86,
        byProject: [
          { projectName: "Thermal Vacuum Chamber Test Operation", date: "2026-01-20", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 79,
        ytd: 92,
        byProject: [
          { projectName: "Deployable Lunar Drill Rig Mechanism", date: "2026-02-05", score: 93, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 75,
        ytd: 91,
        byProject: [
          { projectName: "Blackbody Radiation Planck Curves Calculation", date: "2026-01-11", score: 92, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 70,
        ytd: 88,
        byProject: [
          { projectName: "Spectrometer Resolution vs Thermal Margin Triage", date: "2026-02-14", score: 89, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 69,
        ytd: 87,
        byProject: [
          { projectName: "Dark Current Baseline Subtraction Calibration", date: "2026-02-23", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 90,
        byProject: [
          { projectName: "UAE Hope Mars Probe Commemoration Panel", date: "2026-02-28", score: 91, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      }
    },
    badges: [
      { name: "Spectroscopy Lead", tier: "Builder", dateEarned: "2025-12-15", relatedSkill: "Data Analysis" },
      { name: "Thermal Vacuum Specialist", tier: "Innovator", dateEarned: "2026-01-25", relatedSkill: "Equipment Handling" }
    ]
  },
  {
    id: "LOF-2026-007",
    name: "Marcus Vance",
    age: 16,
    grade: "Grade 11",
    domain: "Robotics",
    centre: { city: "Austin", country: "USA" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-05",
    diagnostic: {
      attended: true,
      date: "2025-08-12",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 25,
      timeUsedMinutes: 40,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 73,
        ytd: 89,
        byProject: [
          { projectName: "PID Feedback Loop Tuning for Line Tracer", date: "2025-10-19", score: 89, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 77,
        ytd: 91,
        byProject: [
          { projectName: "Quadrature Encoder Interface PCB", date: "2025-11-16", score: 92, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 70,
        ytd: 88,
        byProject: [
          { projectName: "Step Response Overshoot & Settling Time Analysis", date: "2025-12-08", score: 90, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 75,
        ytd: 86,
        byProject: [
          { projectName: "Anodized 6061 Aluminum Chassis Milling", date: "2025-11-30", score: 87, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 79,
        ytd: 92,
        byProject: [
          { projectName: "Precision Drill Press & Tap Set Threading", date: "2025-10-22", score: 93, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 68,
        ytd: 85,
        byProject: [
          { projectName: "Quick-Release Swappable Sensor Payload Bay", date: "2026-01-18", score: 86, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 74,
        ytd: 90,
        byProject: [
          { projectName: "Differential Drive Velocity Vector Matrix", date: "2025-12-21", score: 91, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 71,
        ytd: 86,
        byProject: [
          { projectName: "Motor Sizing Torque vs RPM Gear Ratio Selection", date: "2026-01-31", score: 87, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 81,
        ytd: 93,
        byProject: [
          { projectName: "Oscilloscope Ground Loop Noise Elimination", date: "2026-02-19", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 87,
        byProject: [
          { projectName: "First Tech Challenge Strategy Presentation", date: "2026-02-27", score: 88, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Precision Machinist", tier: "Builder", dateEarned: "2025-11-05", relatedSkill: "Equipment Handling" },
      { name: "Control Theory Specialist", tier: "Innovator", dateEarned: "2026-01-20", relatedSkill: "Conceptual Foundation" }
    ]
  },
  {
    id: "LOF-2026-008",
    name: "Ananya Iyer",
    age: 14,
    grade: "Grade 9",
    domain: "Aerospace",
    centre: { city: "Bengaluru", country: "India" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-05",
    diagnostic: {
      attended: true,
      date: "2025-09-12",
      levelTested: "Explorer Entry Diagnostic",
      questionsTotal: 25,
      questionsCorrect: 21,
      timeUsedMinutes: 31,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 64,
        ytd: 84,
        byProject: [
          { projectName: "CanSat Atmospheric Pressure Profiler", date: "2025-11-12", score: 85, sdgTags: ["SDG 13"] }
        ]
      },
      "Circuit Basics": {
        day0: 60,
        ytd: 80,
        byProject: [
          { projectName: "BMP280 Barometer I2C Interfacing", date: "2025-11-28", score: 81, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 71,
        ytd: 88,
        byProject: [
          { projectName: "Tropospheric Lapse Rate Temperature Graphing", date: "2025-12-16", score: 89, sdgTags: ["SDG 13", "SDG 4"] }
        ]
      },
      "Awareness of Materials": {
        day0: 59,
        ytd: 82,
        byProject: [
          { projectName: "Impact-Resistant PLA-CF CanSat Outer Shell", date: "2026-01-08", score: 83, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 58,
        ytd: 79,
        byProject: [
          { projectName: "Parachute Deployment Rigging & Ripstop Nylon", date: "2025-10-31", score: 80, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 77,
        ytd: 93,
        byProject: [
          { projectName: "Foldable Cruciform Parachute Aerodynamic Descent", date: "2026-01-24", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 69,
        ytd: 86,
        byProject: [
          { projectName: "Terminal Descent Velocity Quadratic Drag Equation", date: "2025-12-22", score: 87, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 62,
        ytd: 81,
        byProject: [
          { projectName: "Descent Rate vs Impact G-Force Tradeoff", date: "2026-02-09", score: 83, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 63,
        ytd: 83,
        byProject: [
          { projectName: "Barometer Altitude Zero Drift Recalibration", date: "2026-02-20", score: 85, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 89,
        byProject: [
          { projectName: "Indian Space Science Student Conclave", date: "2026-03-03", score: 90, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "CanSat Innovator", tier: "Builder", dateEarned: "2025-12-01", relatedSkill: "Creativity / Design Thinking" },
      { name: "Atmospheric Analyst", tier: "Skill Mastery", dateEarned: "2026-01-15", relatedSkill: "Data Analysis" }
    ]
  },
  {
    id: "LOF-2026-009",
    name: "Li Wei",
    age: 15,
    grade: "Grade 10",
    domain: "Space & Astro",
    centre: { city: "Shanghai", country: "China" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-18",
    diagnostic: {
      attended: true,
      date: "2025-08-25",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 28,
      questionsCorrect: 26,
      timeUsedMinutes: 36,
      timeAllowedMinutes: 45,
      placedLevel: "Innovator"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 79,
        ytd: 93,
        byProject: [
          { projectName: "Radio Astronomy 21cm Hydrogen Line Antenna", date: "2025-10-24", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 82,
        ytd: 94,
        byProject: [
          { projectName: "Low Noise Amplifier (LNA) RF Circuit", date: "2025-11-20", score: 95, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 85,
        ytd: 97,
        byProject: [
          { projectName: "Galactic Rotation Curve Doppler Shift Analysis", date: "2025-12-18", score: 98, sdgTags: ["SDG 9", "SDG 4"] }
        ]
      },
      "Awareness of Materials": {
        day0: 71,
        ytd: 86,
        byProject: [
          { projectName: "Parabolic Dish Aluminum Mesh Reflectivity", date: "2025-11-05", score: 87, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 75,
        ytd: 89,
        byProject: [
          { projectName: "SDR Software Defined Radio Tuning & Calibration", date: "2025-10-14", score: 90, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 74,
        ytd: 88,
        byProject: [
          { projectName: "Helical Feed Horn Design for Rooftop Observatory", date: "2026-01-15", score: 89, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 86,
        ytd: 96,
        byProject: [
          { projectName: "Fourier Transform Frequency Domain Signal Isolation", date: "2025-12-28", score: 97, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 76,
        ytd: 90,
        byProject: [
          { projectName: "RFI Noise Filter Threshold Sensitivity Setting", date: "2026-02-02", score: 91, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 80,
        ytd: 92,
        byProject: [
          { projectName: "Coaxial Cable Impedance Mismatch Reflection Debug", date: "2026-02-18", score: 93, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 87,
        byProject: [
          { projectName: "Shanghai Young Scientists Astro-Colloquium", date: "2026-02-25", score: 88, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Radio Astronomer", tier: "Innovator", dateEarned: "2025-11-30", relatedSkill: "Conceptual Foundation" },
      { name: "RF Circuit Virtuoso", tier: "Skill Mastery", dateEarned: "2025-12-22", relatedSkill: "Circuit Basics" },
      { name: "Signal Processing Ace", tier: "Innovator", dateEarned: "2026-01-28", relatedSkill: "Data Analysis" }
    ]
  },
  {
    id: "LOF-2026-010",
    name: "Devanshi Patel",
    age: 13,
    grade: "Grade 8",
    domain: "Robotics",
    centre: { city: "New Delhi", country: "India" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-15",
    diagnostic: {
      attended: true,
      date: "2025-09-20",
      levelTested: "Explorer Entry Diagnostic",
      questionsTotal: 25,
      questionsCorrect: 18,
      timeUsedMinutes: 33,
      timeAllowedMinutes: 45,
      placedLevel: "Explorer"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 55,
        ytd: 77,
        byProject: [
          { projectName: "Ultrasonic Obstacle Avoider Rover", date: "2025-11-15", score: 78, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Circuit Basics": {
        day0: 52,
        ytd: 75,
        byProject: [
          { projectName: "Breadboard Servo Wiring & Voltage Drops", date: "2025-11-29", score: 76, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 58,
        ytd: 78,
        byProject: [
          { projectName: "Sonar Ping Reflection Distance Variance", date: "2025-12-20", score: 80, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 50,
        ytd: 72,
        byProject: [
          { projectName: "Laser-Cut Acrylic vs Wooden Chassis Weight", date: "2025-10-28", score: 73, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 54,
        ytd: 76,
        byProject: [
          { projectName: "Wire Stripping, Crimping & Heat-Shrinking", date: "2025-10-15", score: 77, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 68,
        ytd: 86,
        byProject: [
          { projectName: "Bionic Spider Hexapod Walking Gait", date: "2026-01-22", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 59,
        ytd: 78,
        byProject: [
          { projectName: "Angular Trigonometry of Servo Arm Linkage", date: "2026-01-08", score: 79, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 53,
        ytd: 74,
        byProject: [
          { projectName: "Battery Runtime vs Payload Weight Estimation", date: "2026-02-05", score: 75, sdgTags: ["SDG 7"] }
        ]
      },
      "Troubleshooting": {
        day0: 57,
        ytd: 81,
        byProject: [
          { projectName: "Servo Brownout Decoupling Capacitor Fix", date: "2026-02-21", score: 83, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 84,
        byProject: [
          { projectName: "Delhi Junior STEM Maker Fair", date: "2026-02-27", score: 85, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Hexapod Explorer", tier: "Explorer", dateEarned: "2025-10-18", relatedSkill: "Creativity / Design Thinking" },
      { name: "Hardware Wireman", tier: "Builder", dateEarned: "2026-01-12", relatedSkill: "Equipment Handling" }
    ]
  },
  {
    id: "LOF-2026-011",
    name: "Tariq Mansoor",
    age: 16,
    grade: "Grade 11",
    domain: "Aerospace",
    centre: { city: "Dubai", country: "UAE" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-14",
    diagnostic: {
      attended: true,
      date: "2025-08-21",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 27,
      timeUsedMinutes: 38,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 76,
        ytd: 91,
        byProject: [
          { projectName: "VTOL Tilt-Rotor Transition Aerodynamics", date: "2025-10-29", score: 92, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Circuit Basics": {
        day0: 72,
        ytd: 89,
        byProject: [
          { projectName: "BLDC Electronic Speed Controller Firmware Timing", date: "2025-11-21", score: 90, sdgTags: ["SDG 7"] }
        ]
      },
      "Data Analysis": {
        day0: 74,
        ytd: 91,
        byProject: [
          { projectName: "Thrust-to-Weight Dynamometer Bench Tests", date: "2025-12-14", score: 92, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 70,
        ytd: 87,
        byProject: [
          { projectName: "Titanium Fasteners vs Stainless Steel Stress", date: "2025-12-02", score: 88, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 73,
        ytd: 88,
        byProject: [
          { projectName: "Dynamic Propeller Balancing Rig", date: "2025-10-12", score: 89, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 82,
        ytd: 94,
        byProject: [
          { projectName: "Autonomous Drone Medical Delivery Box", date: "2026-01-22", score: 95, sdgTags: ["SDG 11", "SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 78,
        ytd: 92,
        byProject: [
          { projectName: "Hover Power Disk Actuator Momentum Theory", date: "2026-01-05", score: 93, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 80,
        ytd: 93,
        byProject: [
          { projectName: "Emergency Auto-Rotation vs Parachute Eject", date: "2026-02-11", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 77,
        ytd: 90,
        byProject: [
          { projectName: "Gyroscope Gyro-Drift Temperature Compensation", date: "2026-02-18", score: 91, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 92,
        byProject: [
          { projectName: "Gulf Aviation Future Wings Expo", date: "2026-03-01", score: 93, sdgTags: ["SDG 4", "SDG 11"] }
        ]
      }
    },
    badges: [
      { name: "VTOL Architect", tier: "Innovator", dateEarned: "2025-11-18", relatedSkill: "Conceptual Foundation" },
      { name: "Urban Air Mobility Pioneer", tier: "Innovator", dateEarned: "2026-02-01", relatedSkill: "Creativity / Design Thinking" }
    ]
  },
  {
    id: "LOF-2026-012",
    name: "Chloe Jenkins",
    age: 15,
    grade: "Grade 10",
    domain: "Robotics",
    centre: { city: "Austin", country: "USA" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-02",
    diagnostic: null, // NO DIAGNOSTIC ON FILE (Trainer Assessment)
    skillScores: {
      "Conceptual Foundation": {
        day0: null,
        ytd: 86,
        byProject: [
          { projectName: "Computer Vision Edge Detection Camera", date: "2025-11-11", score: 87, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: null,
        ytd: 84,
        byProject: [
          { projectName: "MIPI CSI Camera Interface Level Shifter", date: "2025-11-26", score: 85, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: null,
        ytd: 92,
        byProject: [
          { projectName: "Confusion Matrix Object Classification Metrics", date: "2025-12-18", score: 93, sdgTags: ["SDG 9", "SDG 4"] }
        ]
      },
      "Awareness of Materials": {
        day0: null,
        ytd: 80,
        byProject: [
          { projectName: "Heat Sink Copper Thermal Conductivity Testing", date: "2025-12-05", score: 81, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: null,
        ytd: 82,
        byProject: [
          { projectName: "Micro-soldering Ribbon Cable Connectors", date: "2025-10-20", score: 83, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: null,
        ytd: 93,
        byProject: [
          { projectName: "AI Guide-Dog Robot for Visually Impaired", date: "2026-01-20", score: 95, sdgTags: ["SDG 11", "SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: null,
        ytd: 89,
        byProject: [
          { projectName: "Convolutional Kernel Matrix Multiplication", date: "2026-01-06", score: 90, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: null,
        ytd: 87,
        byProject: [
          { projectName: "Model Quantization INT8 vs FP16 Frame Rate", date: "2026-02-09", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: null,
        ytd: 88,
        byProject: [
          { projectName: "Thermal Throttling Fan PWM Tuning", date: "2026-02-22", score: 89, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 91,
        byProject: [
          { projectName: "Texas Inclusive Robotics Forum", date: "2026-03-02", score: 92, sdgTags: ["SDG 4", "SDG 11"] }
        ]
      }
    },
    badges: [
      { name: "Computer Vision Prodigy", tier: "Builder", dateEarned: "2025-12-10", relatedSkill: "Data Analysis" },
      { name: "Accessibility Innovator", tier: "Innovator", dateEarned: "2026-02-14", relatedSkill: "Creativity / Design Thinking" }
    ]
  },
  {
    id: "LOF-2026-013",
    name: "Sunil Varma",
    age: 17,
    grade: "Grade 12",
    domain: "Space & Astro",
    centre: { city: "Bengaluru", country: "India" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-01",
    diagnostic: {
      attended: true,
      date: "2025-08-07",
      levelTested: "Innovator Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 29,
      timeUsedMinutes: 35,
      timeAllowedMinutes: 45,
      placedLevel: "Innovator"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 89,
        ytd: 98,
        byProject: [
          { projectName: "Ion Propulsion Hall Effect Thruster Plasma Sim", date: "2025-10-15", score: 99, sdgTags: ["SDG 9", "SDG 7"] }
        ]
      },
      "Circuit Basics": {
        day0: 84,
        ytd: 95,
        byProject: [
          { projectName: "Kilovolt High-Voltage Plasma Anode Driver", date: "2025-11-18", score: 96, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 91,
        ytd: 99,
        byProject: [
          { projectName: "Langmuir Probe Plasma Density Diagnostics", date: "2025-12-12", score: 100, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 85,
        ytd: 96,
        byProject: [
          { projectName: "Boron Nitride Ceramic Channel Erosion Study", date: "2026-01-14", score: 97, sdgTags: ["SDG 12", "SDG 9"] }
        ]
      },
      "Equipment Handling": {
        day0: 87,
        ytd: 96,
        byProject: [
          { projectName: "High-Vacuum Turbomolecular Pump Station Operation", date: "2025-10-30", score: 97, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 80,
        ytd: 93,
        byProject: [
          { projectName: "Magnetic Cusp Confinement Geometry Refinement", date: "2026-01-28", score: 94, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 93,
        ytd: 99,
        byProject: [
          { projectName: "Maxwell-Boltzmann Electron Velocity Distribution", date: "2025-12-23", score: 100, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 86,
        ytd: 95,
        byProject: [
          { projectName: "Specific Impulse vs Power Budget Optimization", date: "2026-02-10", score: 96, sdgTags: ["SDG 7"] }
        ]
      },
      "Troubleshooting": {
        day0: 88,
        ytd: 97,
        byProject: [
          { projectName: "Anode Arc Discharge Quenching Protocol", date: "2026-02-24", score: 98, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 96,
        byProject: [
          { projectName: "ISRO Student Propulsion Symposium Paper", date: "2026-03-04", score: 97, sdgTags: ["SDG 4", "SDG 9"] }
        ]
      }
    },
    badges: [
      { name: "Plasma Physicist", tier: "Innovator", dateEarned: "2025-10-20", relatedSkill: "Conceptual Foundation" },
      { name: "Vacuum Chamber Specialist", tier: "Skill Mastery", dateEarned: "2025-12-05", relatedSkill: "Equipment Handling" },
      { name: "High-Voltage Engineer", tier: "Innovator", dateEarned: "2026-01-18", relatedSkill: "Circuit Basics" },
      { name: "Deep Space Propulsion Fellow", tier: "Skill Mastery", dateEarned: "2026-02-28", relatedSkill: "Decision Making" }
    ]
  },
  {
    id: "LOF-2026-014",
    name: "Zhang Tao",
    age: 14,
    grade: "Grade 9",
    domain: "Aerospace",
    centre: { city: "Shanghai", country: "China" },
    batch: "Beta-2026",
    enrolledDate: "2025-09-08",
    diagnostic: {
      attended: true,
      date: "2025-09-14",
      levelTested: "Explorer Entry Diagnostic",
      questionsTotal: 25,
      questionsCorrect: 20,
      timeUsedMinutes: 32,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 62,
        ytd: 83,
        byProject: [
          { projectName: "Glider Wing Aspect Ratio L/D Ratio Study", date: "2025-11-14", score: 84, sdgTags: ["SDG 9"] }
        ]
      },
      "Circuit Basics": {
        day0: 65,
        ytd: 82,
        byProject: [
          { projectName: "Solar Panel Battery Charging Regulator", date: "2025-11-30", score: 83, sdgTags: ["SDG 7"] }
        ]
      },
      "Data Analysis": {
        day0: 69,
        ytd: 87,
        byProject: [
          { projectName: "Glide Angle vs Payload Weight Matrix", date: "2025-12-21", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Awareness of Materials": {
        day0: 60,
        ytd: 81,
        byProject: [
          { projectName: "Balsa Wood Grain Directional Bending Strength", date: "2025-10-26", score: 82, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 64,
        ytd: 84,
        byProject: [
          { projectName: "X-Acto Precision Balsa Rib Carving", date: "2025-10-18", score: 85, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 75,
        ytd: 90,
        byProject: [
          { projectName: "Canard Wing Configuration for High Stall Margin", date: "2026-01-19", score: 92, sdgTags: ["SDG 9"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 70,
        ytd: 88,
        byProject: [
          { projectName: "Center of Gravity (CG) Neutral Point Distance", date: "2026-01-04", score: 89, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 63,
        ytd: 83,
        byProject: [
          { projectName: "Static Margin vs Pitch Agility Tradeoff", date: "2026-02-08", score: 84, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 67,
        ytd: 86,
        byProject: [
          { projectName: "Nose-Heavy Pitch Oscillation Trim Fix", date: "2026-02-23", score: 87, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 85,
        byProject: [
          { projectName: "East Asia Aero-Design Showcase", date: "2026-03-01", score: 86, sdgTags: ["SDG 4"] }
        ]
      }
    },
    badges: [
      { name: "Glider Crafter", tier: "Builder", dateEarned: "2025-11-20", relatedSkill: "Equipment Handling" },
      { name: "Canard Innovator", tier: "Builder", dateEarned: "2026-01-25", relatedSkill: "Creativity / Design Thinking" }
    ]
  },
  {
    id: "LOF-2026-015",
    name: "Sarah Jenkins",
    age: 16,
    grade: "Grade 11",
    domain: "Space & Astro",
    centre: { city: "Austin", country: "USA" },
    batch: "Alpha-2026",
    enrolledDate: "2025-08-11",
    diagnostic: {
      attended: true,
      date: "2025-08-17",
      levelTested: "Builder Entry Diagnostic",
      questionsTotal: 30,
      questionsCorrect: 26,
      timeUsedMinutes: 39,
      timeAllowedMinutes: 45,
      placedLevel: "Builder"
    },
    skillScores: {
      "Conceptual Foundation": {
        day0: 74,
        ytd: 90,
        byProject: [
          { projectName: "Orbital Debris Tracking Optical Sensor", date: "2025-10-22", score: 91, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Circuit Basics": {
        day0: 70,
        ytd: 87,
        byProject: [
          { projectName: "CMOS Image Sensor Low-Light Amplifier", date: "2025-11-17", score: 88, sdgTags: ["SDG 9"] }
        ]
      },
      "Data Analysis": {
        day0: 78,
        ytd: 93,
        byProject: [
          { projectName: "Streak Detection in Deep-Sky Astrophotography", date: "2025-12-14", score: 94, sdgTags: ["SDG 9", "SDG 11"] }
        ]
      },
      "Awareness of Materials": {
        day0: 67,
        ytd: 84,
        byProject: [
          { projectName: "Fused Silica Optical Window Thermal Stability", date: "2025-12-01", score: 85, sdgTags: ["SDG 12"] }
        ]
      },
      "Equipment Handling": {
        day0: 72,
        ytd: 88,
        byProject: [
          { projectName: "Equatorial Mount Polar Alignment Routine", date: "2025-10-15", score: 89, sdgTags: ["SDG 9"] }
        ]
      },
      "Creativity / Design Thinking": {
        day0: 81,
        ytd: 93,
        byProject: [
          { projectName: "Crowdsourced Satellite Streak Filter Algorithm", date: "2026-01-20", score: 94, sdgTags: ["SDG 9", "SDG 4"] }
        ]
      },
      "Mathematics (blended)": {
        day0: 79,
        ytd: 91,
        byProject: [
          { projectName: "Two-Line Element (TLE) Orbital Propagation Math", date: "2026-01-08", score: 92, sdgTags: ["SDG 4"] }
        ]
      },
      "Decision Making": {
        day0: 75,
        ytd: 89,
        byProject: [
          { projectName: "Integration Time vs Sensor Thermal Noise Tradeoff", date: "2026-02-12", score: 90, sdgTags: ["SDG 9"] }
        ]
      },
      "Troubleshooting": {
        day0: 76,
        ytd: 90,
        byProject: [
          { projectName: "CCD Hot Pixel Mapping & Bad Pixel Masking", date: "2026-02-21", score: 91, sdgTags: ["SDG 9"] }
        ]
      },
      "Communication & Collaboration": {
        day0: null,
        ytd: 92,
        byProject: [
          { projectName: "Dark & Quiet Skies Coalition Briefing", date: "2026-03-02", score: 93, sdgTags: ["SDG 4", "SDG 11"] }
        ]
      }
    },
    badges: [
      { name: "Orbital Tracker", tier: "Builder", dateEarned: "2025-11-25", relatedSkill: "Conceptual Foundation" },
      { name: "Astro-Data Pioneer", tier: "Innovator", dateEarned: "2026-01-18", relatedSkill: "Data Analysis" }
    ]
  }
];
