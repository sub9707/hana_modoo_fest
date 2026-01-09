import { forwardRef, InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

/**
 * 공통 Form Input 컴포넌트
 *
 * @param label - Input 라벨
 * @param error - 에러 메시지
 * @param helperText - 도움말 텍스트
 * @param fullWidth - 전체 너비 사용 여부 (기본값: true)
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, fullWidth = true, className = '', disabled, ...props }, ref) => {
    const hasError = !!error

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

        <input
          ref={ref}
          disabled={disabled}
          className={`
            appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors
            sm:text-sm
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

FormInput.displayName = 'FormInput'

export default FormInput
