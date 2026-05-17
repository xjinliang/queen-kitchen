import type { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export default function Textarea({ label, className = '', ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-500 mb-1">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base resize-none ${className}`}
        rows={5}
        {...props}
      />
    </div>
  )
}
