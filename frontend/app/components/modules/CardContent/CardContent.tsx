import { ReactNode } from 'react'
import { Color } from '../../../types/elements'
import styles from './CardContent.module.scss'

type Props = {
  children: ReactNode
  title?: string
  color?: Color
  height?: string
  className?: string
}

export const CardContent = ({
  title,
  color,
  children,
  className,
  height
}: Props) => {
  return (
    <div
      className={`${styles.content} ${color && styles[color]} ${className}`}
      style={{ height: height }}>
      {title && <h3>{title}</h3>}
      <div className={styles.children}> {children}</div>
    </div>
  )
}
