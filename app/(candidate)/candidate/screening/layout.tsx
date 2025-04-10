"use client";

import { useSearchParams } from "next/navigation";
import { useScreening } from "@/app/context/screening-context";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

const steps = [
  { id: "resume", label: "Resume Screening" },
  { id: "quiz", label: "Quiz" },
  { id: "technical", label: "Technical Assessment" },
  { id: "video", label: "Video Interview" },
];

export default function ScreeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { screeningProgress } = useScreening();
  
  const progress = screeningProgress.find(p => p.jobId === jobId);
  const currentStepIndex = progress ? steps.findIndex(step => step.id === progress.currentStep) : 0;
  const completedSteps = progress ? Object.entries(progress.progress).filter(([_, value]) => value?.isCompleted).length : 0;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Screening Process</h1>
        <p className="text-muted-foreground">
          Complete all steps to finish your application
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps} of {totalSteps} steps completed
              </span>
            </div>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const isCompleted = progress?.progress[step.id]?.isCompleted;
              const isCurrent = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? "bg-green-100 text-green-600" :
                    isCurrent ? "bg-primary text-primary-foreground" :
                    isPast ? "bg-muted text-muted-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-sm text-center ${
                    isCurrent ? "font-medium" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {children}
    </div>
  );
} 