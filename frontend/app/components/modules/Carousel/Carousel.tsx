import { useState, ReactElement } from 'react'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'
import styles from './Carousel.module.scss'

type Props = {
  children: ReactElement[]
}

export const Carousel = ({ children }: Props) => {
  const [slideIndex, setSlideIndex] = useState(1)

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
      <h1>New Innovations</h1>
      {children.map((child, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            slideIndex === index + 1 && styles.slideActive
          }`}>
          {child}
        </div>
      ))}
      <div className={styles.dot}>
        {children.map((_, index) => (
          <div
            key={index}
            onClick={() => moveDot(index + 1)}
            className={`${styles.dotItem} ${
              slideIndex === index + 1 && styles.dotActive
            }`}></div>
        ))}
      </div>
      <Button
        color={Color.Secondary}
        type={'button'}
        rounded={true}
        onClick={() => prev()}
        className={styles.prev}>
        ➜
      </Button>
      <Button
        color={Color.Secondary}
        type={'button'}
        rounded={true}
        onClick={() => next()}
        className={styles.next}>
        ➜
      </Button>
    </div>
  )
}
