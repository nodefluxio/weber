import { Color } from '../../../types/elements'
import styles from './Card.module.scss'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  color?: Color
  className?: string
}

export const Card = ({ color, children, className }: Props) => {
  return (
    <div className={`${styles.card} ${color && styles[color]} ${className}`}>
      {children}
    </div>
  )
}
