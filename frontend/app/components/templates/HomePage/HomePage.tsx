import styles from './HomePage.module.scss'
import type { Service } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardFull } from '../../modules/CardFull/CardFull'
import { Innovations } from '../../modules/Innovation/Innovations'

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
          />
        ))}
      </div>

      <Innovations data={innovations} />
    </div>
  )
}
