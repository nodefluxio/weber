import { useState, ReactElement, useEffect } from 'react'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'
import styles from './Carousel.module.scss'

type Props = {
  children: ReactElement[]
  withButton?: boolean
  vertical?: boolean
  delay?: number
}

export const Carousel = ({
  children,
  withButton = true,
  vertical = false,
  delay = 3000
}: Props) => {
  const [slideIndex, setSlideIndex] = useState(1)
  const [isDotClicked, setIsDotClicked] = useState(false)

  useEffect(() => {
    if (!isDotClicked) {
      setTimeout(() => {
        if (slideIndex === children.length) moveDot(1)
        else moveDot(slideIndex + 1)
      }, delay)
    }
  }, [slideIndex])

  const next = () => {
    if (slideIndex !== children.length) {
      setSlideIndex(slideIndex + 1)
    } else if (slideIndex === children.length) {
      setSlideIndex(1)
    }
  }

  const prev = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1)
    } else if (slideIndex === 1) {
      setSlideIndex(children.length)
    }
  }

  const moveDot = (index: number) => {
    setSlideIndex(index)
  }

  return (
    <div className={styles.carousel}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            slideIndex === index + 1 && styles.slideActive
          }`}>
          {child}
        </div>
      ))}
      <div className={`${styles.dot} ${vertical && styles.vertical}`}>
        {children.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setIsDotClicked(true)
              moveDot(index + 1)
            }}
            className={`${styles.dotItem} ${
              slideIndex === index + 1 && styles.dotActive
            }`}></div>
        ))}
      </div>
      {withButton && (
        <>
          <Button
            color={Color.Secondary}
            type={'button'}
            rounded={true}
            onClick={() => {
              setIsDotClicked(true)
              prev()
            }}
            className={styles.prev}>
            ➜
          </Button>
          <Button
            color={Color.Secondary}
            type={'button'}
            rounded={true}
            onClick={() => {
              setIsDotClicked(true)
              next()
            }}
            className={styles.next}>
            ➜
          </Button>
        </>
      )}
    </div>
  )
}
