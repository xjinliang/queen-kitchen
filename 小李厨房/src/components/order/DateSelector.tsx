import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, toDateString } from '../../lib/utils'

interface Props {
  date: Date
  onChange: (date: Date) => void
}

export default function DateSelector({ date, onChange }: Props) {
  const addDays = (d: Date, n: number) => {
    const r = new Date(d)
    r.setDate(r.getDate() + n)
    return r
  }

  const isToday = toDateString(date) === toDateString(new Date())

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onChange(addDays(date, -1))}
        className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 active:bg-gray-50"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="text-center">
        <span className="text-sm font-medium text-gray-700">{formatDate(date)}</span>
        {!isToday && (
          <button
            onClick={() => onChange(new Date())}
            className="block mx-auto text-xs text-primary-500 mt-0.5"
          >
            回到今天
          </button>
        )}
      </div>

      <button
        onClick={() => onChange(addDays(date, 1))}
        className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 active:bg-gray-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
