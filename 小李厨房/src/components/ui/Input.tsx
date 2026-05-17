import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-500 mb-1">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
