import { Metadata } from 'next'
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm'

export const metadata: Metadata = {
  title: '비밀번호 찾기 | 모두하나대축제 2025',
  description: '전화번호 인증을 통한 비밀번호 재설정',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}