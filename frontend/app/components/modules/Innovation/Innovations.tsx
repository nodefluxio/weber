import { useState } from 'react'
import Image from 'next/image'
import styles from './Innovations.module.scss'
import { Card } from '../Card/Card'
import { Button } from '../../elements/Button/Button'
import { Color, Service } from '../../../types/elements'

type Props = {
  data: Service[]
}

export const Innovations = ({ data }: Props) => {
  const [slideIndex, setSlideIndex] = useState(1)

  const next = () => {
    if (slideIndex !== data.length) {
      setSlideIndex(slideIndex + 1)
    } else if (slideIndex === data.length) {
      setSlideIndex(1)
    }
  }

  const prev = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1)
    } else if (slideIndex === 1) {
      setSlideIndex(data.length)
    }
  }

  const moveDot = (index: number) => {
    setSlideIndex(index)
  }

  return (
    <div className={styles.carousel}>
      {data.map((innovation, index) => (
        <div
          key={innovation.id}
          className={`${styles.background} ${
            slideIndex === index + 1 && styles.active
          }`}>
          <Image
            className={styles.image}
            alt={`image of ${innovation.name}`}
            src={`/assets/images/innovations/${innovation.thumbnail}`}
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className={styles.card}>
            <Card
              title={innovation.name}
              desc={innovation.short_description}
              slug={innovation.slug}
            />
          </div>
        </div>
      ))}

      <div className={styles.dot}>
        {data.map((_, index) => (
          <div
            onClick={() => moveDot(index + 1)}
            className={`${styles.dotItem} ${slideIndex === index + 1 && styles.dotActive}`}></div>
        ))}
      </div>

      <Button
        color={Color.Secondary}
        type={'button'}
        onClick={() => next()}
        className={styles.next}>
        &gt;
      </Button>
      <Button
        color={Color.Secondary}
        type={'button'}
        onClick={() => prev()}
        className={styles.prev}>
        &lt;
      </Button>
    </div>
  )
}
