import { NavLink } from 'react-router-dom'
import { UtensilsCrossed, BookOpen, ChefHat, User } from 'lucide-react'

const tabs = [
  { to: '/order', label: '点菜', icon: UtensilsCrossed },
  { to: '/library', label: '菜品库', icon: BookOpen },
  { to: '/showcase', label: '成品墙', icon: ChefHat },
  { to: '/profile', label: '我的', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-16 py-1 transition-colors ${
                isActive ? 'text-primary-500' : 'text-gray-400'
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
