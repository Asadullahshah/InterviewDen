"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Briefcase, Users, Settings, Download, Star, Calendar } from "lucide-react";
import Link from "next/link";

// Mock data for job details
const mockJob = {
  id: "1",
  title: "Senior Software Engineer",
  company: "TechCorp",
  location: "San Francisco, CA",
  type: "Full-time",
  experience: "5+ years",
  salary: "$120,000 - $150,000",
  postedDate: "2024-04-01",
  applicants: 25,
  status: "Active",
  description: "We are looking for a Senior Software Engineer to join our team...",
  requirements: [
    "5+ years of experience in software development",
    "Strong knowledge of React and Node.js",
    "Experience with cloud platforms (AWS/GCP)",
    "Excellent problem-solving skills"
  ],
  testWeightages: {
    resume: 30,
    quiz: 20,
    technical: 30,
    video: 20
  }
};

// Mock data for applicants
const mockApplicants = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    experience: "6 years",
    skills: ["React", "Node.js", "AWS"],
    appliedDate: "2024-04-05",
    status: "Shortlisted",
    score: 85,
    screeningProgress: {
      resume: { score: 90, completed: true },
      quiz: { score: 85, completed: true },
      technical: { score: 80, completed: true },
      video: { score: 85, completed: true }
    }
  },
  // Add more mock applicants...
];

export default function ManageJobPage() {
  const [jobDetails, setJobDetails] = useState(mockJob);
  const [weightages, setWeightages] = useState(mockJob.testWeightages);

  const handleWeightageChange = (key: string, value: number) => {
    setWeightages({ ...weightages, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{jobDetails.title}</h1>
            <p className="text-muted-foreground">{jobDetails.company} • {jobDetails.location}</p>
          </div>
          <Badge variant={jobDetails.status === "Active" ? "default" : "secondary"}>
            {jobDetails.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applicants">Applicants ({jobDetails.applicants})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{jobDetails.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {jobDetails.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <p>{jobDetails.type}</p>
              </div>
              <div className="space-y-2">
                <Label>Experience Required</Label>
                <p>{jobDetails.experience}</p>
              </div>
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <p>{jobDetails.salary}</p>
              </div>
              <div className="space-y-2">
                <Label>Posted Date</Label>
                <p>{new Date(jobDetails.postedDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-4">
          {mockApplicants.map((applicant) => (
            <Card key={applicant.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {applicant.name}
                      <Badge variant={applicant.status === "Shortlisted" ? "default" : "secondary"}>
                        {applicant.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {applicant.experience} experience • Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">Overall Score</div>
                      <div className="text-2xl font-bold">{applicant.score}%</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Resume Screening</span>
                        <span className="font-medium">{applicant.screeningProgress.resume.score}%</span>
                      </div>
                      <Progress value={applicant.screeningProgress.resume.score} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Technical Assessment</span>
                        <span className="font-medium">{applicant.screeningProgress.technical.score}%</span>
                      </div>
                      <Progress value={applicant.screeningProgress.technical.score} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/company/candidates/${applicant.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Weightages</CardTitle>
              <CardDescription>Adjust the weightage for each assessment type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Resume Screening</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[weightages.resume]}
                      onValueChange={(value) => handleWeightageChange("resume", value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{weightages.resume}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quiz Assessment</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[weightages.quiz]}
                      onValueChange={(value) => handleWeightageChange("quiz", value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{weightages.quiz}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Technical Assessment</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[weightages.technical]}
                      onValueChange={(value) => handleWeightageChange("technical", value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{weightages.technical}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Video Interview</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[weightages.video]}
                      onValueChange={(value) => handleWeightageChange("video", value[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{weightages.video}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 