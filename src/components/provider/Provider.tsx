'use client'

import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"
import { AuthRefreshHandler } from "../auth/AuthRefreshHandler"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <AuthRefreshHandler />
      </Suspense>
      {children}
      {/* 페이지 전환 UI */}
      <ProgressBar
        height="3px"
        color="#ea580c"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </AuthProvider>
  )
}