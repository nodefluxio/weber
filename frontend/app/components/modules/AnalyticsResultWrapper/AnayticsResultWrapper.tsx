import Image from 'next/image'
import { ReactNode } from 'react'

import styles from './AnalyticsResultWrapper.module.scss'

type Props = {
  imageBase64: string
  children: ReactNode
  handleTryAgain: () => void
}

export const AnalyticsResultWrapper = ({ imageBase64, children }: Props) => {
  return (
    <>
      <div className={styles.result}>
        <div className={styles.resultFlex}>
          <div className={styles.resultImage}>
            {imageBase64 && (
              <Image src={imageBase64} layout="fill" objectFit="contain" />
            )}
          </div>
          <div className={styles.resultInfo}>
            <div className={styles.resultFlexInfo}>
              <h2>Results</h2>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
