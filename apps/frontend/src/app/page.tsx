'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/services/auth'
import type { AuthUser } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getCurrentUser()
        if (!error && user) {
          setUser(user)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/project')
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to LaText</CardTitle>
              <CardDescription>
                Please sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-orange-800 text-sm">
                  ⚠️ You are not authenticated
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
