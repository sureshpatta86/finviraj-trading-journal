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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white space-y-6"
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
          <p className="text-xl text-purple-200">Account created successfully. Signing you in...</p>
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl relative"
            >
              <TrendingUp className="h-10 w-10 text-white" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Join the Empire
              </CardTitle>
              <CardDescription className="text-xl mt-3 text-purple-200/80 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-300" />
                Start your trading journey today
                <Sparkles className="h-5 w-5 text-purple-300" />
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
                <Alert variant="destructive" className="border-red-400/50 bg-red-500/10 backdrop-blur">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
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
                  <Label htmlFor="name" className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                    disabled={isLoading}
                    className="h-14 border-2 border-white/20 bg-white/5 backdrop-blur text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 text-lg"
                  />
                  {errors.name && (
                    <p className="text-red-300 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled={isLoading}
                    className="h-14 border-2 border-white/20 bg-white/5 backdrop-blur text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 text-lg"
                  />
                  {errors.email && (
                    <p className="text-red-300 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-lg font-semibold text-white/90 flex items-center gap-2">
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
                      className="h-14 border-2 border-white/20 bg-white/5 backdrop-blur text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 text-lg pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white/90 transition-colors"
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
                        <span className="text-white/70">Password strength:</span>
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
                              i <= passwordStrength.strength ? passwordStrength.color : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-red-300 text-sm">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-lg font-semibold text-white/90 flex items-center gap-2">
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
                      className="h-14 border-2 border-white/20 bg-white/5 backdrop-blur text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50 transition-all duration-300 text-lg pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white/90 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-6 w-6" />
                      ) : (
                        <Eye className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 group"
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
              <p className="text-lg text-white/70">
                Already have an account?{' '}
                <Link 
                  href="/auth/signin" 
                  className="font-bold text-purple-300 hover:text-purple-200 transition-colors underline decoration-purple-300/50 hover:decoration-purple-200 underline-offset-4"
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
