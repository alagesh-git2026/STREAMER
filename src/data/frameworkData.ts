export interface PillarRubricBand {
  name: "Emerging" | "Developing" | "Proficient" | "Advanced";
  range: [number, number];
  color: string;
  label: string;
  description: string;
}

export interface StreamerPillar {
  id: string;
  name: string;
  letter: string;
  color: string;
  focus: string;
  mappedSkills: string[];
  whatItChecksFor: string;
  whyStreamerBlindSpot?: string;
  exampleQuestion: {
    type: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rubricBands: PillarRubricBand[];
}

export interface RubricBand {
  name: "Emerging" | "Developing" | "Proficient" | "Advanced";
  range: [number, number];
  color: string;
  description: string;
}

export interface SDGInfo {
  id: string;
  number: number;
  name: string;
  color: string;
  description: string;
}

export const RUBRIC_BANDS: RubricBand[] = [
  {
    name: "Emerging",
    range: [0, 39],
    color: "#EF4444",
    description: "Still building foundational understanding; needs guided support"
  },
  {
    name: "Developing",
    range: [40, 64],
    color: "#F59E0B",
    description: "Applies the skill with some guidance; inconsistent independently"
  },
  {
    name: "Proficient",
    range: [65, 84],
    color: "#3B82F6",
    description: "Applies the skill independently and accurately in familiar project contexts"
  },
  {
    name: "Advanced",
    range: [85, 100],
    color: "#10B981",
    description: "Applies the skill independently in novel or complex contexts; can mentor peers"
  }
];

export const SDG_LIST: Record<string, SDGInfo> = {
  "SDG 4": {
    id: "SDG 4",
    number: 4,
    name: "Quality Education",
    color: "#C5192D",
    description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."
  },
  "SDG 7": {
    id: "SDG 7",
    number: 7,
    name: "Affordable & Clean Energy",
    color: "#FCC30B",
    description: "Ensure access to affordable, reliable, sustainable and modern energy for all."
  },
  "SDG 9": {
    id: "SDG 9",
    number: 9,
    name: "Industry, Innovation & Infrastructure",
    color: "#FD6925",
    description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation."
  },
  "SDG 11": {
    id: "SDG 11",
    number: 11,
    name: "Sustainable Cities & Communities",
    color: "#FD9D24",
    description: "Make cities and human settlements inclusive, safe, resilient and sustainable."
  },
  "SDG 12": {
    id: "SDG 12",
    number: 12,
    name: "Responsible Consumption & Production",
    color: "#BF8B2E",
    description: "Ensure sustainable consumption and production patterns."
  },
  "SDG 13": {
    id: "SDG 13",
    number: 13,
    name: "Climate Action",
    color: "#3F7E44",
    description: "Take urgent action to combat climate change and its impacts."
  }
};

export const STREAMER_PILLARS: StreamerPillar[] = [
  {
    id: "science",
    name: "Science",
    letter: "S",
    color: "#2255A4",
    focus: "Scientific Inquiry",
    mappedSkills: ["Conceptual Foundation"],
    whatItChecksFor: "Understanding how and why the world works through hands-on inquiry—empowering students to test natural principles and explain real phenomena rather than relying on rote memorization.",
    exampleQuestion: {
      type: "Textual / Reasoning",
      question: "Why does an atmospheric descent probe experience high thermal friction during re-entry?",
      options: [
        "Rapid compression of air molecules ahead of the heat shield",
        "Solar radiation intensifying in the upper stratosphere",
        "Gravitational pull directly heating the metallic hull",
        "Internal rocket propulsion ignition"
      ],
      correctIndex: 0,
      explanation: "Tests physical understanding of re-entry compression shock waves vs. simple friction."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Identifies Basic Concepts with Guidance",
        description: "Recalls elementary scientific terms when prompted; struggles to explain cause-and-effect or why a physical event occurs in a build."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Explains Principles in Guided Experiments",
        description: "Accurately describes observed outcomes during standard lab activities, but needs teacher cues to link observations to underlying physical laws."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Applies Scientific Laws to Predict Outcomes",
        description: "Independently applies scientific principles (e.g., gravity, friction, circuit load) to forecast build behavior and explain real phenomena accurately."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Formulates Hypotheses & Tests Edge Cases",
        description: "Independently constructs testable hypotheses in unfamiliar contexts, designs experiments to evaluate edge conditions, and articulates core theory to peers."
      }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    letter: "T",
    color: "#0E7C6F",
    focus: "Digital Fluency",
    mappedSkills: ["Circuit Basics"],
    whatItChecksFor: "Harnessing circuits, sensors, and digital electronics to bring ideas to life—equipping learners to build, code, and control smart systems that interact with their physical environment.",
    exampleQuestion: {
      type: "Pictorial / Logical Thinking",
      question: "In a sensor circuit with a pull-up resistor, what logic level is read when the tactile switch is pressed to ground?",
      options: [
        "LOW (0V)",
        "HIGH (5V)",
        "Floating / undefined",
        "Oscillating AC voltage"
      ],
      correctIndex: 0,
      explanation: "Tests circuit logic and hardware schematic comprehension."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Wires Components with Step-by-Step Help",
        description: "Follows pictorial wiring diagrams with direct support; needs help identifying component pins, polarities, or tracing power and ground loops."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Connects Standard Modules Independently",
        description: "Successfully wires common sensors, LEDs, and switches into microcontrollers, but requires assistance configuring software logic or pin signals."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Integrates Sensors & Hardware Accurately",
        description: "Reads schematic pinouts independently, verifies signal and voltage stability, and builds responsive digital systems without supervision."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Architects Complex Smart Systems & Protocols",
        description: "Configures advanced bus protocols (I2C/SPI), manages signal filtering and power distribution, and writes modular firmware for autonomous systems."
      }
    ]
  },
  {
    id: "research",
    name: "Research",
    letter: "R",
    color: "#B65529",
    focus: "Analytical Thinking",
    mappedSkills: ["Data Analysis"],
    whatItChecksFor: "Investigating questions systematically by gathering test data and spotting trends—teaching students to form hypotheses and base conclusions on real evidence rather than guesswork.",
    whyStreamerBlindSpot: "Traditional STEM teaches content but rarely tests whether a learner can independently investigate and draw a fair conclusion from their own data.",
    exampleQuestion: {
      type: "Graph / Data interpretation",
      question: "Across 4 test trials of an ultrasonic range sensor, trial 3 deviates by +45% while trials 1, 2, and 4 agree within ±2%. What is the most scientifically sound action?",
      options: [
        "Identify trial 3 as an anomaly, record environmental conditions, and run repeat trials",
        "Delete trial 3 immediately without documenting it",
        "Average trial 3 with the rest to balance the data",
        "Conclude the sensor has permanently failed"
      ],
      correctIndex: 0,
      explanation: "Evaluates empirical integrity, anomaly detection, and data-driven investigation."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Records Single Observations on Request",
        description: "Logs single isolated data points only when prompted; tends to accept first results without verifying repeatability across trials."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Conducts Repeated Trials with Tables",
        description: "Collects multi-trial data and logs numbers into structured tables, but requires guidance to calculate averages or identify measurement discrepancies."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Isolates Variables & Flags Data Outliers",
        description: "Controls experimental variables, spots unexpected data spikes or sensor errors, and plots clear trends to substantiate project conclusions."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Synthesizes Datasets to Drive Redesign",
        description: "Calculates margins of error across extensive datasets, disproves false correlations, and uses empirical data proof to direct project iterations."
      }
    ]
  },
  {
    id: "engineering",
    name: "Engineering",
    letter: "E",
    color: "#5A3FA0",
    focus: "Design & Prototyping",
    mappedSkills: ["Awareness of Materials", "Equipment Handling"],
    whatItChecksFor: "Designing, constructing, and testing physical prototypes—learning how to choose suitable materials for strength and weight, handle tools safely, and structurally solve real engineering challenges.",
    exampleQuestion: {
      type: "Material Selection / Safety Check",
      question: "Which material structure provides the highest stiffness-to-weight ratio for a lightweight drone arm subject to motor vibrations?",
      options: [
        "Carbon fiber composite tube",
        "Solid brass cylindrical rod",
        "Extruded mild steel angle",
        "High-density lead alloy"
      ],
      correctIndex: 0,
      explanation: "Checks physical properties trade-offs under dynamic engineering loads."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Assembles Pre-Cut Parts with Supervision",
        description: "Follows step-by-step assembly templates; struggles to select appropriate fasteners or assess structural strength and balance."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Constructs Working Frames with Basic Tools",
        description: "Handles hand tools safely and constructs functioning physical models, though assemblies may flex or require structural reinforcement under load."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Selects Optimal Materials & Fabricates Durable Builds",
        description: "Evaluates material trade-offs (acrylic vs. metal vs. 3D print), builds sturdy vibration-resistant structures, and follows workshop safety protocols."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Engineers High-Tolerance Custom Mechanisms",
        description: "Designs custom mechanical linkages and brackets, performs stress/clearance calculations, and optimizes physical components for lightweight efficiency."
      }
    ]
  },
  {
    id: "arts",
    name: "Arts",
    letter: "A",
    color: "#C23768",
    focus: "Aesthetic Design & Creativity",
    mappedSkills: ["Creativity / Design Thinking"],
    whatItChecksFor: "Designing the aesthetic form, exterior styling, and visual theme of projects, while taking on bonus creative challenges that stretch original thinking beyond the base technical requirements.",
    whyStreamerBlindSpot: "Technical labs often ignore aesthetic styling and creative ownership; STREAMER scores aesthetic casing design and bonus creative challenge mastery as essential competencies.",
    exampleQuestion: {
      type: "Aesthetic Design / Bonus Challenge",
      question: "After successfully wiring an obstacle-avoiding rover, a student accepts the 'Bonus Creative Challenge' to style its chassis for a Mars desert environment. Which design choice demonstrates the best integration of aesthetic styling and functional creativity?",
      options: [
        "Crafting a sleek aerodynamic dust-shield casing with high-contrast hazard striping and integrated sensor cutouts",
        "Leaving all wires exposed to prove the circuit is real",
        "Removing the obstacle sensors to make the chassis look simpler",
        "Gluing heavy decorative stones onto the rover frame"
      ],
      correctIndex: 0,
      explanation: "Evaluates project aesthetic styling, functional casing design, and proactive completion of bonus creative challenges."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Builds Raw Circuits Without Styling",
        description: "Delivers functional bare hardware with unmanaged loose wires; does not attempt aesthetic project casing or optional bonus creative challenges."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Applies Basic Theming with Encouragement",
        description: "Adds simple surface styling (stickers, standard colors, basic covers) and attempts suggested bonus challenge ideas when prompted by mentors."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Crafts Custom Casing & Completes Bonus Challenges",
        description: "Independently designs custom aesthetic enclosures with clean cable management, themed visual styling, and complete fulfillment of bonus creative prompts."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Innovates Signature Industrial & Visual Designs",
        description: "Synthesizes ergonomic form, theme identity, and dynamic visual indicators, exceeding bonus challenge goals with distinctive, original artistic flair."
      }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    letter: "M",
    color: "#41722E",
    focus: "Quantitative Logic",
    mappedSkills: ["Mathematics (blended)"],
    whatItChecksFor: "Applying numbers, measurements, and geometry to practical builds—transforming abstract formulas into an active superpower for calculation, precision, and data analysis.",
    exampleQuestion: {
      type: "Calculation-based",
      question: "If a CubeSat solar panel produces 4.8 Watts in direct sunlight and an orbital cycle has 60% sunlight and 40% eclipse, what is the average orbital power available?",
      options: [
        "2.88 Watts",
        "4.80 Watts",
        "1.92 Watts",
        "3.60 Watts"
      ],
      correctIndex: 0,
      explanation: "Formula: 4.8 W × 0.60 = 2.88 W. Tests proportional calculations in real aerospace constraints."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Computes Simple Arithmetic with Assistance",
        description: "Performs basic arithmetic with guided support; struggles with unit conversions (e.g. mm to cm, mA to A) or measuring geometric angles."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Applies Standard Formulas Accurately",
        description: "Calculates gear speed ratios, basic Ohm's law, and battery runtime when given predefined formulas and clean numerical values."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Solves Multi-Step Engineering Calculations",
        description: "Independently calculates geometric clearances, power consumption budgets, and gear torques to keep builds operating within safe tolerances."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Develops Mathematical Models & Simulates Systems",
        description: "Formulates algebraic equations to calibrate sensors dynamically, estimate trajectories, or model system trade-offs without prior prompting."
      }
    ]
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    letter: "E",
    color: "#9A6C10",
    focus: "Decision-Making & Impact Pitching",
    mappedSkills: ["Decision Making & Pitching"],
    whatItChecksFor: "Empowering students to take autonomous project decisions, evaluate real-world trade-offs, and pitch their creation with confidence to demonstrate the tangible, positive impact it delivers in the real world.",
    whyStreamerBlindSpot: "Traditional STEM measures whether a circuit or code functions in isolation, but fails to check whether a student can make strategic build decisions and persuasively pitch how their innovation solves a real-world problem.",
    exampleQuestion: {
      type: "Strategic Decision & Impact Pitch",
      question: "When pitching an autonomous flood-warning prototype to community stakeholders, which approach demonstrates the strongest decision-making and real-world impact?",
      options: [
        "Articulating the strategic choice of low-cost solar telemetry, demonstrating live alert speeds, and showing how it protects local households",
        "Listing only internal resistor values and raw code without explaining who benefits or how it prevents flood damage",
        "Claiming the system has zero limitations and will instantly eliminate all global weather risks",
        "Reading passively from a component datasheet without engaging the audience or explaining the build's purpose"
      ],
      correctIndex: 0,
      explanation: "Evaluates autonomous decision-making, stakeholder awareness, and pitching real-world impact with confidence."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Relies on Direct Guidance; Hesitant Project Sharing",
        description: "Relies entirely on teacher prompts to make project choices; struggles to explain why the build was created or pitch its purpose beyond reciting component names."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Makes Basic Choices; Delivers Guided Scripted Pitch",
        description: "Makes simple component and feature decisions with mentor cues; delivers a basic scripted presentation, but needs prompting to connect technical specs to real-world user benefits."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Owns Strategic Decisions; Delivers Confident Impact Pitch",
        description: "Independently justifies project trade-offs (features, materials, user needs) and delivers a confident, structured pitch clearly demonstrating how the prototype creates real-world impact."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Champions High-Impact Solutions; Inspires with Pitch Poise",
        description: "Makes visionary strategic decisions backed by user evidence; commands the room with compelling pitch storytelling, handles tough stakeholder questions with poise, and articulates measurable societal value."
      }
    ]
  },
  {
    id: "resilience",
    name: "Resilience",
    letter: "R",
    color: "#1D6FA5",
    focus: "Growth Mindset",
    mappedSkills: ["Troubleshooting"],
    whatItChecksFor: "Embracing setbacks with a calm, systematic problem-solving mindset—teaching students to troubleshoot errors step-by-step and view unexpected failures as valuable diagnostic clues to improve.",
    whyStreamerBlindSpot: "Conventional assessment rewards getting the right answer, not how a learner responds to getting it wrong — Resilience is the only pillar that scores recovery from failure itself.",
    exampleQuestion: {
      type: "Scenario / Troubleshooting",
      question: "An autonomous rover motor stops spinning unexpectedly during a live obstacle run. What is the systematic troubleshooting hierarchy?",
      options: [
        "Check power supply/connections → Verify motor driver control signal → Inspect mechanical gear jam",
        "Repeatedly hit the reset button until it spins",
        "Immediately replace the microcontroller board without checking voltage",
        "Assume code is faulty and delete the obstacle avoidance routine"
      ],
      correctIndex: 0,
      explanation: "Tests structured isolation of variables and diagnostic composure under failure."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Resets or Replaces Parts Blindly on Error",
        description: "Becomes frustrated when builds fail; repeatedly restarts or swaps components randomly without investigating what caused the breakdown."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Checks Obvious Faults Using a Guided List",
        description: "Tests common failure points (loose connections, flat batteries) using guided questions, but struggles when errors are non-obvious."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Isolates Root Causes Systematically",
        description: "Remains calm under failure; methodically isolates variables (Power → Signal → Code → Mechanics) to find and fix bugs independently."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Conducts Failure Post-Mortems & Hardens Builds",
        description: "Views failures as actionable data; documents root-cause fixes, stress-tests edge conditions to prevent repeat bugs, and mentors peers in debugging."
      }
    ]
  }
];

export const SKILL_MAPPINGS: {
  category: string;
  pillar: string;
  pillarColor: string;
  notes?: string;
}[] = [
  { category: "Conceptual Foundation", pillar: "Science", pillarColor: "#2255A4" },
  { category: "Circuit Basics", pillar: "Technology", pillarColor: "#0E7C6F" },
  { category: "Data Analysis", pillar: "Research", pillarColor: "#B65529" },
  { category: "Awareness of Materials", pillar: "Engineering", pillarColor: "#5A3FA0" },
  { category: "Equipment Handling", pillar: "Engineering", pillarColor: "#5A3FA0" },
  { category: "Creativity / Design Thinking", pillar: "Arts", pillarColor: "#C23768" },
  { category: "Mathematics (blended)", pillar: "Mathematics", pillarColor: "#41722E" },
  { category: "Decision Making", pillar: "Entrepreneurship", pillarColor: "#9A6C10" },
  { category: "Troubleshooting", pillar: "Resilience", pillarColor: "#1D6FA5" },
  { category: "Communication & Collaboration", pillar: "Portfolio Add-On", pillarColor: "#64748B", notes: "Assessed via project presentations only; not part of DSR test bank" }
];

export interface RearJustificationBullet {
  highlight: string;
  text: string;
}

export interface RearPillarRationale {
  id: "research" | "arts" | "entrepreneurship" | "resilience";
  letter: string;
  name: string;
  color: string;
  rearOrder: number; // 1 to 4
  rearBrakeTitle: string;
  brakeTag: string;
  prefixQuestion: string;
  justificationBullets: RearJustificationBullet[];
  withoutBrakeRisk: string;
  withBrakeOptimization: string;
  mappedCompetency: string;
  diagnosticSkill: string;
  stemLinkage: {
    stemDrive: string;
    brakeIntervention: string;
    streamerOutcome: string;
  };
}

export const REAR_PILLARS_DATA: RearPillarRationale[] = [
  {
    id: "research",
    letter: "R",
    name: "Research",
    color: "#B65529",
    rearOrder: 1,
    rearBrakeTitle: "The Empirical Telemetry Brake",
    brakeTag: "Research Brake",
    prefixQuestion: "Why is Research essential when we already have Science?",
    justificationBullets: [
      {
        highlight: "The Reality Check on Theory",
        text: "Science introduces abstract formulas on paper, but Research investigates whether those laws actually survive noisy, real-world physical friction and sensor noise."
      },
      {
        highlight: "Empirical Anomaly Detection",
        text: "Trains students to run multi-trial sweeps, isolate statistical anomalies, and identify sensor drift instead of cherry-picking one convenient run."
      },
      {
        highlight: "Evidence-First Integrity",
        text: "Eliminates guesswork and unsupported claims by teaching learners to never claim a solution works without repeatable empirical test data."
      }
    ],
    withoutBrakeRisk: "Rushing ahead on textbook assumptions and uncalibrated sensors, leading to catastrophic design failure during live testing.",
    withBrakeOptimization: "Calibrates engineering decisions with empirical proof, isolating signal from noise to guarantee repeatable, real-world reliability.",
    mappedCompetency: "Analytical Thinking",
    diagnosticSkill: "Data Analysis",
    stemLinkage: {
      stemDrive: "Science Theory",
      brakeIntervention: "Empirical Testing",
      streamerOutcome: "Verified Proof"
    }
  },
  {
    id: "arts",
    letter: "A",
    name: "Arts",
    color: "#C23768",
    rearOrder: 2,
    rearBrakeTitle: "The Aesthetic Design & Creative Bonus Brake",
    brakeTag: "Arts & Creativity Brake",
    prefixQuestion: "Why include Arts when a circuit or code already functions?",
    justificationBullets: [
      {
        highlight: "Aesthetic Project Customization",
        text: "Allows students to design the physical exterior, custom casing, and visual theme of each project—ensuring technical builds look deliberate, styled, and structurally housed rather than exposed wire nests."
      },
      {
        highlight: "Bonus Creative Challenges",
        text: "Pushes students beyond step-by-step assembly through open-ended bonus prompts that reward original thinking, custom feature additions, and artistic problem-solving."
      },
      {
        highlight: "Pride of Maker Artistry",
        text: "Transforms a generic classroom kit build into a personalized, show-stopping creation that students take genuine pride in presenting to teachers and parents."
      }
    ],
    withoutBrakeRisk: "Students stop the moment basic wiring conducts current, leaving fragile, unhoused wire nests and never exploring their own creative potential.",
    withBrakeOptimization: "Inspires pride of craftsmanship, motivating learners to style professional casings and tackle bonus creative challenges that develop true artistic originality.",
    mappedCompetency: "Aesthetic Design & Creativity",
    diagnosticSkill: "Creativity / Design Thinking",
    stemLinkage: {
      stemDrive: "Base Functional Build",
      brakeIntervention: "Aesthetics & Bonus Challenge",
      streamerOutcome: "Custom Masterpiece"
    }
  },
  {
    id: "entrepreneurship",
    letter: "E",
    name: "Entrepreneurship",
    color: "#9A6C10",
    rearOrder: 3,
    rearBrakeTitle: "The Decision-Making & Impact Pitch Brake",
    brakeTag: "Entrepreneurship Brake",
    prefixQuestion: "Why must builders master Decision-Making & Impact Pitching?",
    justificationBullets: [
      {
        highlight: "Autonomous Strategic Decision-Making",
        text: "Shifts students from passive kit-followers into active innovators who evaluate real-world trade-offs, choose which problems to solve, and take ownership of critical design directions."
      },
      {
        highlight: "Real-World Impact Grounding",
        text: "Bridges classroom electronics with societal relevance—ensuring students understand who their innovation serves, why it matters, and how it delivers measurable value in community contexts."
      },
      {
        highlight: "Confident Project Pitching",
        text: "Transforms makers into confident storytellers who can pitch their project with poise, articulate the 'why' behind their creation, and persuade audiences, teachers, and parents of its impact."
      }
    ],
    withoutBrakeRisk: "Brilliant technical prototypes that remain silent lab gadgets because students cannot make decisive design choices, explain who benefits, or pitch their real-world impact.",
    withBrakeOptimization: "Empowered young innovators who make autonomous strategic build decisions, articulate real-world problem-solving value, and deliver confident, persuasive project pitches.",
    mappedCompetency: "Decision-Making & Impact Pitching",
    diagnosticSkill: "Decision Making & Pitching",
    stemLinkage: {
      stemDrive: "Raw Technical Build",
      brakeIntervention: "Decision & Value Pitch",
      streamerOutcome: "Confident Real-World Impact"
    }
  },
  {
    id: "resilience",
    letter: "R",
    name: "Resilience",
    color: "#1D6FA5",
    rearOrder: 4,
    rearBrakeTitle: "The Shock-Absorbing & Recovery Brake",
    brakeTag: "Resilience Brake",
    prefixQuestion: "Why evaluate diagnostic Resilience instead of just right answers?",
    justificationBullets: [
      {
        highlight: "Destigmatizing System Failure",
        text: "Conventional school tests penalize mistakes with zero marks; in advanced labs, Resilience reframes system errors as valuable diagnostic clues."
      },
      {
        highlight: "Structured Variable Isolation",
        text: "Replaces frantic guessing and blind component-swapping with calm, step-by-step diagnostic troubleshooting to isolate the root fault."
      },
      {
        highlight: "Lifelong Innovation Tenacity",
        text: "Builds the psychological stamina and emotional composure required to stay calm when a rover stalls or code breaks, iterating until it succeeds."
      }
    ],
    withoutBrakeRisk: "Defeatist panic upon encountering hardware or code bugs, blind trial-and-error component swapping, and giving up on ambitious ideas.",
    withBrakeOptimization: "Calm, structured diagnostic isolation of variables, emotional composure, and turning system failures into iterative breakthroughs.",
    mappedCompetency: "Growth Mindset",
    diagnosticSkill: "Troubleshooting",
    stemLinkage: {
      stemDrive: "System Faults",
      brakeIntervention: "Root-Cause Debug",
      streamerOutcome: "Robust Recovery"
    }
  }
];

// ==========================================
// 21ST CENTURY SKILLS (UNIQUE & NON-REDUNDANT)
// ==========================================

export interface Unique21stCenturySkill {
  id: string;
  name: string;
  code: string;
  color: string;
  focus: string;
  mappedCompetencies: string[];
  whatItChecksFor: string;
  whyUniqueFromStreamer: string;
  exampleScenario: {
    type: string;
    title: string;
    scenario: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rubricBands: PillarRubricBand[];
}

export const UNIQUE_21ST_CENTURY_SKILLS: Unique21stCenturySkill[] = [
  {
    id: "communication",
    name: "Communication",
    code: "COM",
    color: "#0284C7", // Sky Blue
    focus: "Multimodal Technical Storytelling",
    mappedCompetencies: ["Oral Articulation", "Visual Schematics", "Technical Documentation"],
    whatItChecksFor: "Translating complex hardware architecture, code logic, and sensor telemetry into lucid explanations, concise documentation, and compelling visual schematics for both technical peers and non-technical stakeholders.",
    whyUniqueFromStreamer: "STREAMER measures technical fabrication and logic; Communication evaluates whether the builder can express technical depth without hiding behind jargon, making engineering transparent and actionable to others.",
    exampleScenario: {
      type: "Technical Briefing Scenario",
      title: "Explaining System Latency to Non-Engineers",
      scenario: "During an exhibition demo, a visitor asks why the rover pauses for 400 milliseconds before turning when it detects an obstacle.",
      question: "Which response demonstrates the highest technical communication mastery?",
      options: [
        "Analogizing the pause to a human checking mirrors before turning: sensor sampling + safety confirmation to avoid false triggers",
        "Saying 'That is just our 16MHz clock cycle interrupt buffer doing its thing'",
        "Saying 'It is a software delay bug that we forgot to remove'",
        "Ignoring the question and quickly demonstrating a different mechanical feature"
      ],
      correctIndex: 0,
      explanation: "Effective communication bridges deep technical mechanisms with clear, relatable conceptual analogies without losing technical accuracy."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Uses Jargon Inconsistently; Unclear Diagrams",
        description: "Struggles to articulate how the build works; relies on unorganized notes, disjointed verbal fragments, or avoids answering technical questions."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Presents Scripted Steps; Basic Schematics",
        description: "Explains builds using a memorized script and clean basic diagrams, but struggles when asked to simplify technical terms for non-experts."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Delivers Clear Multimodal Technical Explanations",
        description: "Independently creates professional schematics, writes clear wiring documentation, and tailors technical explanations dynamically for diverse audiences."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Commands Masterful Technical Storytelling & Documentation",
        description: "Publishes publication-ready project specs, synthesizes complex data visually, and fields adversarial technical inquiries with poise and eloquence."
      }
    ]
  },
  {
    id: "collaboration",
    name: "Collaboration",
    code: "COL",
    color: "#059669", // Emerald
    focus: "Synergistic Team Dynamics & Role Integration",
    mappedCompetencies: ["Role Specialization", "Active Listening", "Constructive Conflict Resolution"],
    whatItChecksFor: "Operating seamlessly in multi-disciplinary teams—dividing hardware and software responsibilities, establishing mutual accountability, actively listening to peer ideas, and resolving disagreements constructively.",
    whyUniqueFromStreamer: "STREAMER evaluates solo mastery in circuits or physics; Collaboration measures how a student functions as a force multiplier in a group, synthesizing disparate skills into a unified finished build.",
    exampleScenario: {
      type: "Team Conflict Resolution",
      title: "Hardware vs. Software Spec Disagreement",
      scenario: "Your team's hardware builder wants to mount ultrasonic sensors at the front bumper, while the programmer insists on mounting them on a rotating servo atop the mast for 180° coverage.",
      question: "What is the most collaborative engineering approach?",
      options: [
        "Facilitate a 15-minute bench test comparing response latency and field-of-view data for both configurations before agreeing on an optimal compromise",
        "Demand the programmer obey because hardware chassis fabrication has already started",
        "Split into two separate projects and refuse to speak for the remainder of the sprint",
        "Let the teacher choose so nobody takes the blame"
      ],
      correctIndex: 0,
      explanation: "True collaboration replaces interpersonal friction with empirical testing, objective criteria, and shared decision-making."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Works in Silos; Struggles with Shared Tasks",
        description: "Prefers working alone; struggles to coordinate part handoffs with teammates or disengages when group disagreements arise."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Executes Assigned Role; Needs Prompting on Handoffs",
        description: "Completes individual assigned tasks responsibly within the group, but requires mentor intervention to coordinate hardware-software integration."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Synchronizes Workflows & Navigates Disagreements",
        description: "Proactively aligns with teammates, supports peers when bottlenecks occur, listens actively to feedback, and resolves disputes with mutual respect."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Champions Team Synergy & Elevates Group Output",
        description: "Orchestrates cross-functional team workflows effortlessly, draws out quiet teammates, builds psychological safety, and ensures shared project ownership."
      }
    ]
  },
  {
    id: "leadership",
    name: "Leadership",
    code: "LDR",
    color: "#7C3AED", // Violet
    focus: "Ethical Direction & Peer Empowerment",
    mappedCompetencies: ["Ethical Stewardship", "Peer Mentorship", "Decisive Initiative"],
    whatItChecksFor: "Guiding project direction with empathy and ethical foresight—mentoring peers when they stumble, keeping morale high under pressure, and championing responsible technology practices.",
    whyUniqueFromStreamer: "STREAMER checks technical competence; Leadership checks whether a student can inspire, mentor, and guide others, taking responsibility for the team's ethical choices and collective success.",
    exampleScenario: {
      type: "Peer Mentorship & Morale",
      title: "Guiding a Teammate Through System Burnout",
      scenario: "During sprint week, a teammate accidentally fries an expensive sensor 2 hours before submission and visibly shuts down from frustration.",
      question: "Which action exemplifies authentic engineering leadership?",
      options: [
        "Calmly reassuring the teammate, stepping through the circuit to isolate why it blew up as a learning moment, and redistributing sprint tasks to keep moving forward",
        "Publicly blaming the teammate for ruining the group's grade",
        "Quietly taking over their entire role and ignoring them for the rest of the lab",
        "Calling the teacher immediately to request the teammate be removed from the group"
      ],
      correctIndex: 0,
      explanation: "Leadership transforms setbacks into psychological safety, learning opportunities, and forward momentum."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Passive Follower; Hesitant to Guide Others",
        description: "Waits for instructions at every step; avoids taking initiative and struggles to support teammates who encounter difficulties."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Steps Up with Prompting; Leads Sub-tasks",
        description: "Leads specific project modules effectively when invited by mentors, demonstrating good organization but needing encouragement to mentor struggling peers."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Inspires Peers & Fosters Inclusive Team Culture",
        description: "Takes initiative to keep projects on track, mentors teammates patiently through technical roadblocks, and champions fair task distribution."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Exemplary Servant Leadership & Ethical Vision",
        description: "Empowers every teammate to thrive, anticipates team bottlenecks proactively, models exceptional ethical responsibility, and commands organic respect."
      }
    ]
  },
  {
    id: "information-literacy",
    name: "Information Literacy",
    code: "INF",
    color: "#D97706", // Amber
    focus: "Source Verification & Algorithmic Ethics",
    mappedCompetencies: ["Datasheet Verification", "Algorithmic Bias Check", "Digital Fact-Checking"],
    whatItChecksFor: "Critically verifying external knowledge sources, validating datasheets and online code libraries, detecting hallucinations or biases in AI tools, and practicing ethical digital curation.",
    whyUniqueFromStreamer: "Research validates internal empirical lab measurements; Information Literacy governs external information consumption—ensuring students do not blindly trust unverified web tutorials or uncurated AI outputs.",
    exampleScenario: {
      type: "Information Verification",
      title: "Adopting an AI-Generated Code Snippet",
      scenario: "An AI coding assistant generates a motor control script with an unverified pin definition that might exceed the microcontroller's GPIO current limit.",
      question: "What is the correct information literacy procedure?",
      options: [
        "Cross-reference the microcontroller datasheet's absolute maximum current ratings and test with a current meter before flashing the firmware",
        "Copy-paste the code directly because AI code is always optimal and correct",
        "Immediately discard all AI suggestions and write every assembly instruction by hand",
        "Run the code at maximum load to see if the chip smokes"
      ],
      correctIndex: 0,
      explanation: "Information literacy demands empirical cross-referencing of third-party or generated information against authoritative primary sources."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Accepts Information Uncritically; Blind Copying",
        description: "Adopts online code snippets, forum claims, or AI answers without checking datasheets or understanding safety implications."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Checks Basic Sources with Guidance",
        description: "Verifies component pinouts against official datasheets when prompted, but struggles to identify subtler bias or outdated library references."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Systematically Validates Data & Digital Sources",
        description: "Independently cross-checks specifications across multiple primary sources, detects flawed assumptions, and credits open-source libraries accurately."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Champions Data Integrity & Algorithmic Ethics",
        description: "Audits hardware and software for systemic edge-case errors, evaluates societal bias in datasets, and teaches peers rigorous information verification habits."
      }
    ]
  },
  {
    id: "productivity",
    name: "Productivity & Self-Direction",
    code: "PRD",
    color: "#EA580C", // Orange-Red
    focus: "Autonomous Milestone Execution & Executive Function",
    mappedCompetencies: ["Time Ownership", "Sprint Planning", "Self-Regulated Learning"],
    whatItChecksFor: "Managing independent development workflows without adult oversight—setting clear milestone cadences, managing personal engineering backlogs, prioritizing bottlenecks, and seeing multi-week projects through to completion.",
    whyUniqueFromStreamer: "Evaluates the builder's internal drive and executive function—measuring personal velocity, milestone ownership, and sustained self-discipline over time.",
    exampleScenario: {
      type: "Sprint Self-Management",
      title: "Managing a 3-Week Independent Capstone",
      scenario: "A student is granted 3 weeks of open lab access to build an automated greenhouse monitor.",
      question: "Which sprint workflow demonstrates the highest self-direction?",
      options: [
        "Breaking the project into week-by-week sprint deliverables (Week 1: sensors, Week 2: telemetry code, Week 3: casing & field test) and logging daily milestone checkpoints",
        "Spending the first two and a half weeks casually browsing 3D models and doing the wiring in an all-nighter",
        "Waiting for the instructor to assign daily checklists before taking any action",
        "Abandoning the greenhouse idea mid-way to start three different unfinished mini-projects"
      ],
      correctIndex: 0,
      explanation: "Self-direction requires decomposing long-range goals into disciplined iterative milestones with autonomous self-monitoring."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Easily Distracted; Misses Independent Milestones",
        description: "Requires frequent trainer reminders to stay on task; struggles to manage time and leaves major components incomplete until deadlines."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Follows Structured Schedules with Occasional Reminders",
        description: "Maintains good focus during guided sessions, but velocity drops significantly when working on open-ended independent homework tasks."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Sets Ambitious Milestones & Delivers Autonomously",
        description: "Independently maintains project backlogs, tracks build velocity, anticipates supply lead times, and finishes high-quality builds on schedule."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Master of Executive Function & Continuous Self-Pacing",
        description: "Operates with professional engineering agility; sets rigorous quality gates, learns new programming frameworks autonomously, and optimizes personal productivity."
      }
    ]
  },
  {
    id: "global-citizenship",
    name: "Global Citizenship & Universal Design",
    code: "GLB",
    color: "#0D9488", // Teal
    focus: "Societal Empathy & Inclusive Engineering",
    mappedCompetencies: ["Universal Accessibility", "Environmental Stewardship", "Cultural Context Awareness"],
    whatItChecksFor: "Designing hardware and software with deep empathy for human diversity—ensuring technology is accessible to people of diverse physical abilities, culturally considerate, and socially equitable.",
    whyUniqueFromStreamer: "STREAMER solves functional engineering challenges; Global Citizenship ensures solutions are humane, universally usable, and designed to uplift marginalized communities rather than widen technological divides.",
    exampleScenario: {
      type: "Universal Design Scenario",
      title: "Accessible User Interface for a Smart Dispenser",
      scenario: "Designing a public automated medicine dispenser for a diverse community clinic.",
      question: "Which design choice best embodies universal design and global citizenship?",
      options: [
        "Pairing high-contrast visual status LEDs with tactile braille buttons and audible voice prompts to accommodate diverse sensory abilities",
        "Using only ultra-small text labels in English to keep the front panel looking minimalist",
        "Requiring an expensive high-end smartphone app with high-speed 5G to unlock the dispenser",
        "Building a purely touch-screen interface that cannot be operated by users with motor tremors"
      ],
      correctIndex: 0,
      explanation: "Global citizenship mandates designing for inclusivity and universal human dignity, ensuring technology is never a barrier."
    },
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Designs for Self; Overlooks Diverse Users",
        description: "Builds technology strictly for personal convenience without considering accessibility, ergonomics, or ethical social implications."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Applies Basic Accessibility When Prompted",
        description: "Includes simple accessibility features (e.g., larger buttons or basic indicators) when guided by trainers, but does not investigate broader user needs."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Integrates Universal Design Principles Autonomously",
        description: "Designs inclusive hardware and interfaces that accommodate different user capabilities, low-resource environments, and cultural contexts."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Champions Humane Tech & Global Social Justice",
        description: "Considers systemic social, environmental, and ethical impacts in all technological solutions; advocates passionately for equitable global access."
      }
    ]
  }
];

// ==========================================
// UN SUSTAINABLE DEVELOPMENT GOALS (SDG)
// ==========================================

export interface SdgProjectMapping {
  id: string;
  name: string;
  batch: "Alpha-2026" | "Beta-2026" | "Custom";
  domain: string;
  prototypeName: string;
  brief: string;
  keyMetric: string;
}

export interface SdgGoalDetailed {
  id: string;
  number: number;
  name: string;
  color: string;
  tagline: string;
  focus: string;
  description: string;
  unTarget: string;
  labApplication: string;
  mappedProjects: SdgProjectMapping[];
  rubricBands: PillarRubricBand[];
}

export const SDG_GOALS_DETAILED: SdgGoalDetailed[] = [
  {
    id: "SDG 4",
    number: 4,
    name: "Quality Education",
    color: "#C5192D",
    tagline: "Inclusive, Equitable & Hands-on STEM Learning",
    focus: "Accessible Learning Hardware & Open STEM Kits",
    description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all through hands-on technology democratization.",
    unTarget: "Target 4.4: Substantially increase the number of youth who have relevant skills, including technical and vocational skills, for employment and entrepreneurship.",
    labApplication: "Students build open-source diagnostic sensor boards, educational micro-rover platforms, and interactive physics demonstrators that can be deployed to under-resourced community classrooms.",
    mappedProjects: [
      {
        id: "proj-sdg4-1",
        name: "AeroPulse Aerodynamics Trainer",
        batch: "Alpha-2026",
        domain: "Aerospace",
        prototypeName: "Mini Wind-Tunnel Telemetry Rig",
        brief: "Interactive low-cost wind tunnel teaching Bernoulli principle with digital differential pressure manometer.",
        keyMetric: "Deployed to 4 local community schools for physics experiments"
      },
      {
        id: "proj-sdg4-2",
        name: "OpenBot STEM Builder Kit",
        batch: "Beta-2026",
        domain: "Robotics",
        prototypeName: "Cardboard Chassis Modular Robot",
        brief: "Ultra-low-cost robotics starter kit utilizing recycled materials and visual block programming.",
        keyMetric: "100% open-hardware schematics with multi-lingual audio guides"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Complex Instructions; Difficult for Beginners",
        description: "Prototype requires extensive trainer assistance to operate; lacks intuitive labeling, assembly manuals, or safety instructions for younger learners."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Functional Educational Demo with Standard Guide",
        description: "Produces a working demonstration with a basic printed guide, but lacks interactive learner engagement or differentiated challenge levels."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Engaging, Intuitive & Pedagogically Sound Kit",
        description: "Designs an intuitive, durable learning tool with step-by-step pictorial guides, scaffolded learning tiers, and clear scientific explanations."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Democratized Scalable Curriculum & Hardware",
        description: "Engineers a fully open-source, affordable educational build with peer mentorship materials, universal accessibility, and measurable student learning outcomes."
      }
    ]
  },
  {
    id: "SDG 7",
    number: 7,
    name: "Affordable & Clean Energy",
    color: "#FCC30B",
    tagline: "Reliable, Sustainable & Modern Energy Telemetry",
    focus: "Solar Tracking, Battery Telemetry & Clean Power",
    description: "Ensure access to affordable, reliable, sustainable and modern energy for all through energy-harvesting hardware and microgrid sensors.",
    unTarget: "Target 7.2: Increase substantially the share of renewable energy in the global energy mix through decentralized smart harvesting.",
    labApplication: "Students engineer dual-axis solar trackers, ultra-low-power supercapacitor storage circuits, and regenerative braking monitors to maximize green energy conversion.",
    mappedProjects: [
      {
        id: "proj-sdg7-1",
        name: "HelioTrack Dual-Axis Array",
        batch: "Alpha-2026",
        domain: "Aerospace",
        prototypeName: "Autonomous Solar Angle Optimizer",
        brief: "LDR-guided dual-axis solar tracking array increasing solar absorption efficiency by +38% over fixed panels.",
        keyMetric: "+38% energy capture verified over 14-day telemetry log"
      },
      {
        id: "proj-sdg7-2",
        name: "NanoGrid Micro-Storage Station",
        batch: "Beta-2026",
        domain: "Robotics",
        prototypeName: "Supercapacitor Energy Harvester",
        brief: "Scavenges indoor ambient light and thermal gradients to power standalone IoT sensor nodes indefinitely.",
        keyMetric: "Zero battery replacements required over 365 operating days"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "High Standby Draw; Inefficient Energy Transfer",
        description: "Circuit consumes more parasitic power than it generates or stores; fails to track power inputs or quantify voltage conversions."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Functional Energy Harvester with Basic Log",
        description: "Captures renewable energy reliably under ideal lab lighting, but efficiency drops sharply under realistic outdoor angle variations."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Optimized Power Conditioning & Solar Tracking",
        description: "Independently balances power budgets, implements dynamic solar tracking algorithms, and quantifies power gains with logged watt-hour metrics."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Autonomous Smart Microgrid Architecture",
        description: "Integrates maximum power point tracking (MPPT), deep sleep state machines, and resilient storage failover with commercial-grade electrical efficiency."
      }
    ]
  },
  {
    id: "SDG 9",
    number: 9,
    name: "Industry, Innovation & Infrastructure",
    color: "#FD6925",
    tagline: "Resilient Systems & Smart Industrial Automation",
    focus: "Autonomous Robotics & Industrial IoT Networks",
    description: "Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation through robust embedded systems.",
    unTarget: "Target 9.5: Enhance scientific research and upgrade the technological capabilities of industrial sectors through indigenous innovation.",
    labApplication: "Students design automated conveyor sorting robots, vibration anomaly detectors for industrial bearings, and fault-tolerant mesh communications.",
    mappedProjects: [
      {
        id: "proj-sdg9-1",
        name: "VibroSense Bearing Monitor",
        batch: "Alpha-2026",
        domain: "Robotics",
        prototypeName: "Predictive Maintenance Node",
        brief: "MEMS accelerometer node detecting high-frequency motor bearing chatter to predict mechanical failure 48h early.",
        keyMetric: "94.2% anomaly detection precision across 12 stress tests"
      },
      {
        id: "proj-sdg9-2",
        name: "AutoSort Optical Conveyor",
        batch: "Beta-2026",
        domain: "Robotics",
        prototypeName: "Automated Material Classifier",
        brief: "Infrared reflection and ultrasonic profiling station that classifies parts and diverts defective components automatically.",
        keyMetric: "Processes 60 items/minute with zero human intervention"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Fragile Build; Frequent Mechanical Jams",
        description: "System breaks under mild duty cycles; lacks structural mounting durability, wire strain relief, or basic automated error checking."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Functional Automation in Controlled Conditions",
        description: "Operates consistently during short 2-minute demonstration runs, but exhibits drift or overheating during prolonged continuous testing."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Industrial-Grade Reliability & Sensor Telemetry",
        description: "Builds durable, vibration-isolated mechanical prototypes with automated fault detection, status telemetry, and resilient fail-safe states."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Scalable Predictive & Autonomous System",
        description: "Architects high-throughput, fault-tolerant infrastructure prototypes with edge analytics, modular repairability, and commercial viability."
      }
    ]
  },
  {
    id: "SDG 11",
    number: 11,
    name: "Sustainable Cities & Communities",
    color: "#FD9D24",
    tagline: "Smart Urban Sensors & Disaster Preparedness",
    focus: "Urban Air Quality, Flood Alert & Smart Transit",
    description: "Make cities and human settlements inclusive, safe, resilient and sustainable with community-scale environmental telemetry and safety infrastructure.",
    unTarget: "Target 11.5: Significantly reduce the number of people affected by water-related disasters with early warning systems.",
    labApplication: "Students build municipal street flood warning sensors, localized particulate matter (PM2.5) air monitors, and intelligent pedestrian crossing systems.",
    mappedProjects: [
      {
        id: "proj-sdg11-1",
        name: "AquaAlert Municipal Flood Beacon",
        batch: "Alpha-2026",
        domain: "Space & Astro",
        prototypeName: "Submersible Level Sensor & GSM Alarm",
        brief: "Storm drain monitoring sensor that broadcasts cellular emergency alerts when flash flood water crosses threshold levels.",
        keyMetric: "8.2 second end-to-end alert broadcast latency"
      },
      {
        id: "proj-sdg11-2",
        name: "UrbanBreath Hyperlocal Air Grid",
        batch: "Beta-2026",
        domain: "Aerospace",
        prototypeName: "Solar PM2.5 / PM10 Monitor Node",
        brief: "Compact pole-mounted node tracking particulate matter and displaying air quality indices on public RGB matrices.",
        keyMetric: "12 nodes deployed across campus pedestrian corridors"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Indoor Only; Lacks Weather Enclosure",
        description: "Fails to consider outdoor environmental factors; electronics are vulnerable to rain, moisture, and dust, limiting real-world city deployment."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Basic Weatherproof Enclosure & Local Display",
        description: "Houses electronics in an IP-rated casing and logs local readings, but lacks long-range telemetry or citizen notification capabilities."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Connected Urban IoT Node with Real-Time Alerts",
        description: "Engineers weather-resistant community hardware with low-power wireless transmission, geo-tagged data logging, and actionable public alerts."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "City-Scale Resilient Sensor Network",
        description: "Designs a self-healing mesh network of solar-powered nodes with automated crowd safety warnings, predictive flood modeling, and municipal API integration."
      }
    ]
  },
  {
    id: "SDG 12",
    number: 12,
    name: "Responsible Consumption & Production",
    color: "#BF8B2E",
    tagline: "Circular Electronics, E-Waste Reduction & Efficiency",
    focus: "Component Upcycling, Biodegradable Materials & Power Thrift",
    description: "Ensure sustainable consumption and production patterns through modular design, circular electronics reuse, and zero-waste prototyping habits.",
    unTarget: "Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling and reuse.",
    labApplication: "Students build functional prototypes using salvaged stepper motors from discarded printers, design snap-fit casings without glue, and write energy-conserving code.",
    mappedProjects: [
      {
        id: "proj-sdg12-1",
        name: "RePrint Salvaged CNC Plotter",
        batch: "Alpha-2026",
        domain: "Robotics",
        prototypeName: "Upcycled Dual-Axis Plotter",
        brief: "Precision 2D plotter constructed from 85% e-waste parts salvaged from decommissioned inkjet printers and DVD drives.",
        keyMetric: "85% recycled bill of materials by weight; cost under $12"
      },
      {
        id: "proj-sdg12-2",
        name: "BioCase Eco-Friendly Drone Frame",
        batch: "Beta-2026",
        domain: "Aerospace",
        prototypeName: "Biodegradable PLA/Hemp Chassis",
        brief: "Lightweight, non-toxic drone chassis engineered with organic natural fibers that decompose safely without microplastics.",
        keyMetric: "100% biodegradable in industrial compost within 90 days"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "High Material Waste; Single-Use Fasteners",
        description: "Generates substantial material scrap during fabrication; uses hot glue permanently bonding reusable parts, preventing future disassembly."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Modular Screwed Assembly with Moderate Scrap",
        description: "Uses non-destructive fasteners allowing teardown and reuse, but bill of materials relies mostly on new virgin plastics."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Circular Design with Salvaged Hardware & Minimal Waste",
        description: "Actively integrates upcycled electronic components, minimizes cutting scrap, and designs modular snap-fit sub-assemblies for easy repair."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Cradle-to-Cradle Sustainable Engineering",
        description: "Conducts lifecycle environmental analysis, uses biodegradable polymers, optimizes energy efficiency to the micro-ampere level, and designs for 100% disassembly."
      }
    ]
  },
  {
    id: "SDG 13",
    number: 13,
    name: "Climate Action",
    color: "#3F7E44",
    tagline: "Atmospheric Telemetry, Greenhouse Gas Tracking & Weather Resilience",
    focus: "Stratospheric Probes, Carbon Sensors & Climate Telemetry",
    description: "Take urgent action to combat climate change and its impacts through atmospheric measurement, early warning systems, and environmental data science.",
    unTarget: "Target 13.3: Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, and impact reduction.",
    labApplication: "Students build weather balloon CubeSat payload probes, optical CO2 gas dispersion detectors, and microclimate soil moisture stations.",
    mappedProjects: [
      {
        id: "proj-sdg13-1",
        name: "StratoProbe Climate Balloon Payload",
        batch: "Alpha-2026",
        domain: "Space & Astro",
        prototypeName: "High-Altitude Ozone & Temp Logger",
        brief: "CubeSat 1U payload measuring stratospheric temperature lapse rates and UV radiation up to 28,000 meters.",
        keyMetric: "Logged 12,400 stratospheric telemetry data points at -52°C"
      },
      {
        id: "proj-sdg13-2",
        name: "TerraSense Forest Fire Sentinel",
        batch: "Beta-2026",
        domain: "Robotics",
        prototypeName: "Thermal & Smoke Early-Warning Node",
        brief: "Low-power forest perimeter node with infrared thermal imaging and gas sensors detecting combustion before open flames spread.",
        keyMetric: "Early smoke detection within 45 seconds of smoldering"
      }
    ],
    rubricBands: [
      {
        name: "Emerging",
        range: [0, 39],
        color: "#EF4444",
        label: "Inaccurate Sensors; Fails Under Temperature Extremes",
        description: "Uses uncalibrated sensors that drift significantly with temperature; data is too noisy to support climate conclusions."
      },
      {
        name: "Developing",
        range: [40, 64],
        color: "#F59E0B",
        label: "Calibrated Environmental Logger in Normal Ranges",
        description: "Records accurate temperature and humidity data in temperate laboratory ranges, but encounters failures in sub-zero or high-moisture field tests."
      },
      {
        name: "Proficient",
        range: [65, 84],
        color: "#3B82F6",
        label: "Robust Multi-Sensor Climate Station with Trend Logs",
        description: "Calibrates optical gas and pressure sensors against environmental chambers, logs verified atmospheric trends, and implements thermal insulation."
      },
      {
        name: "Advanced",
        range: [85, 100],
        color: "#10B981",
        label: "Space/Field-Hardened Scientific Telemetry Payload",
        description: "Engineers vacuum- and freezing-resilient payloads, analyzes complex climate datasets with predictive models, and contributes validated open data to research communities."
      }
    ]
  }
];

