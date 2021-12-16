import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`w-full overflow-hidden border border-solid 
      border-primary-500 rounded-3xl relative m-auto ${className}`}>
      {children}
    </div>
  )
}
