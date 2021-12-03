import Image from 'next/image'
import { CSSProperties } from 'react'
import styles from './WarningDiv.module.scss'

type Props = {
  message: string
  className?: string
}

export const WarningDiv = ({ message, className }: Props) => {
  return (
    <div
      className={`${styles.warningDivWrapper} ${
        message && styles.warningDivWrapperActive
      } ${className}`}>
      {message && (
        <Image src={'/assets/icons/error-icon.svg'} width={32} height={32} />
      )}
      <span>{message}</span>
    </div>
  )
}
