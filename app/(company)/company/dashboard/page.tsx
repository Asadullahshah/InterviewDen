"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Filter, Briefcase, Plus, Lightbulb, TrendingUp, CheckCircle2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export default function CompanyDashboard() {
  const supabase = createSupabaseBrowserClient();
  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    description: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', user);
      if (userError || !user) {
        setLoading(false);
        return;
      }
      const userId = user.id;
      // Fetch from companies
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("company_name, industry, size, location, website, description")
        .eq("id", userId)
        .single();
      console.log('Fetched company:', company, 'Error:', companyError);
      setCompanyInfo({
        company_name: company?.company_name || "",
        industry: company?.industry || "",
        size: company?.size || "",
        location: company?.location || "",
        website: company?.website || "",
        description: company?.description || "",
        email: user.email || "",
      });
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {loading ? "Welcome back!" : `Welcome back, ${companyInfo.company_name || "Company"}!`}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your recruitment today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/company/jobs/create">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
          <Link href="/company/analytics">
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">8</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <ChevronRight className="h-3 w-3 rotate-90" /> +2 this month
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-900 dark:text-violet-100">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-700 dark:text-violet-300">124</div>
            <p className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1">
              <ChevronRight className="h-3 w-3 rotate-90" /> +45 this month
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-900 dark:text-rose-100">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">18</div>
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <ChevronRight className="h-3 w-3 rotate-90" /> +7 this month
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Positions Filled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">3</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ChevronRight className="h-3 w-3 rotate-90" /> +1 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 h-auto">
          <TabsTrigger
            value="candidates"
            className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Top Candidates
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Active Jobs
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className="py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Upcoming Interviews
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-4 pt-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>AI-ranked candidates based on your job requirements</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Candidate Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Senior Frontend Developer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Remote • Posted 5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                      95% Match
                    </Badge>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Candidate Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Full Stack Developer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Hybrid • Posted 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                      88% Match
                    </Badge>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Candidate Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">UX/UI Designer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">On-site • Posted 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                      82% Match
                    </Badge>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-100">
                View All Candidates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4 pt-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>Your current open positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Job Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Senior Frontend Developer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Remote • Posted 5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">42 applicants</div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Job Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Full Stack Developer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Hybrid • Posted 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">28 applicants</div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Job Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">UX/UI Designer</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">On-site • Posted 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">15 applicants</div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-100">
                Manage All Jobs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-4 pt-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Scheduled interviews for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Interview Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-rose-100">
                      <Briefcase className="h-5 w-5 text-rose-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">John Smith</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Technical Interview • Tomorrow, 10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="technical">
                      <SelectTrigger className="w-[140px] border-slate-200">
                        <SelectValue placeholder="Interview Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="ai">AI Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View
                    </Button>
                  </div>
                </div>

                {/* Interview Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-rose-100">
                      <Briefcase className="h-5 w-5 text-rose-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Alice Johnson</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">AI Assessment • Friday, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="ai">
                      <SelectTrigger className="w-[140px] border-slate-200">
                        <SelectValue placeholder="Interview Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="ai">AI Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View
                    </Button>
                  </div>
                </div>

                {/* Interview Item */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-rose-100">
                      <Briefcase className="h-5 w-5 text-rose-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Robert Parker</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Behavioral Interview • Monday, 11:30 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="behavioral">
                      <SelectTrigger className="w-[140px] border-slate-200">
                        <SelectValue placeholder="Interview Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="ai">AI Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700 hover:bg-slate-100">
                View All Interviews
              </Button>
            </CardFooter>
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
  )
}
