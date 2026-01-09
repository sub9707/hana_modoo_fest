import { forwardRef, TextareaHTMLAttributes } from 'react'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

/**
 * 공통 Form Textarea 컴포넌트
 *
 * @param label - Textarea 라벨
 * @param error - 에러 메시지
 * @param helperText - 도움말 텍스트
 * @param fullWidth - 전체 너비 사용 여부 (기본값: true)
 * @param resize - resize 옵션 (기본값: vertical)
 */
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      resize = 'vertical',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error

    const resizeClasses = {
      'none': 'resize-none',
      'vertical': 'resize-y',
      'horizontal': 'resize-x',
      'both': 'resize'
    }

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors
            sm:text-sm min-h-[100px]
            ${resizeClasses[resize]}
            ${hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled
              ? 'bg-gray-50 cursor-not-allowed text-gray-500'
              : 'bg-white'
            }
            ${className}
          `.trim()}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id || props.name}-error` :
            helperText ? `${props.id || props.name}-helper` :
            undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${props.id || props.name}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${props.id || props.name}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
