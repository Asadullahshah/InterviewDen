"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Briefcase, MapPin, Clock, DollarSign, Users, Settings } from "lucide-react";
import Link from "next/link";

// Mock data for jobs
const mockJobs = [
  {
    id: "1",
    title: "Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$120,000 - $150,000",
    posted: "2024-04-01",
    applicants: 12,
    status: "Active",
    testWeightages: {
      resume: 30,
      quiz: 20,
      technical: 30,
      video: 20
    }
  },
  // Add more mock jobs...
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "Full-time",
    experience: "1-3 years",
    salary: "",
    description: "",
    testWeightages: {
      resume: 30,
      quiz: 20,
      technical: 30,
      video: 20
    }
  });

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWeightageChange = (assessment: string, value: number) => {
    setNewJob(prev => ({
      ...prev,
      testWeightages: {
        ...prev.testWeightages,
        [assessment]: value
      }
    }));
  };

  const totalWeightage = Object.values(newJob.testWeightages).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">Manage and create job postings</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/company/jobs/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {job.applicants} applicants
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Resume Screening</span>
                    <span className="font-medium">{job.testWeightages.resume}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Quiz Assessment</span>
                    <span className="font-medium">{job.testWeightages.quiz}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Technical Assessment</span>
                    <span className="font-medium">{job.testWeightages.technical}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Video Interview</span>
                    <span className="font-medium">{job.testWeightages.video}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                  {job.status}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/company/jobs/${job.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 