const colorMap: Record<string, string> = {
  orange: 'bg-primary-50 text-primary-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  gray: 'bg-gray-100 text-gray-500',
}

export default function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${colorMap[color] || colorMap.gray}`}>
      {label}
    </span>
  )
}
