'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { TrendingUp, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, User, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type UserRegistrationData = z.infer<typeof userRegistrationSchema>

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(password || '')

  const handleEmailSignUp = async (data: UserRegistrationData) => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || 'Registration failed')
        return
      }

      setSuccess(true)
      
      // Auto sign in after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (result?.ok) {
          router.push('/')
        }
      }, 2000)

    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/20 to-background relative overflow-hidden">
        {/* Navigation Bar */}
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
          <Button variant="outline" asChild className="bg-background/80 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-foreground space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold">Welcome to Trading Journal!</h1>
          <p className="text-xl text-muted-foreground">Account created successfully. Signing you in...</p>
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        </motion.div>
      </div>
    )
  }

  return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/20 to-background relative overflow-hidden">
        {/* Navigation Bar */}
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
          <Button variant="outline" asChild className="bg-background/80 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <ThemeToggle />
        </div>      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl relative"
            >
              <TrendingUp className="h-10 w-10 text-primary-foreground" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-border"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Join the Empire
              </CardTitle>
              <CardDescription className="text-xl mt-3 text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Start your trading journey today
                <Sparkles className="h-5 w-5 text-primary" />
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-8 px-8 pb-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 backdrop-blur">
                  <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Email Sign Up Form */}
            <motion.form 
              onSubmit={handleSubmit(handleEmailSignUp)} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                    disabled={isLoading}
                    className="h-14 border-2 border-border bg-background/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50 transition-all duration-300 text-lg"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled={isLoading}
                    className="h-14 border-2 border-border bg-background/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50 transition-all duration-300 text-lg"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      {...register('password')}
                      disabled={isLoading}
                      className="h-14 border-2 border-border bg-background/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50 transition-all duration-300 text-lg pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Password strength:</span>
                        <span className={`font-semibold ${
                          passwordStrength.label === 'Strong' ? 'text-green-400' : 
                          passwordStrength.label === 'Good' ? 'text-blue-400' :
                          passwordStrength.label === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-colors ${
                              i <= passwordStrength.strength ? passwordStrength.color : 'bg-muted/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register('confirmPassword')}
                      disabled={isLoading}
                      className="h-14 border-2 border-border bg-background/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50 transition-all duration-300 text-lg pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold text-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 border-0 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-3 h-6 w-6 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/auth/signin" 
                  className="font-bold text-primary hover:text-primary/80 transition-colors underline decoration-primary/50 hover:decoration-primary underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
