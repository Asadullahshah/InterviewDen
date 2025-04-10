import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Edit2, Trash2 } from "lucide-react"

export default function CVPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          My CV & Resume
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your CV and resume documents. Our AI can help optimize them for better job matching.
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current CV</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current CV</CardTitle>
              <CardDescription>Your most recent CV version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Personal Information</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone" type="tel" />
                <Input placeholder="Location" />
              </div>

              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea
                  placeholder="Write a brief summary of your professional background and career goals..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Work Experience</Label>
                <div className="space-y-4">
                  {[1, 2].map((exp) => (
                    <Card key={exp}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input placeholder="Job Title" />
                          <Input placeholder="Company" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input placeholder="Start Date" type="date" />
                          <Input placeholder="End Date" type="date" />
                        </div>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Experience
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Education</Label>
                <div className="space-y-4">
                  {[1].map((edu) => (
                    <Card key={edu}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input placeholder="Degree" />
                          <Input placeholder="Institution" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input placeholder="Start Date" type="date" />
                          <Input placeholder="End Date" type="date" />
                        </div>
                        <Textarea
                          placeholder="Additional details about your education..."
                          className="min-h-[100px]"
                        />
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Education
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Python", "AWS"].map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{skill}</span>
                      <Button variant="ghost" size="icon" className="h-4 w-4">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    Add Skill
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CV Templates</CardTitle>
              <CardDescription>Choose from our professionally designed templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((template) => (
                  <Card key={template} className="overflow-hidden">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800" />
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Modern Professional</h3>
                          <p className="text-sm text-slate-500">Clean and contemporary design</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 