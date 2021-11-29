import styles from './HorizontalCard.module.scss'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  title?: string
}

export const HorizontalCard = ({ children, className, title }: Props) => {
  return (
    <div className={styles.horizontalCard}>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.card} ${className}`}>{children}</div>
    </div>
  )
}
