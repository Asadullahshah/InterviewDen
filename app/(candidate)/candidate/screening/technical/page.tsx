"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useScreening } from "@/app/context/screening-context";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: 1,
    question: "What is the time complexity of a binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is NOT a valid HTTP method?",
    options: ["GET", "POST", "PUT", "FETCH"],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What is the main purpose of a database index?",
    options: [
      "To store data permanently",
      "To improve query performance",
      "To ensure data integrity",
      "To backup data"
    ],
    correctAnswer: 1
  }
];

export default function TechnicalAssessmentPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const router = useRouter();
  const { screeningProgress, updateProgress } = useScreening();
  
  const progress = screeningProgress.find(p => p.jobId === jobId)?.progress.technical;
  const [answers, setAnswers] = useState<{ [key: number]: number }>(progress?.answers || {});
  const [timeLeft, setTimeLeft] = useState(progress?.timeLeft || 30 * 60); // 30 minutes
  const [isRunning, setIsRunning] = useState(!progress?.isCompleted);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (jobId) {
      updateProgress(jobId, "technical", {
        answers,
        timeLeft,
        isCompleted: true
      });
      setIsRunning(false);
      router.push(`/candidate/screening/video?jobId=${jobId}`);
    }
  };

  const handleStopTest = () => {
    if (jobId) {
      updateProgress(jobId, "technical", {
        answers,
        timeLeft,
        isCompleted: false
      });
      setShowConfirmation(true);
    }
  };

  const handleConfirmStop = () => {
    setIsRunning(false);
    setShowConfirmation(false);
    router.push("/candidate/jobs");
  };

  const handleCancelStop = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Assessment</CardTitle>
          <CardDescription>
            Please answer the following technical questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Progress value={(timeLeft / (30 * 60)) * 100} className="w-[200px]" />
          </div>

          {showConfirmation ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Stop Test?</AlertTitle>
              <AlertDescription>
                Are you sure you want to stop the test? Your progress will be saved, but you'll need to complete it later.
              </AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button variant="destructive" onClick={handleConfirmStop}>
                  Yes, Stop Test
                </Button>
                <Button variant="outline" onClick={handleCancelStop}>
                  Cancel
                </Button>
              </div>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <p className="text-lg">{questions[currentQuestion].question}</p>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md cursor-pointer ${
                        answers[questions[currentQuestion].id] === index
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleAnswerChange(index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={!isRunning}>
                    Submit Assessment
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleStopTest}>
            Stop Test
          </Button>
          <div className="flex items-center gap-2">
            {Object.keys(answers).length} of {questions.length} questions answered
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 