'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { TrendingUp, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userRegistrationSchema, type UserRegistrationData } from '@/lib/validations'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema)
  })

  const password = watch('password')

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Check if Google provider is available
      const providers = await fetch('/api/auth/providers').then(res => res.json())
      
      if (!providers.google) {
        setError('Google authentication is not configured. Please use email/password to create an account.')
        return
      }
      
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false
      })

      if (result?.error) {
        setError('Failed to sign up with Google. Please try again.')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError('Google authentication is not available. Please use email/password to create an account.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (data: UserRegistrationData) => {
    try {
      setIsLoading(true)
      setError('')

      // Create user account via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create account')
      }

      setSuccess(true)
      
      // Auto sign in after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (result?.error) {
          router.push('/auth/signin')
        } else {
          router.push('/')
        }
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '' }
    
    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ]
    
    strength = checks.filter(Boolean).length
    
    const strengthTexts = [
      '', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'
    ]
    
    return { strength, text: strengthTexts[strength] }
  }

  const passwordStrength = getPasswordStrength(password || '')

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 text-center">
            <CardContent className="pt-6 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Account Created Successfully!
              </CardTitle>
              <CardDescription>
                You're being redirected to your dashboard...
              </CardDescription>
              <Icons.spinner className="mx-auto h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>
              Start tracking your trading journey today
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign Up Button - Hidden for now */}
            {/* TODO: Uncomment when Google OAuth is configured
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            */}

            {/* Email Sign Up Form */}
            <form onSubmit={handleSubmit(handleEmailSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-500' :
                        passwordStrength.strength <= 3 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.strength <= 2 ? 'bg-red-500' :
                          passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
