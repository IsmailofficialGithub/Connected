import LoginForm from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Personal Data Transfer',
  description: 'Sign in to your secure data transfer account',
}

export default function LoginPage() {
  return <LoginForm />
}
