import { ReactNode } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string | ReactNode
  children?: ReactNode
  icon?: ReactNode | boolean
  onClose?: () => void
  className?: string
}

/**
 * 공통 Alert 컴포넌트
 *
 * @param type - Alert 타입 (info, success, warning, error)
 * @param title - Alert 제목 (선택)
 * @param message - Alert 메시지
 * @param children - message 대신 children 사용 가능
 * @param icon - 커스텀 아이콘 또는 false로 숨김 (기본: 타입별 자동)
 * @param onClose - 닫기 버튼 클릭 핸들러 (제공시 닫기 버튼 표시)
 * @param className - 추가 CSS 클래스
 */
export default function Alert({
  type = 'info',
  title,
  message,
  children,
  icon,
  onClose,
  className = ''
}: AlertProps) {
  // 타입별 스타일 매핑
  const typeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: <Info className="w-5 h-5" />,
      iconColor: 'text-blue-500'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-700',
      icon: <CheckCircle className="w-5 h-5" />,
      iconColor: 'text-green-500'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: 'text-yellow-500'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-700',
      icon: <AlertCircle className="w-5 h-5" />,
      iconColor: 'text-red-500'
    }
  }

  const styles = typeStyles[type]

  // 아이콘 결정
  const renderIcon = () => {
    if (icon === false) return null
    if (icon && icon !== true) return icon
    return styles.icon
  }

  return (
    <div
      className={`
        ${styles.container}
        border rounded-lg px-4 py-3
        ${className}
      `.trim()}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        {renderIcon() && (
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            {renderIcon()}
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-sm mb-1">
              {title}
            </h3>
          )}
          {message && (
            <div className="text-sm">
              {message}
            </div>
          )}
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
        </div>

        {/* 닫기 버튼 */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
