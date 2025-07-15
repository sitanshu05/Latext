'use client'

import { useState } from 'react'
import { signOut } from '@/lib/services/auth'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  variant?: 'button' | 'link'
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({ 
  onSuccess, 
  onError, 
  variant = 'button',
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

  const defaultButtonClass = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
  const defaultLinkClass = "text-red-600 hover:text-red-500 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

  const buttonClass = className || (variant === 'button' ? defaultButtonClass : defaultLinkClass)

  if (variant === 'link') {
    return (
      <span
        onClick={loading ? undefined : handleSignOut}
        className={buttonClass}
        style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Signing out...' : (children || 'Sign Out')}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={buttonClass}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing out...
        </>
      ) : (
        children || 'Sign Out'
      )}
    </button>
  )
} 