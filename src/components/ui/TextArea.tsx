import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-800">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-transparent ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
)
TextArea.displayName = 'TextArea'
