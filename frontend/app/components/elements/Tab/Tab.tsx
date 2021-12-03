import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title: string
  className?: string
}

export const Tab = ({ children, title, className }: Props) => {
  return (
    <div className={className} title={title}>
      {children}
    </div>
  )
}
