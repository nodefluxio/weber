import Image from 'next/image'
import { CSSProperties } from 'react'
import styles from './WarningDiv.module.scss'

type Props = {
  message: string
  style?: CSSProperties
}

export const WarningDiv = ({ message, style }: Props) => {
  return (
    <div className={`${styles.warningDivWrapper} ${message && styles.warningDivWrapperActive}`} style={style}>
      {message && <Image src={'/assets/icons/warning.svg'} width={30} height={30} />}
      <span>{message}</span>
    </div>
  )
}
