'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Send,
  MessageSquare,
  Star,
  Bug,
  Lightbulb,
  Heart,
  CheckCircle
} from 'lucide-react'

export default function DashboardFeedbackPage() {
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
        setFormData({
          name: '',
          email: '',
          feedbackType: 'general',
          subject: '',
          message: '',
          rating: 0
        })
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-red-500' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'compliment', label: 'Compliment', icon: Heart, color: 'bg-pink-500' }
  ]

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your feedback has been submitted successfully. We appreciate your input!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4"
            >
              Submit Another Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">We Value Your Feedback</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help us improve your trading experience. Your feedback is crucial for making our platform better.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Share Your Thoughts
                </CardTitle>
                <CardDescription>
                  Tell us about your experience or suggest improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Feedback Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {feedbackTypes.map((type) => {
                        const IconComponent = type.icon
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, feedbackType: type.id })}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.feedbackType === type.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${type.color}`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium">{type.label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Rate Your Experience</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {formData.rating > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {formData.rating} out of 5 stars
                      </Badge>
                    )}
                  </div>

                  {/* Name and Email */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your feedback"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed feedback..."
                      rows={5}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Bug Reports</h4>
                  <p className="text-xs text-muted-foreground">
                    Include steps to reproduce, expected vs actual behavior, and your browser/device info.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Feature Requests</h4>
                  <p className="text-xs text-muted-foreground">
                    Describe the problem you&apos;re trying to solve and how the feature would help.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">General Feedback</h4>
                  <p className="text-xs text-muted-foreground">
                    Share your overall experience, what you love, and areas for improvement.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Email Support</p>
                  <p className="text-muted-foreground">support@finviraj.com</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Usually within 24 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
