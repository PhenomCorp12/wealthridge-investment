'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  Briefcase,
  Shield,
  Check
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const passwordStrength = calculatePasswordStrength(formData.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-500']

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (passwordStrength < 2) {
      setError('Password is too weak. Please use a stronger password.')
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    // Register with Supabase
    const supabase = createClient()
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          full_name: `${formData.firstName} ${formData.lastName}`
        }
      }
    })

    if (supabaseError) {
      setError(supabaseError.message)
    } else if (data.user?.identities?.length === 0) {
      setError('User already registered with this email')
    } else {
      setSuccess('Account created successfully! Please check your email for verification.')

      // Auto-login after successful registration (optional)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (!signInError) {
        setTimeout(() => {
          router.push('/(app)')
          router.refresh()
        }, 2000)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-900 to-purple-800 p-12 flex-col justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-10 w-10 text-white" />
          <span className="text-2xl font-bold text-white">CapitalFlow</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Join the Premier<br />Investment Platform
            </h1>
            <p className="text-indigo-100 text-lg">
              Access institutional-grade tools for deal management, financial analysis,
              and transaction execution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Bank-Level Security</h3>
                <p className="text-indigo-200 text-sm">SOC 2 Type II certified</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Enterprise Features</h3>
                <p className="text-indigo-200 text-sm">Role-based access control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-indigo-200 text-sm">
          <p>Already trusted by 500+ financial institutions worldwide</p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-auto">
        <div className="max-w-2xl w-full space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">CapitalFlow</span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              Start your journey with professional investment tools
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    First Name
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Company Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Company (Optional)
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="company"
                  placeholder="Investment Bank LLC"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Work Email
                </div>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${passwordStrength < 2 ? 'text-red-600' :
                      passwordStrength < 3 ? 'text-orange-600' :
                        passwordStrength < 4 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full ${index <= passwordStrength
                          ? strengthColors[passwordStrength]
                          : 'bg-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1 mt-2">
                    <li className="flex items-center">
                      <Check className={`h-3 w-3 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <Check className={`h-3 w-3 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <Check className={`h-3 w-3 mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                  Privacy Policy
                </Link>
                . I understand that this is a professional platform for financial data.
              </label>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-700 font-medium mb-1">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Professional Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors inline-flex items-center"
              >
                Sign in here
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}