import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export const CardContent = ({ children, className }: Props) => {
  return (
    <div className={`bg-primary-500 h-full rounded-t-3xl ${className}`}>
      {children}
    </div>
  )
}
