"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Star, User, Briefcase, Calendar } from "lucide-react";
import Link from "next/link";

// Mock data for candidates
const mockCandidates = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    jobTitle: "Software Engineer",
    experience: "5 years",
    skills: ["React", "Node.js", "TypeScript"],
    appliedDate: "2024-04-05",
    status: "Shortlisted",
    score: 85,
    resumeUrl: "/resumes/alex-johnson.pdf",
    screeningProgress: {
      resume: { score: 90, completed: true },
      quiz: { score: 85, completed: true },
      technical: { score: 80, completed: true },
      video: { score: 85, completed: true }
    }
  },
  // Add more mock candidates...
];

// Mock data for jobs
const mockJobs = [
  { id: "1", title: "Software Engineer", applicants: 12 },
  { id: "2", title: "Frontend Developer", applicants: 8 },
  { id: "3", title: "UX Designer", applicants: 5 },
];

export default function CandidatesPage() {
  const [selectedJob, setSelectedJob] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesJob = selectedJob === "all" || candidate.jobTitle === selectedJob;
    const matchesSearch = !searchQuery || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJob && matchesSearch;
  });

  // Sort candidates by score in descending order
  const sortedCandidates = [...filteredCandidates].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="text-muted-foreground">Manage and review candidate applications</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {mockJobs.map((job) => (
                  <SelectItem key={job.id} value={job.title}>
                    {job.title} ({job.applicants})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Candidates</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sortedCandidates.map((candidate, index) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{index + 1}.</span>
                        {candidate.name}
                        <Badge variant={candidate.status === "Shortlisted" ? "default" : "secondary"}>
                          {candidate.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {candidate.jobTitle} • {candidate.experience} experience
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium">Overall Score</div>
                        <div className="text-2xl font-bold">{candidate.score}%</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Resume Screening</span>
                          <span className="font-medium">{candidate.screeningProgress.resume.score}%</span>
                        </div>
                        <Progress value={candidate.screeningProgress.resume.score} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Technical Assessment</span>
                          <span className="font-medium">{candidate.screeningProgress.technical.score}%</span>
                        </div>
                        <Progress value={candidate.screeningProgress.technical.score} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
                      </div>
                      <Button asChild>
                        <Link href={`/company/candidates/${candidate.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 