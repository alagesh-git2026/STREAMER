import React, { createContext, useContext, useState, useEffect } from "react";
import { STUDENTS_DATA, type Student } from "../data/students";

export interface MilestoneItem {
  id: string;
  label: string;
  period: string; // e.g. "2025" or "Month"
  academicYear: string; // e.g. "2025-2026" or "2024-2025"
  avgScore: number;
  passRate: number;
  weightedAvg: number;
}

export const DEFAULT_QUARTERLY_MILESTONES: MilestoneItem[] = [
  // 2025-2026 Academic Year (Current)
  { id: "q1-2526", label: "Q1", period: "2025", academicYear: "2025-2026", avgScore: 78.4, passRate: 75.0, weightedAvg: 70.2 },
  { id: "q2-2526", label: "Q2", period: "2025", academicYear: "2025-2026", avgScore: 81.2, passRate: 83.3, weightedAvg: 76.5 },
  { id: "q3-2526", label: "Q3", period: "2025", academicYear: "2025-2026", avgScore: 84.6, passRate: 91.7, weightedAvg: 80.8 },
  { id: "q4-2526", label: "Q4", period: "2026", academicYear: "2025-2026", avgScore: 87.9, passRate: 100.0, weightedAvg: 85.5 },
  { id: "capstone-2526", label: "Capstone", period: "2026", academicYear: "2025-2026", avgScore: 90.5, passRate: 100.0, weightedAvg: 88.4 },

  // 2024-2025 Academic Year (Historical)
  { id: "q1-2425", label: "Q1", period: "2024", academicYear: "2024-2025", avgScore: 72.8, passRate: 68.0, weightedAvg: 65.4 },
  { id: "q2-2425", label: "Q2", period: "2024", academicYear: "2024-2025", avgScore: 76.1, passRate: 75.0, weightedAvg: 71.0 },
  { id: "q3-2425", label: "Q3", period: "2024", academicYear: "2024-2025", avgScore: 79.5, passRate: 81.5, weightedAvg: 75.8 },
  { id: "q4-2425", label: "Q4", period: "2025", academicYear: "2024-2025", avgScore: 83.2, passRate: 88.0, weightedAvg: 80.2 },
  { id: "capstone-2425", label: "Capstone", period: "2025", academicYear: "2024-2025", avgScore: 86.4, passRate: 94.0, weightedAvg: 83.5 },
];

export const DEFAULT_MONTHLY_MILESTONES: MilestoneItem[] = [
  // 2025-2026 Academic Year (Current Aug to Mar cycle)
  { id: "m-aug-25", label: "Aug", period: "2025", academicYear: "2025-2026", avgScore: 74.2, passRate: 66.7, weightedAvg: 68.0 },
  { id: "m-sep-25", label: "Sep", period: "2025", academicYear: "2025-2026", avgScore: 77.0, passRate: 73.3, weightedAvg: 70.5 },
  { id: "m-oct-25", label: "Oct", period: "2025", academicYear: "2025-2026", avgScore: 79.5, passRate: 80.0, weightedAvg: 73.8 },
  { id: "m-nov-25", label: "Nov", period: "2025", academicYear: "2025-2026", avgScore: 82.1, passRate: 86.7, weightedAvg: 77.2 },
  { id: "m-dec-25", label: "Dec", period: "2025", academicYear: "2025-2026", avgScore: 83.8, passRate: 86.7, weightedAvg: 79.4 },
  { id: "m-jan-26", label: "Jan", period: "2026", academicYear: "2025-2026", avgScore: 85.5, passRate: 93.3, weightedAvg: 82.1 },
  { id: "m-feb-26", label: "Feb", period: "2026", academicYear: "2025-2026", avgScore: 87.2, passRate: 100.0, weightedAvg: 84.8 },
  { id: "m-mar-26", label: "Mar", period: "2026", academicYear: "2025-2026", avgScore: 88.9, passRate: 100.0, weightedAvg: 86.5 },

  // 2024-2025 Academic Year (Historical Aug to Mar cycle)
  { id: "m-aug-24", label: "Aug", period: "2024", academicYear: "2024-2025", avgScore: 70.1, passRate: 60.0, weightedAvg: 63.5 },
  { id: "m-sep-24", label: "Sep", period: "2024", academicYear: "2024-2025", avgScore: 72.8, passRate: 65.5, weightedAvg: 67.0 },
  { id: "m-oct-24", label: "Oct", period: "2024", academicYear: "2024-2025", avgScore: 75.4, passRate: 72.0, weightedAvg: 70.1 },
  { id: "m-nov-24", label: "Nov", period: "2024", academicYear: "2024-2025", avgScore: 77.9, passRate: 78.5, weightedAvg: 73.4 },
  { id: "m-dec-24", label: "Dec", period: "2024", academicYear: "2024-2025", avgScore: 80.2, passRate: 82.0, weightedAvg: 76.0 },
  { id: "m-jan-25", label: "Jan", period: "2025", academicYear: "2024-2025", avgScore: 82.5, passRate: 88.5, weightedAvg: 79.2 },
  { id: "m-feb-25", label: "Feb", period: "2025", academicYear: "2024-2025", avgScore: 84.1, passRate: 92.0, weightedAvg: 81.5 },
  { id: "m-mar-25", label: "Mar", period: "2025", academicYear: "2024-2025", avgScore: 85.8, passRate: 95.0, weightedAvg: 83.2 },
];

interface StudentDataContextType {
  students: Student[];
  updateStudent: (updated: Student) => void;
  addStudent: (newStudent: Student) => void;
  deleteStudent: (id: string) => void;
  resetToDefaultData: () => void;
  importStudentsData: (data: Student[]) => void;
  exportStudentsData: () => string;

  // Milestone trends (Quarterly and Monthly)
  quarterlyMilestones: MilestoneItem[];
  monthlyMilestones: MilestoneItem[];
  updateQuarterlyMilestone: (id: string, updated: Partial<MilestoneItem>) => void;
  updateMonthlyMilestone: (id: string, updated: Partial<MilestoneItem>) => void;
  resetMilestones: () => void;
}

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

const STORAGE_KEY_STUDENTS = "STREAMER_STUDENTS_DATA_V2";
const STORAGE_KEY_QUARTERS = "STREAMER_MILESTONES_QUARTERLY_V2";
const STORAGE_KEY_MONTHS = "STREAMER_MILESTONES_MONTHLY_V2";

export const StudentDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS) || localStorage.getItem("STREAMER_STUDENTS_DATA_V1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: Student) => ({
            ...s,
            academicYear: s.academicYear || "2025-2026",
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load students data from localStorage:", e);
    }
    return STUDENTS_DATA.map(s => ({
      ...s,
      academicYear: s.academicYear || "2025-2026",
    }));
  });

  const [quarterlyMilestones, setQuarterlyMilestones] = useState<MilestoneItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUARTERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load quarterly milestones from localStorage:", e);
    }
    return DEFAULT_QUARTERLY_MILESTONES;
  });

  const [monthlyMilestones, setMonthlyMilestones] = useState<MilestoneItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MONTHS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load monthly milestones from localStorage:", e);
    }
    return DEFAULT_MONTHLY_MILESTONES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to save students to localStorage:", e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUARTERS, JSON.stringify(quarterlyMilestones));
    } catch (e) {
      console.error("Failed to save quarterly milestones to localStorage:", e);
    }
  }, [quarterlyMilestones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(monthlyMilestones));
    } catch (e) {
      console.error("Failed to save monthly milestones to localStorage:", e);
    }
  }, [monthlyMilestones]);

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const resetToDefaultData = () => {
    setStudents(STUDENTS_DATA);
    setQuarterlyMilestones(DEFAULT_QUARTERLY_MILESTONES);
    setMonthlyMilestones(DEFAULT_MONTHLY_MILESTONES);
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      localStorage.removeItem(STORAGE_KEY_QUARTERS);
      localStorage.removeItem(STORAGE_KEY_MONTHS);
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuarterlyMilestone = (id: string, updated: Partial<MilestoneItem>) => {
    setQuarterlyMilestones(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const updateMonthlyMilestone = (id: string, updated: Partial<MilestoneItem>) => {
    setMonthlyMilestones(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const resetMilestones = () => {
    setQuarterlyMilestones(DEFAULT_QUARTERLY_MILESTONES);
    setMonthlyMilestones(DEFAULT_MONTHLY_MILESTONES);
  };

  const importStudentsData = (data: Student[]) => {
    if (Array.isArray(data) && data.length > 0) {
      setStudents(data);
    }
  };

  const exportStudentsData = () => {
    return JSON.stringify({
      students,
      quarterlyMilestones,
      monthlyMilestones,
    }, null, 2);
  };

  return (
    <StudentDataContext.Provider
      value={{
        students,
        updateStudent,
        addStudent,
        deleteStudent,
        resetToDefaultData,
        importStudentsData,
        exportStudentsData,
        quarterlyMilestones,
        monthlyMilestones,
        updateQuarterlyMilestone,
        updateMonthlyMilestone,
        resetMilestones,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = (): StudentDataContextType => {
  const context = useContext(StudentDataContext);
  if (!context) {
    throw new Error("useStudentData must be used within a StudentDataProvider");
  }
  return context;
};
