import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  title?: string
}

export const HorizontalCard = ({ children, className, title }: Props) => {
  return (
    <div className="w-full">
      {title && <h2 className="text-left">{title}</h2>}
      <div className={`overflow-hidden relative m-auto flex flex-row justify-between ${className}`}>{children}</div>
    </div>
  )
}
