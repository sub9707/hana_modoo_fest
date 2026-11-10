import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-70" ref={selectRef}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            ...(typeof child.props === 'object' && child.props ? child.props : {}),
            isOpen,
            setIsOpen,
            value,
            onValueChange
          } as any)
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  onValueChange?: (value: string) => void
}

export function SelectTrigger({ children, className = '', isOpen, setIsOpen, onValueChange, ...props }: SelectTriggerProps) {
  // onValueChange를 받아서 제거 (사용 안함)
  return (
    <button
      onClick={() => setIsOpen?.(!isOpen)}
      className={`
        w-full flex items-center justify-between px-3 py-2 text-left
        border border-gray-300 rounded-md bg-white text-sm
        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500
        ${className}
      `}
      {...props}
    >
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  )
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
  value?: string
  className?: string
}

export function SelectValue({ placeholder = '선택하세요', value, className = '', ...props }: SelectValueProps) {
  return (
    <span className={`${value ? 'text-gray-900' : 'text-gray-500'} ${className}`} {...props}>
      {value || placeholder}
    </span>
  )
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
  onValueChange?: (value: string) => void
}

export function SelectContent({ children, className = '', isOpen, setIsOpen, onValueChange, ...props }: SelectContentProps) {
  if (!isOpen) return null

  return (
    <div className={`
      absolute top-full left-0 right-0 z-50 mt-1 
      bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto
      ${className}
    `} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            ...(typeof child.props === 'object' && child.props ? child.props : {}), 
            setIsOpen, 
            onValueChange 
          } as any)
        }
        return child
      })}
    </div>
  )
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
  className?: string
  setIsOpen?: (open: boolean) => void
  onValueChange?: (value: string) => void
}

export function SelectItem({ value, children, className = '', setIsOpen, onValueChange, ...props }: SelectItemProps) {
  const handleClick = () => {
    onValueChange?.(value)
    setIsOpen?.(false)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        w-full text-left px-3 py-2 text-sm hover:bg-gray-100 
        flex items-center justify-between
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}