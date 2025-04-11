"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Download, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Star } from "lucide-react";
import Link from "next/link";

// Mock data for candidate profile
const mockCandidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  experience: "6 years",
  currentRole: "Senior Software Engineer at TechCorp",
  education: [
    {
      degree: "Master of Science in Computer Science",
      school: "Stanford University",
      year: "2018"
    },
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      year: "2016"
    }
  ],
  skills: ["React", "Node.js", "AWS", "TypeScript", "Python", "Docker"],
  status: "Shortlisted",
  appliedDate: "2024-04-05",
  score: 85,
  screeningProgress: {
    resume: { score: 90, completed: true },
    quiz: { score: 85, completed: true },
    technical: { score: 80, completed: true },
    video: { score: 85, completed: true }
  },
  workExperience: [
    {
      role: "Senior Software Engineer",
      company: "TechCorp",
      duration: "2020 - Present",
      description: "Led development of multiple microservices and implemented CI/CD pipelines."
    },
    {
      role: "Software Engineer",
      company: "StartupX",
      duration: "2018 - 2020",
      description: "Developed and maintained web applications using React and Node.js."
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce platform with real-time inventory management.",
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      name: "Task Management App",
      description: "Developed a collaborative task management application with real-time updates.",
      technologies: ["React", "Firebase", "Material-UI"]
    }
  ]
};

function CandidateProfilePage() {
  const [candidate, setCandidate] = useState(mockCandidate);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-muted-foreground">{candidate.currentRole}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
            <Badge variant={candidate.status === "Shortlisted" ? "default" : "secondary"}>
              {candidate.status}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.experience} experience</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">{edu.school}</div>
                  <div className="text-sm text-muted-foreground">{edu.year}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {candidate.workExperience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{exp.role}</div>
                      <div className="text-sm text-muted-foreground">{exp.company}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{exp.duration}</div>
                  </div>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {candidate.projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium">{project.name}</div>
                  <p className="text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assessment Results</CardTitle>
                  <CardDescription>Overall Score: {candidate.score}%</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Resume Screening</span>
                    <span className="font-medium">{candidate.screeningProgress.resume.score}%</span>
                  </div>
                  <Progress value={candidate.screeningProgress.resume.score} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Quiz Assessment</span>
                    <span className="font-medium">{candidate.screeningProgress.quiz.score}%</span>
                  </div>
                  <Progress value={candidate.screeningProgress.quiz.score} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Technical Assessment</span>
                    <span className="font-medium">{candidate.screeningProgress.technical.score}%</span>
                  </div>
                  <Progress value={candidate.screeningProgress.technical.score} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Video Interview</span>
                    <span className="font-medium">{candidate.screeningProgress.video.score}%</span>
                  </div>
                  <Progress value={candidate.screeningProgress.video.score} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CandidateProfilePage; 