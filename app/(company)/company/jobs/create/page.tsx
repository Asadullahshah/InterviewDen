"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, DollarSign, MapPin } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

const steps = [
  { id: "job-details", name: "Job Details" },
  { id: "job-description", name: "Job Description" },
  { id: "resume-requirements", name: "Resume Requirements" },
  { id: "test-requirements", name: "Test Requirements" },
  { id: "interview-settings", name: "Interview Settings" },
]

interface JobFormData {
  // Step 1 fields
  title: string
  department: string
  description: string
  location: string
  type: string
  requirements: string[]
  benefits: string[]
  salary_min: number | null
  salary_max: number | null
  currency: string
  is_remote: boolean
  has_relocation: boolean
  has_sponsorship: boolean
  
  // Step 2 fields
  overview: string
  responsibilities: string[]
  detailed_requirements: string[]
  detailed_benefits: string[]
  
  // Step 3 fields
  required_documents: {
    resume: boolean
    cover_letter: boolean
    portfolio: boolean
    references: boolean
  }
  required_skills: Array<{
    name: string
    years: string
  }>
  min_education: string
  ai_screening_enabled: boolean
  
  // Step 4 fields
  test_requirements: {
    technical_test: boolean
    personality_test: boolean
    cognitive_test: boolean
    language_test: boolean
  }
  technical_test_config: {
    difficulty: string
    duration: string
    topics: string[]
    custom_questions: string
    weightage: number
    passing_score: number
  }
  ai_test_generation: boolean
  
  // Step 5 fields
  interview_stages: {
    ai_screening: boolean
    technical: boolean
    behavioral: boolean
    final: boolean
  }
  ai_interview_config: {
    format: 'video' | 'audio' | 'text'
    duration: string
    custom_questions: string
  }
  automated_scheduling: boolean
  ai_feedback: boolean
  
  // Common fields
  status: 'draft' | 'published'
  step: number
  
  // Stage weightages
  stage_weightages: {
    resume_screening: number
    technical_quiz: number
    coding_test: number
    interview: number
  }
  
  // Coding test specific fields
  coding_test_config: {
    difficulty: string
    duration: string
    languages: string[]
    custom_questions: string
    weightage: number
    passing_score: number
  }
  
  // Interview specific fields
  interview_config: {
    format: 'video' | 'audio' | 'text'
    duration: string
    custom_questions: string
    weightage: number
    passing_score: number
  }
}

const isFirstStep = (step: number): step is 0 => step === 0

export default function CreateJobPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<JobFormData>({
    // Step 1 fields
    title: '',
    department: '',
    description: '',
    location: '',
    type: '',
    requirements: [],
    benefits: [],
    salary_min: null,
    salary_max: null,
    currency: 'USD',
    is_remote: false,
    has_relocation: false,
    has_sponsorship: false,
    
    // Step 2 fields
    overview: '',
    responsibilities: [],
    detailed_requirements: [],
    detailed_benefits: [],
    
    // Step 3 fields
    required_documents: {
      resume: true,
      cover_letter: false,
      portfolio: false,
      references: false
    },
    required_skills: [],
    min_education: 'none',
    ai_screening_enabled: true,
    
    // Step 4 fields
    test_requirements: {
      technical_test: true,
      personality_test: false,
      cognitive_test: false,
      language_test: false
    },
    technical_test_config: {
      difficulty: 'medium',
      duration: '60',
      topics: ['frontend'],
      custom_questions: '',
      weightage: 30,
      passing_score: 70
    },
    ai_test_generation: true,
    
    // Step 5 fields
    interview_stages: {
      ai_screening: true,
      technical: true,
      behavioral: true,
      final: false
    },
    ai_interview_config: {
      format: 'video',
      duration: '30',
      custom_questions: ''
    },
    automated_scheduling: true,
    ai_feedback: true,
    
    // Common fields
    status: 'draft',
    step: 1,
    
    // Initialize stage weightages
    stage_weightages: {
      resume_screening: 20,
      technical_quiz: 30,
      coding_test: 30,
      interview: 20
    },
    
    // Initialize coding test config
    coding_test_config: {
      difficulty: 'medium',
      duration: '90',
      languages: ['javascript', 'python'],
      custom_questions: '',
      weightage: 30,
      passing_score: 70
    },
    
    // Initialize interview config
    interview_config: {
      format: 'video',
      duration: '45',
      custom_questions: '',
      weightage: 20,
      passing_score: 70
    }
  })

  const supabase = createClient()

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveDraft = async () => {
    try {
      setIsSubmitting(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('You must be logged in to create a job')
        return
      }

      // Get company_id from profiles table using user id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (!profile?.company_id) {
        toast.error('Company profile not found')
        return
      }

      const { error } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          company_id: profile.company_id,
          step: currentStep + 1
        })

      if (error) throw error

      toast.success('Draft saved successfully')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (currentStep < 4) {
      // Save current step as draft
      await saveDraft()
      setCurrentStep((currentStep + 1) as 0 | 1 | 2 | 3 | 4)
    } else {
      // Submit the final form
      await submitJob()
    }
  }

  const submitJob = async () => {
    try {
      setIsSubmitting(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('You must be logged in to create a job')
        return
      }

      // Get company_id from profiles table using user id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (!profile?.company_id) {
        toast.error('Company profile not found')
        return
      }

      const { error } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          company_id: profile.company_id,
          status: 'published',
          step: steps.length
        })

      if (error) throw error

      toast.success('Job posted successfully')
      router.push('/company/jobs')
    } catch (error) {
      console.error('Error posting job:', error)
      toast.error('Failed to post job')
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as 0 | 1 | 2 | 3 | 4)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Create New Job Posting
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Fill in the details below to create a new job posting. Our AI will help optimize it for better visibility.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? "bg-violet-600 text-white"
                    : index === currentStep
                      ? "bg-violet-100 text-violet-700 border-2 border-violet-600"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs mt-2 ${index === currentStep ? "text-violet-700 font-medium" : "text-slate-500"}`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 bg-slate-200"></div>
          </div>
          <div
            className="absolute inset-0 flex items-center"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          >
            <div className="w-full h-1 bg-violet-600"></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-slate-200 shadow-sm">
        {currentStep === 0 && (
          <>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department}
                    onValueChange={(value) => handleInputChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Software Engineering</SelectItem>
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="mobile">Mobile Development</SelectItem>
                      <SelectItem value="devops">DevOps & Cloud</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="min-h-[200px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karachi">Karachi</SelectItem>
                      <SelectItem value="lahore">Lahore</SelectItem>
                      <SelectItem value="islamabad">Islamabad</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="peshawar">Peshawar</SelectItem>
                      <SelectItem value="remote">Remote (Pakistan)</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the required skills, experience, and qualifications..."
                  className="min-h-[150px]"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleInputChange('requirements', e.target.value.split('\n').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  placeholder="Describe the benefits and perks of working at your company..."
                  className="min-h-[150px]"
                  value={formData.benefits.join('\n')}
                  onChange={(e) => handleInputChange('benefits', e.target.value.split('\n').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label>Salary Range (PKR)</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input 
                    placeholder="Minimum salary" 
                    type="number"
                    value={formData.salary_min || ''}
                    onChange={(e) => handleInputChange('salary_min', e.target.value ? Number(e.target.value) : null)}
                  />
                  <Input 
                    placeholder="Maximum salary" 
                    type="number"
                    value={formData.salary_max || ''}
                    onChange={(e) => handleInputChange('salary_max', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Additional Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remote" 
                      checked={formData.is_remote}
                      onCheckedChange={(checked) => handleInputChange('is_remote', checked)}
                    />
                    <Label htmlFor="remote">Remote work allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="relocation"
                      checked={formData.has_relocation}
                      onCheckedChange={(checked) => handleInputChange('has_relocation', checked)}
                    />
                    <Label htmlFor="relocation">Relocation assistance available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sponsorship"
                      checked={formData.has_sponsorship}
                      onCheckedChange={(checked) => handleInputChange('has_sponsorship', checked)}
                    />
                    <Label htmlFor="sponsorship">Visa sponsorship available</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isFirstStep(currentStep)}>
                Previous
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Next Step'}
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Provide detailed information about the job responsibilities and requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="overview">Job Overview</Label>
                <Textarea
                  id="overview"
                  placeholder="Provide a brief overview of the role and your company..."
                  className="min-h-[100px]"
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  placeholder="List the key responsibilities for this role..."
                  className="min-h-[150px]"
                  value={formData.responsibilities.join('\n')}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value.split('\n').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed-requirements">Detailed Requirements</Label>
                <Textarea
                  id="detailed-requirements"
                  placeholder="List the skills, qualifications, and experience required..."
                  className="min-h-[150px]"
                  value={formData.detailed_requirements.join('\n')}
                  onChange={(e) => handleInputChange('detailed_requirements', e.target.value.split('\n').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed-benefits">Detailed Benefits & Perks</Label>
                <Textarea
                  id="detailed-benefits"
                  placeholder="Describe the benefits and perks offered with this position..."
                  className="min-h-[100px]"
                  value={formData.detailed_benefits.join('\n')}
                  onChange={(e) => handleInputChange('detailed_benefits', e.target.value.split('\n').filter(Boolean))}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isFirstStep(currentStep)}>
                Previous
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Next Step'}
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Resume Requirements</CardTitle>
              <CardDescription>Specify what you're looking for in candidate resumes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Required Documents</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="resume" 
                      checked={formData.required_documents.resume}
                      onCheckedChange={(checked) => handleInputChange('required_documents', {
                        ...formData.required_documents,
                        resume: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="resume" className="cursor-pointer">
                        Resume/CV
                      </Label>
                      <p className="text-sm text-slate-500">Standard resume with work history</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="cover-letter"
                      checked={formData.required_documents.cover_letter}
                      onCheckedChange={(checked) => handleInputChange('required_documents', {
                        ...formData.required_documents,
                        cover_letter: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="cover-letter" className="cursor-pointer">
                        Cover Letter
                      </Label>
                      <p className="text-sm text-slate-500">Personalized letter explaining interest</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="portfolio"
                      checked={formData.required_documents.portfolio}
                      onCheckedChange={(checked) => handleInputChange('required_documents', {
                        ...formData.required_documents,
                        portfolio: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="portfolio" className="cursor-pointer">
                        Portfolio
                      </Label>
                      <p className="text-sm text-slate-500">Link to work samples or portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="references"
                      checked={formData.required_documents.references}
                      onCheckedChange={(checked) => handleInputChange('required_documents', {
                        ...formData.required_documents,
                        references: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="references" className="cursor-pointer">
                        References
                      </Label>
                      <p className="text-sm text-slate-500">Professional references</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="border rounded-md p-4 space-y-4">
                  {formData.required_skills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`skill-${index}`}>Skill {index + 1}</Label>
                        <Input 
                          id={`skill-${index}`} 
                          placeholder="e.g. React.js"
                          value={skill.name}
                          onChange={(e) => {
                            const newSkills = [...formData.required_skills]
                            newSkills[index] = { ...skill, name: e.target.value }
                            handleInputChange('required_skills', newSkills)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`skill-${index}-years`}>Years of Experience</Label>
                        <Select
                          value={skill.years}
                          onValueChange={(value) => {
                            const newSkills = [...formData.required_skills]
                            newSkills[index] = { ...skill, years: value }
                            handleInputChange('required_skills', newSkills)
                          }}
                        >
                          <SelectTrigger id={`skill-${index}-years`}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+ years</SelectItem>
                            <SelectItem value="2">2+ years</SelectItem>
                            <SelectItem value="3">3+ years</SelectItem>
                            <SelectItem value="5">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleInputChange('required_skills', [
                      ...formData.required_skills,
                      { name: '', years: 'any' }
                    ])}
                  >
                    + Add Another Skill
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Minimum Education</Label>
                <Select
                  value={formData.min_education}
                  onValueChange={(value) => handleInputChange('min_education', value)}
                >
                  <SelectTrigger id="education">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific requirement</SelectItem>
                    <SelectItem value="high-school">High School Diploma</SelectItem>
                    <SelectItem value="associate">Associate's Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD or Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-screening">AI Resume Screening</Label>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="ai-screening" 
                    checked={formData.ai_screening_enabled}
                    onCheckedChange={(checked) => handleInputChange('ai_screening_enabled', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="ai-screening" className="cursor-pointer">
                      Enable AI Resume Screening
                    </Label>
                    <p className="text-sm text-slate-500">
                      Our AI will analyze resumes and rank candidates based on your requirements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isFirstStep(currentStep)}>
                Previous
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Next Step'}
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Test Requirements</CardTitle>
              <CardDescription>Set up skills assessments and tests for candidates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Stage Weightages</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume-weightage">Resume Screening Weightage (%)</Label>
                    <Input 
                      id="resume-weightage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.stage_weightages.resume_screening}
                      onChange={(e) => handleInputChange('stage_weightages', {
                        ...formData.stage_weightages,
                        resume_screening: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technical-weightage">Technical Quiz Weightage (%)</Label>
                    <Input 
                      id="technical-weightage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.stage_weightages.technical_quiz}
                      onChange={(e) => handleInputChange('stage_weightages', {
                        ...formData.stage_weightages,
                        technical_quiz: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coding-weightage">Coding Test Weightage (%)</Label>
                    <Input 
                      id="coding-weightage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.stage_weightages.coding_test}
                      onChange={(e) => handleInputChange('stage_weightages', {
                        ...formData.stage_weightages,
                        coding_test: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interview-weightage">Interview Weightage (%)</Label>
                    <Input 
                      id="interview-weightage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.stage_weightages.interview}
                      onChange={(e) => handleInputChange('stage_weightages', {
                        ...formData.stage_weightages,
                        interview: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Technical Quiz Configuration</Label>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.technical_test_config.difficulty}
                      onValueChange={(value) => handleInputChange('technical_test_config', {
                        ...formData.technical_test_config,
                        difficulty: value
                      })}
                    >
                      <SelectTrigger id="test-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="medium">Mid Level (2-5 years)</SelectItem>
                        <SelectItem value="hard">Senior Level (5+ years)</SelectItem>
                        <SelectItem value="expert">Lead/Architect Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-duration">Test Duration</Label>
                    <Select
                      value={formData.technical_test_config.duration}
                      onValueChange={(value) => handleInputChange('technical_test_config', {
                        ...formData.technical_test_config,
                        duration: value
                      })}
                    >
                      <SelectTrigger id="test-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Test Topics</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'javascript', 'react', 'nodejs', 'typescript', 
                        'python', 'django', 'flask', 'sql',
                        'aws', 'docker', 'kubernetes', 'ci-cd',
                        'system-design', 'algorithms', 'data-structures'
                      ].map((topic) => (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`topic-${topic}`}
                            checked={formData.technical_test_config.topics.includes(topic)}
                            onCheckedChange={(checked) => {
                              const newTopics = checked
                                ? [...formData.technical_test_config.topics, topic]
                                : formData.technical_test_config.topics.filter(t => t !== topic)
                              handleInputChange('technical_test_config', {
                                ...formData.technical_test_config,
                                topics: newTopics
                              })
                            }}
                          />
                          <Label htmlFor={`topic-${topic}`} className="cursor-pointer">
                            {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technical-passing-score">Passing Score (%)</Label>
                    <Input 
                      id="technical-passing-score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.technical_test_config.passing_score}
                      onChange={(e) => handleInputChange('technical_test_config', {
                        ...formData.technical_test_config,
                        passing_score: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Coding Test Configuration</Label>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coding-difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.coding_test_config.difficulty}
                      onValueChange={(value) => handleInputChange('coding_test_config', {
                        ...formData.coding_test_config,
                        difficulty: value
                      })}
                    >
                      <SelectTrigger id="coding-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="medium">Mid Level (2-5 years)</SelectItem>
                        <SelectItem value="hard">Senior Level (5+ years)</SelectItem>
                        <SelectItem value="expert">Lead/Architect Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coding-duration">Test Duration</Label>
                    <Select
                      value={formData.coding_test_config.duration}
                      onValueChange={(value) => handleInputChange('coding_test_config', {
                        ...formData.coding_test_config,
                        duration: value
                      })}
                    >
                      <SelectTrigger id="coding-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Programming Languages</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'javascript', 'typescript', 'python', 'java',
                        'csharp', 'php', 'ruby', 'go'
                      ].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`lang-${lang}`}
                            checked={formData.coding_test_config.languages.includes(lang)}
                            onCheckedChange={(checked) => {
                              const newLangs = checked
                                ? [...formData.coding_test_config.languages, lang]
                                : formData.coding_test_config.languages.filter(l => l !== lang)
                              handleInputChange('coding_test_config', {
                                ...formData.coding_test_config,
                                languages: newLangs
                              })
                            }}
                          />
                          <Label htmlFor={`lang-${lang}`} className="cursor-pointer">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coding-passing-score">Passing Score (%)</Label>
                    <Input 
                      id="coding-passing-score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.coding_test_config.passing_score}
                      onChange={(e) => handleInputChange('coding_test_config', {
                        ...formData.coding_test_config,
                        passing_score: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isFirstStep(currentStep)}>
                Previous
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Next Step'}
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle>Interview Settings</CardTitle>
              <CardDescription>Configure the interview process for this job position.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Interview Stages</Label>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="ai-screening-interview" 
                      checked={formData.interview_stages.ai_screening}
                      onCheckedChange={(checked) => handleInputChange('interview_stages', {
                        ...formData.interview_stages,
                        ai_screening: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="ai-screening-interview" className="cursor-pointer">
                        AI Screening Interview
                      </Label>
                      <p className="text-sm text-slate-500">
                        Initial automated interview to assess basic qualifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="technical-interview"
                      checked={formData.interview_stages.technical}
                      onCheckedChange={(checked) => handleInputChange('interview_stages', {
                        ...formData.interview_stages,
                        technical: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="technical-interview" className="cursor-pointer">
                        Technical Interview
                      </Label>
                      <p className="text-sm text-slate-500">In-depth assessment of technical skills</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="behavioral-interview"
                      checked={formData.interview_stages.behavioral}
                      onCheckedChange={(checked) => handleInputChange('interview_stages', {
                        ...formData.interview_stages,
                        behavioral: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="behavioral-interview" className="cursor-pointer">
                        Behavioral Interview
                      </Label>
                      <p className="text-sm text-slate-500">Assess soft skills and cultural fit</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="final-interview"
                      checked={formData.interview_stages.final}
                      onCheckedChange={(checked) => handleInputChange('interview_stages', {
                        ...formData.interview_stages,
                        final: checked as boolean
                      })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="final-interview" className="cursor-pointer">
                        Final Interview with Leadership
                      </Label>
                      <p className="text-sm text-slate-500">Final round with senior team members</p>
                    </div>
                  </div>
                </div>
              </div>

              {formData.interview_stages.ai_screening && (
                <div className="space-y-4">
                  <Label>AI Screening Interview Configuration</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interview-format">Interview Format</Label>
                      <RadioGroup 
                        value={formData.ai_interview_config.format}
                        onValueChange={(value) => handleInputChange('ai_interview_config', {
                          ...formData.ai_interview_config,
                          format: value as 'video' | 'audio' | 'text'
                        })}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <Label htmlFor="video" className="cursor-pointer">
                            Video Interview
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="audio" />
                          <Label htmlFor="audio" className="cursor-pointer">
                            Audio Interview
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id="text" />
                          <Label htmlFor="text" className="cursor-pointer">
                            Text-based Interview
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interview-duration">Interview Duration</Label>
                      <Select
                        value={formData.ai_interview_config.duration}
                        onValueChange={(value) => handleInputChange('ai_interview_config', {
                          ...formData.ai_interview_config,
                          duration: value
                        })}
                      >
                        <SelectTrigger id="interview-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interview-questions">Custom Interview Questions</Label>
                      <Textarea
                        id="interview-questions"
                        placeholder="Add any specific questions you'd like to include in the AI interview..."
                        className="min-h-[100px]"
                        value={formData.ai_interview_config.custom_questions}
                        onChange={(e) => handleInputChange('ai_interview_config', {
                          ...formData.ai_interview_config,
                          custom_questions: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="interview-scheduling">Interview Scheduling</Label>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="interview-scheduling" 
                    checked={formData.automated_scheduling}
                    onCheckedChange={(checked) => handleInputChange('automated_scheduling', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="interview-scheduling" className="cursor-pointer">
                      Enable Automated Scheduling
                    </Label>
                    <p className="text-sm text-slate-500">
                      Allow candidates to book interview slots based on your team's availability
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interview-feedback">Interview Feedback</Label>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="interview-feedback" 
                    checked={formData.ai_feedback}
                    onCheckedChange={(checked) => handleInputChange('ai_feedback', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="interview-feedback" className="cursor-pointer">
                      Enable AI Interview Analysis
                    </Label>
                    <p className="text-sm text-slate-500">
                      Our AI will analyze interview responses and provide objective feedback
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={isFirstStep(currentStep)}>
                Previous
              </Button>
              <Button onClick={nextStep} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Job'}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
