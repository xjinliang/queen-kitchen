import type { MealType } from '../../types'

interface Props {
  active: MealType
  onChange: (type: MealType) => void
}

const types: { value: MealType; label: string; emoji: string }[] = [
  { value: '午餐', label: '午餐', emoji: '🌞' },
  { value: '晚餐', label: '晚餐', emoji: '🌙' },
]

export default function MealTypeTab({ active, onChange }: Props) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1">
      {types.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === t.value
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-400'
          }`}
        >
          {t.emoji} {t.label}
        </button>
      ))}
    </div>
  )
}
