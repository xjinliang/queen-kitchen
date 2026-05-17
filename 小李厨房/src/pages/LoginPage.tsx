import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  if (!loading && user) {
    return <Navigate to="/order" replace />
  }

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const result = isRegister
      ? await signUp(email, password, nickname || '新用户')
      : await signIn(email, password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else if (isRegister) {
      setError('注册成功，请检查邮箱确认（如已关闭邮件确认则可直接登录）')
    } else {
      navigate('/order', { replace: true })
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🍳</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">女王厨房</h1>
          <p className="text-gray-400 mt-1">两个人的美食日记</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base"
                placeholder="你的昵称"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-500 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base"
              placeholder="输入密码"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {submitting ? '请稍候...' : isRegister ? '注册' : '登录'}
          </button>

          <p className="text-center text-sm text-gray-400">
            {isRegister ? '已有账号？' : '没有账号？'}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-primary-500 ml-1"
            >
              {isRegister ? '登录' : '注册'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
