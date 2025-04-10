"use client";

import { createContext, useContext, useState, useEffect } from "react";

type ScreeningStep = "resume" | "quiz" | "technical" | "video";

interface ScreeningProgress {
  jobId: string;
  currentStep: ScreeningStep;
  progress: {
    resume?: {
      answers: string[];
      timeLeft: number;
      isCompleted: boolean;
    };
    quiz?: {
      answers: { [key: number]: number };
      timeLeft: number;
      isCompleted: boolean;
    };
    technical?: {
      answers: { [key: number]: number };
      timeLeft: number;
      isCompleted: boolean;
    };
    video?: {
      recordedAnswers: { [key: number]: boolean };
      timeLeft: number;
      isCompleted: boolean;
    };
  };
  lastUpdated: string;
}

interface ScreeningContextType {
  screeningProgress: ScreeningProgress[];
  updateProgress: (jobId: string, step: ScreeningStep, progress: any) => void;
  getProgress: (jobId: string) => ScreeningProgress | undefined;
  startScreening: (jobId: string) => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export function ScreeningProvider({ children }: { children: React.ReactNode }) {
  const [screeningProgress, setScreeningProgress] = useState<ScreeningProgress[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("screeningProgress");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("screeningProgress", JSON.stringify(screeningProgress));
  }, [screeningProgress]);

  const updateProgress = (jobId: string, step: ScreeningStep, progress: any) => {
    setScreeningProgress(prev => {
      const existing = prev.find(p => p.jobId === jobId);
      if (existing) {
        return prev.map(p => 
          p.jobId === jobId 
            ? { 
                ...p, 
                currentStep: step,
                progress: { ...p.progress, [step]: progress },
                lastUpdated: new Date().toISOString()
              }
            : p
        );
      }
      return [...prev, {
        jobId,
        currentStep: step,
        progress: { [step]: progress },
        lastUpdated: new Date().toISOString()
      }];
    });
  };

  const getProgress = (jobId: string) => {
    return screeningProgress.find(p => p.jobId === jobId);
  };

  const startScreening = (jobId: string) => {
    if (!getProgress(jobId)) {
      updateProgress(jobId, "resume", {
        answers: [],
        timeLeft: 30 * 60, // 30 minutes
        isCompleted: false
      });
    }
  };

  return (
    <ScreeningContext.Provider value={{ screeningProgress, updateProgress, getProgress, startScreening }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (context === undefined) {
    throw new Error("useScreening must be used within a ScreeningProvider");
  }
  return context;
} 