'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { supabase } from '@/lib/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the authorization code from the URL
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Auth callback error:', error)
            setError(error.message)
            setLoading(false)
            return
          }

          if (data.session) {
            // Success - redirect to home or intended page
            const redirectUrl = searchParams.get('redirect_url') || '/'
            router.push(redirectUrl)
            return
          }
        }

        // If no code or session, check if there's already a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session check error:', sessionError)
          setError(sessionError.message)
          setLoading(false)
          return
        }

        if (sessionData.session) {
          // Already have a session, redirect to home
          const redirectUrl = searchParams.get('redirect_url') || '/'
          router.push(redirectUrl)
        } else {
          // No session found, redirect to login
          router.push('/auth/login?error=auth_callback_failed')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setError('An unexpected error occurred during authentication')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-destructive">Authentication Failed</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-primary hover:underline"
              >
                Try Again
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
} 