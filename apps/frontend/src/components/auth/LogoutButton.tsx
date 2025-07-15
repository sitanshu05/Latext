'use client'

import { useState } from 'react'
import { signOut } from '@/lib/services/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'

interface LogoutButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({ 
  onSuccess, 
  onError, 
  variant = 'destructive',
  size = 'default',
  className,
  children 
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      const { error } = await signOut()
      
      if (error) {
        if (onError) {
          onError(error.message)
        } else {
          console.error('Sign out error:', error.message)
        }
      } else {
        // Success
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/auth/login')
        }
      }
    } catch (err) {
      const errorMessage = 'Failed to sign out'
      if (onError) {
        onError(errorMessage)
      } else {
        console.error('Sign out error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {children || 'Sign Out'}
        </>
      )}
    </Button>
  )
} 