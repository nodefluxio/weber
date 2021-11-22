import styles from './CarouselItem.module.scss'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}
export const CarouselItem = ({ children, className }: Props) => {
  return <div className={`${styles.carouselItem} ${className}`}>{children}</div>
}
