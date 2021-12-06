import Image from 'next/image'
import styles from './WarningDiv.module.scss'

type Props = {
  message: string
  className?: string
}

export const WarningDiv = ({ message, className }: Props) => {
  return (
    <div className={className}>
      <div
        className={`${styles.warningDivWrapper} ${
          message && styles.warningDivWrapperActive
        }`}>
        {message && (
          <Image src={'/assets/icons/error-icon.svg'} width={32} height={32} />
        )}
        <span className={styles.messageSpan}>{message}</span>
      </div>
    </div>
  )
}
