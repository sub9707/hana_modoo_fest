'use client'

import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"
import { AuthRefreshHandler } from "../auth/AuthRefreshHandler"


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
    </AuthProvider>
  )
}