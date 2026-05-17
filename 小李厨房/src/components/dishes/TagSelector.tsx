import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { PRESET_TAGS } from '../../lib/constants'

interface Props {
  selected: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selected, onChange }: Props) {
  const [customInput, setCustomInput] = useState('')

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  const addCustomTag = () => {
    const tag = customInput.trim()
    if (tag && !selected.includes(tag)) {
      onChange([...selected, tag])
    }
    setCustomInput('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESET_TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selected.includes(tag)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs"
            >
              {tag}
              <button type="button" onClick={() => toggleTag(tag)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
          placeholder="自定义标签..."
          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary-400"
        />
        <button
          type="button"
          onClick={addCustomTag}
          disabled={!customInput.trim()}
          className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
