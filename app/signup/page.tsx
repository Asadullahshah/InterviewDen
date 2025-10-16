"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
    industry: "",
    size: "",
    website: "",
    location: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (userType: "candidate" | "company") => {
    try {
      setIsLoading(true)

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: userType,
            name: formData.name,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Insert into profiles
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: formData.email,
          name: userType === "company" ? formData.companyName : formData.name,
          user_type: userType,
        })
        if (profileError) throw profileError

        // Insert into companies if company
        if (userType === "company") {
          const { error: companyError } = await supabase.from("companies").insert({
            id: data.user.id,
            company_name: formData.companyName,
            industry: formData.industry,
            size: formData.size,
            website: formData.website,
            location: formData.location,
            description: formData.description,
          })
          if (companyError) throw companyError
        }

        toast.success("Signup successful! Please check your email for verification.")
        router.push("/login")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to get started
          </p>
        </div>

        <Tabs defaultValue="candidate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidate">Candidate</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>

          <TabsContent value="candidate">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSignup("candidate")
              }}
              className="mt-8 space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up as Candidate"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                  Sign in
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="company">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSignup("company")
              }}
              className="mt-8 space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <Input id="companyName" name="companyName" type="text" required value={formData.companyName} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <Input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                  <Input id="industry" name="industry" type="text" value={formData.industry} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">Company Size</label>
                  <Input id="size" name="size" type="text" value={formData.size} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                  <Input id="website" name="website" type="text" value={formData.website} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <Input id="location" name="location" type="text" value={formData.location} onChange={handleInputChange} className="mt-1" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" rows={3} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up as Company"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                  Sign in
                </Link>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
