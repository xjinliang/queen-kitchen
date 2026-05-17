import { CATEGORIES } from '../../lib/constants'

interface Props {
  selected: string | null
  onSelect: (cat: string | null) => void
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-primary-500 text-white'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}
      >
        全部
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.value
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-500 border border-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
