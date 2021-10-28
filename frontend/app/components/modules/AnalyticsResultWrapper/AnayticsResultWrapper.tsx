import Image from 'next/image'
import { ReactNode } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import styles from './AnalyticsResultWrapper.module.scss'

type Props = {
  imageBase64: string
  children: ReactNode
  handleTryAgain: () => void
}

export const AnalyticsResultWrapper = ({
  imageBase64,
  children,
  handleTryAgain
}: Props) => {
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
            <div>
              <h2>Results</h2>
              {children}
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button color={Color.Primary} onClick={() => handleTryAgain()}>
            Try Again
          </Button>
        </div>
      </div>
    </>
  )
}
