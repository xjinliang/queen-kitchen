import { useAuth } from '../hooks/useAuth'
import { useDishes } from '../hooks/useDishes'
import { useCookedMeals } from '../hooks/useCookedMeals'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const { dishes } = useDishes()
  const { meals } = useCookedMeals()

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
