import SignupForm from '@/components/auth/SignupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Personal Data Transfer',
  description: 'Create your secure data transfer account',
}

export default function SignupPage() {
  return <SignupForm />
}