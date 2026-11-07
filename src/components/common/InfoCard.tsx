import { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  children: ReactNode
  className?: string
}

export default function InfoCard({ title, children, className = '' }: InfoCardProps) {
  return (
    <section className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </section>
  )
}
