import { useRef, type ReactNode } from 'react'

interface Props {
  show: boolean
  children: ReactNode
}

export default function KeepAlive({ show, children }: Props) {
  const hasMounted = useRef(false)
  if (show) hasMounted.current = true
  if (!hasMounted.current) return null

  return (
    <div style={{ display: show ? 'block' : 'none' }} aria-hidden={!show}>
      {children}
    </div>
  )
}
