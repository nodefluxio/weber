import { Color } from '@/types/elements'
import styles from './ProgressBar.module.scss'

type Props = {
  completed: number
  bgColor: Color
}

export const ProgressBar = ({ bgColor, completed }: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.filler} ${bgColor && styles[bgColor]}`}
        style={{ width: completed + '%' }}>
        <span
          className={styles.label}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={100}>
          {`${completed}%`}
        </span>
      </div>
    </div>
  )
}
