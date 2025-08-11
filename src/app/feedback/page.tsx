'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  TrendingUp, 
  ArrowLeft,
  Send,
  MessageSquare,
  Star,
  Bug,
  Lightbulb,
  Heart,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    subject: '',
    message: '',
    rating: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRatingClick = (rating: number) => {
    setFormData({
      ...formData,
      rating
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const error = await response.json()
        console.error('Error submitting feedback:', error)
        // You could show an error message here
      }
    } catch (error) {
      console.error('Network error:', error)
      // You could show an error message here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
        <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinViraj Trading Journal
              </span>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Your feedback has been received. We appreciate you taking the time to help us improve FinViraj.
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
                <div>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Submit Another Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinViraj Trading Journal
            </span>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              We Value Your Feedback
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Help us improve FinViraj by sharing your thoughts, suggestions, or reporting issues
            </p>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Share Your Feedback
                  </CardTitle>
                  <CardDescription>
                    Your input helps us create a better trading experience for everyone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    {/* Feedback Type */}
                    <div className="space-y-2">
                      <Label htmlFor="feedbackType">Feedback Type</Label>
                      <Select
                        id="feedbackType"
                        name="feedbackType"
                        value={formData.feedbackType}
                        onChange={handleInputChange}
                      >
                        <option value="general">General Feedback</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="improvement">Improvement Suggestion</option>
                        <option value="support">Support Request</option>
                        <option value="compliment">Compliment</option>
                      </Select>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <Label>Overall Rating (Optional)</Label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className={`p-1 rounded transition-colors ${
                              star <= formData.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                            }`}
                          >
                            <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                        {formData.rating > 0 && (
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {formData.rating} out of 5 stars
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief summary of your feedback"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed feedback..."
                        rows={6}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Feedback Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Feature Requests</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suggest new features or improvements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Bug className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Bug Reports</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Report issues or unexpected behavior
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-pink-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">General Feedback</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Share your overall experience
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        sureshnani@gmail.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +91-**********
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hyderabad, INDIA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Response Time</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We aim to respond to all feedback within 24-48 hours.
                      Thank you for your patience!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
