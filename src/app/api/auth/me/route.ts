import { getCurrentUser } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getCurrentUser()
    return NextResponse.json({ user })
  } catch (error) {
    console.error('API /auth/me error:', error)
    return NextResponse.json({ user: null })
  }
}