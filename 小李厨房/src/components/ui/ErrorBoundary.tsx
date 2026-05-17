import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-warm-50">
          <span className="text-6xl mb-4">😵</span>
          <h2 className="text-lg font-semibold text-gray-700">出了点问题</h2>
          <p className="text-sm text-gray-400 mt-1 text-center">请刷新页面重试</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium"
          >
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
