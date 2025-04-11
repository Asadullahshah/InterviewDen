"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Briefcase, Calendar, CheckCircle, Clock, DollarSign, Users, XCircle, TrendingUp, CheckCircle2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for analytics
const mockAnalytics = {
  overview: {
    totalJobs: 8,
    activeJobs: 6,
    totalApplicants: 142,
    newApplicants: 28,
    interviewsScheduled: 12,
    hiringRate: 24
  },
  jobPerformance: [
    { title: "Software Engineer", applicants: 86, shortlisted: 12, hired: 3 },
    { title: "Frontend Developer", applicants: 42, shortlisted: 8, hired: 2 },
    { title: "UX Designer", applicants: 28, shortlisted: 5, hired: 1 },
    { title: "Product Manager", applicants: 14, shortlisted: 3, hired: 1 }
  ],
  candidateSources: [
    { source: "LinkedIn", count: 45, percentage: 32 },
    { source: "Indeed", count: 38, percentage: 27 },
    { source: "Company Website", count: 32, percentage: 23 },
    { source: "Referrals", count: 15, percentage: 11 },
    { source: "Other", count: 10, percentage: 7 }
  ],
  timeToHire: {
    average: 24,
    shortest: 14,
    longest: 42
  }
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your recruitment performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.activeJobs}</div>
            <p className="text-xs text-muted-foreground">out of {mockAnalytics.overview.totalJobs} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">+{mockAnalytics.overview.newApplicants} this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hiring Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockAnalytics.overview.hiringRate}%</div>
            </div>
            <Progress value={mockAnalytics.overview.hiringRate} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Job Performance</TabsTrigger>
          <TabsTrigger value="sources">Candidate Sources</TabsTrigger>
          <TabsTrigger value="time">Time to Hire</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Performance</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalytics.jobPerformance.map((job) => (
                <div key={job.title} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{job.title}</span>
                    <span className="text-sm font-medium">{job.applicants} applicants</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Applied</span>
                        <span>{job.applicants}</span>
                      </div>
                      <Progress value={100} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Shortlisted</span>
                        <span>{job.shortlisted}</span>
                      </div>
                      <Progress value={(job.shortlisted / job.applicants) * 100} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Hired</span>
                        <span>{job.hired}</span>
                      </div>
                      <Progress value={(job.hired / job.applicants) * 100} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Sources</CardTitle>
              <CardDescription>Where your applicants come from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalytics.candidateSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{source.source}</span>
                    <span className="text-sm font-medium">{source.count} candidates</span>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time to Hire</CardTitle>
              <CardDescription>Average time from application to hire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Average
                  </div>
                  <div className="text-2xl font-bold">{mockAnalytics.timeToHire.average} days</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    Shortest
                  </div>
                  <div className="text-2xl font-bold">{mockAnalytics.timeToHire.shortest} days</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    Longest
                  </div>
                  <div className="text-2xl font-bold">{mockAnalytics.timeToHire.longest} days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recruitment Analytics Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-500" /> Recruitment Analytics
          </CardTitle>
          <CardDescription>Key metrics and insights for your hiring process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Time-to-Hire Metrics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Average Time to Hire</span>
                  <span className="font-medium">18 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Industry Average</span>
                  <span className="font-medium text-emerald-600">25 days</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4 text-violet-500" /> Candidate Pipeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Application to Interview</span>
                  <span className="font-medium">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Interview to Offer</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Offer Acceptance</span>
                  <span className="font-medium text-violet-600">85%</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" /> Top Performing Jobs
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Frontend Developer</span>
                  <Badge className="bg-blue-100 text-blue-700">48 applicants</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">DevOps Engineer</span>
                  <Badge className="bg-blue-100 text-blue-700">36 applicants</Badge>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-rose-500" /> Areas for Improvement
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">• Technical screening time can be reduced</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">• Interview scheduling efficiency: 65%</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">View Recommendations</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 