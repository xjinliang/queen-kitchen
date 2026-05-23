import { useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDishes } from '../hooks/useDishes'
import { useCookedMeals } from '../hooks/useCookedMeals'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { LogOut, Heart } from 'lucide-react'

const LOVE_START = new Date('2023-11-01')

function getLoveDuration() {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - LOVE_START.getTime()) / (1000 * 60 * 60 * 24))
  let years = 0, months = 0, days = diffDays

  // Count years and months day-by-day for accuracy
  const cursor = new Date(LOVE_START)
  while (true) {
    const nextYear = new Date(cursor)
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    if (nextYear <= now) {
      years++
      cursor.setFullYear(cursor.getFullYear() + 1)
    } else {
      break
    }
  }
  while (true) {
    const nextMonth = new Date(cursor)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    if (nextMonth <= now) {
      months++
      cursor.setMonth(cursor.getMonth() + 1)
    } else {
      break
    }
  }
  days = Math.floor((now.getTime() - cursor.getTime()) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays: diffDays }
}

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const { dishes } = useDishes()
  const { meals } = useCookedMeals()

  const love = useMemo(() => getLoveDuration(), [])

  const myDishes = dishes.filter(d => d.created_by === user?.id)
  const myMeals = meals.filter(m => m.cooked_by === user?.id)

  const dishNameCount: Record<string, number> = {}
  myMeals.forEach(m => {
    if (m.dish) {
      dishNameCount[m.dish.name] = (dishNameCount[m.dish.name] || 0) + 1
    }
  })
  const topDish = Object.entries(dishNameCount).sort((a, b) => b[1] - a[1])[0]

  return (
    <div>
      {/* Profile card */}
      <Card className="p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            '👨‍🍳'
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{profile?.nickname || '用户'}</h2>
          <p className="text-sm text-gray-400">已做 {myMeals.length} 道菜</p>
        </div>
      </Card>

      {/* Love counter */}
      <Card className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-pink-400 fill-pink-400" />
          <span className="text-sm text-pink-400 font-medium">相恋</span>
          <span className="text-xs text-pink-300 ml-auto">2023.11.01</span>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-pink-500">
            {love.years > 0 && <span>{love.years} 年 </span>}
            {love.months > 0 && <span>{love.months} 个月 </span>}
            <span>{love.days} 天</span>
          </p>
          <p className="text-xs text-pink-300 mt-1">共 {love.totalDays} 天</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-500">{myDishes.length}</p>
          <p className="text-xs text-gray-400 mt-1">添加的菜品</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-500">{myMeals.length}</p>
          <p className="text-xs text-gray-400 mt-1">做菜记录</p>
        </Card>
      </div>

      {topDish && (
        <Card className="p-4 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">做的最多的菜</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">{topDish[0]}</p>
            </div>
            <span className="text-sm text-primary-500 font-medium">{topDish[1]} 次</span>
          </div>
        </Card>
      )}

      {/* Sign out */}
      <div className="mt-6">
        <Button
          variant="secondary"
          onClick={signOut}
          className="w-full text-gray-500"
        >
          <LogOut size={18} />
          退出登录
        </Button>
      </div>
    </div>
  )
}
