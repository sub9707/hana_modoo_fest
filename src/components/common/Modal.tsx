'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  className?: string
  contentClassName?: string
}

export default function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
  contentClassName = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <div className={`fixed inset-0 z-[9999] ${className}`}>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4
                      transform animate-modalSlideIn pointer-events-auto
                      ${contentClassName}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* 닫기 버튼 */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900
                         transition-colors rounded-full bg-gray-100 hover:bg-gray-200 z-10"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  )

  // Portal로 body에 직접 렌더링
  return createPortal(modalContent, document.body)
}
