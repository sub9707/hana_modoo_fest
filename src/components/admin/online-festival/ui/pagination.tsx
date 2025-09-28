import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
}

export function Pagination({ children, className = '', ...props }: PaginationProps) {
  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} {...props}>
      {children}
    </nav>
  )
}

interface PaginationContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function PaginationContent({ children, className = '', ...props }: PaginationContentProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`} {...props}>
      {children}
    </div>
  )
}

interface PaginationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function PaginationItem({ children, className = '', ...props }: PaginationItemProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  isActive?: boolean
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
  className?: string
}

export function PaginationLink({ 
  href = '#', 
  isActive = false, 
  onClick, 
  children, 
  className = '',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </a>
  )
}

interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export function PaginationPrevious({ 
  href = '#', 
  onClick, 
  className = '',
  ...props
}: PaginationPreviousProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        flex items-center px-3 py-2 text-sm font-medium text-gray-700 
        rounded-md hover:bg-gray-100 transition-colors
        ${className}
      `}
      {...props}
    >
      <ChevronLeft className="w-4 h-4 mr-1" />
      이전
    </a>
  )
}

interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export function PaginationNext({ 
  href = '#', 
  onClick, 
  className = '',
  ...props
}: PaginationNextProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        flex items-center px-3 py-2 text-sm font-medium text-gray-700 
        rounded-md hover:bg-gray-100 transition-colors
        ${className}
      `}
      {...props}
    >
      다음
      <ChevronRight className="w-4 h-4 ml-1" />
    </a>
  )
}