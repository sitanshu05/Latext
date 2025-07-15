import { LogoutButton } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-border rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-4">
                Welcome to your Dashboard!
              </h1>
              <p className="text-muted-foreground mb-8">
                You have successfully signed in to your account.
              </p>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Status</CardTitle>
                    <CardDescription>
                      Current authentication state
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-600 font-medium">✅ Authenticated</p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 