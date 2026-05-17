import type { SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className = '', ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-500 mb-1">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base bg-white ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
