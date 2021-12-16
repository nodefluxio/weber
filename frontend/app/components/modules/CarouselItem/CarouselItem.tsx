import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}
export const CarouselItem = ({ children, className }: Props) => {
  return (
    <div
      className={`relative w-full h-full bg-primary overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
