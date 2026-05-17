export function formatDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[date.getDay()]

  if (diff === 0) return `今天 ${month}月${day}日 ${weekDay}`
  if (diff === -1) return `昨天 ${month}月${day}日 ${weekDay}`
  if (diff === 1) return `明天 ${month}月${day}日 ${weekDay}`
  return `${month}月${day}日 ${weekDay}`
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}
