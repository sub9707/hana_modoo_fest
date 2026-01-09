import { LabelHTMLAttributes, ReactNode } from 'react'

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
  optional?: boolean
}

/**
 * 공통 Form Label 컴포넌트
 *
 * @param children - 라벨 텍스트
 * @param required - 필수 표시
 * @param optional - 선택 표시
 */
export default function FormLabel({
  children,
  required = false,
  optional = false,
  className = '',
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`
        block text-sm font-medium text-gray-700
        ${className}
      `.trim()}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-gray-400 ml-1 font-normal">(선택)</span>}
    </label>
  )
}
