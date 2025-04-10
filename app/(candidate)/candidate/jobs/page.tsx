"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Clock, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useScreening } from "@/app/context/screening-context";

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
];

const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Manager",
];

const mockJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Senior Level",
    posted: "2 days ago",
    description: "Looking for a senior software engineer with experience in React, Node.js, and cloud technologies.",
    salary: "$120,000 - $160,000",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "WebSolutions Ltd",
    location: "Remote",
    type: "Full-time",
    experience: "Mid Level",
    posted: "1 week ago",
    description: "Join our team to build beautiful and performant web applications using modern technologies.",
    salary: "$90,000 - $120,000",
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const router = useRouter();
  const { screeningProgress, startScreening } = useScreening();

  const handleApply = (jobId: string) => {
    startScreening(jobId);
    router.push(`/candidate/screening/resume?jobId=${jobId}`);
  };

  const handleResumeScreening = (jobId: string) => {
    const progress = screeningProgress.find(p => p.jobId === jobId);
    if (progress) {
      router.push(`/candidate/screening/${progress.currentStep}?jobId=${jobId}`);
    }
  };

  const getScreeningStatus = (jobId: string) => {
    const progress = screeningProgress.find(p => p.jobId === jobId);
    if (!progress) return null;

    const completedSteps = Object.entries(progress.progress)
      .filter(([_, value]) => value?.isCompleted)
      .length;

    const totalSteps = Object.keys(progress.progress).length;
    const percentage = Math.round((completedSteps / totalSteps) * 100);

    return {
      currentStep: progress.currentStep,
      percentage,
      isCompleted: completedSteps === totalSteps
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Jobs</h1>
        <p className="text-muted-foreground">
          Search and apply for jobs that match your skills and preferences
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Job Title or Keywords</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {mockJobs.map((job) => {
          const screeningStatus = getScreeningStatus(job.id);
          return (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.experience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </div>
                </div>
                <p className="mt-4">{job.description}</p>
                <p className="mt-2 font-medium">{job.salary}</p>
                {screeningStatus && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Screening Progress</span>
                      <span>{screeningStatus.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${screeningStatus.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {screeningStatus.isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Screening Completed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>Current Step: {screeningStatus.currentStep}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {screeningStatus ? (
                  <Button onClick={() => handleResumeScreening(job.id)}>
                    {screeningStatus.isCompleted ? "View Results" : "Resume Screening"}
                  </Button>
                ) : (
                  <Button onClick={() => handleApply(job.id)}>Apply Now</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 