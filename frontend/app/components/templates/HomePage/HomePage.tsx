import Image from 'next/image'
import styles from './HomePage.module.scss'
import { Color, Service } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardFull } from '../../modules/CardFull/CardFull'
import { Innovations } from '../../modules/Innovation/Innovations'
import { Carousel } from '../../modules/Carousel/Carousel'
import { CarouselItem } from '../../modules/CarouselItem/CarouselItem'

type Props = {
  analytics: Service[]
  solutions: Service[]
  innovations: Service[]
}

export const HomePage = ({ analytics, solutions, innovations }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {solutions.map((solution) => (
          <CardFull
            key={solution.id}
            img={`/assets/images/solutions/${solution.thumbnail}`}
            title={solution.name}
            desc={solution.short_description}
            href={solution.slug}
          />
        ))}
      </div>

      <div className={styles.cards}>
        {analytics.map((analytic) => (
          <Card
            key={analytic.id}
            img={`/assets/images/analytics/${analytic.thumbnail}`}
            title={analytic.name}
            desc={analytic.short_description}
            slug={analytic.slug}
            color={Color.Primary}
          />
        ))}
      </div>

      <Carousel>
        {innovations.map((innovation) => (
          <CarouselItem
            key={innovation.id}
            img={`/assets/images/innovations/${innovation.thumbnail}`}
            title={innovation.name}
            desc={innovation.short_description}
            slug={innovation.slug}
          />
        ))}
      </Carousel>
    </div>
  )
}
