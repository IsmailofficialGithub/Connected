import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardHeader from '@/components/layout/DashboardHeader'
import UserProfile from '@/components/auth/UserProfile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your account settings and preferences',
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <UserProfile />
        </main>
      </div>
    </ProtectedRoute>
  )
}