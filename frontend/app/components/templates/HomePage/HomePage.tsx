import styles from './HomePage.module.scss'
import type { Service } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardFull } from '../../modules/CardFull/CardFull'

type Props = {
  analytics: Service[]
  solutions: Service[]
}

export const HomePage = ({ analytics, solutions }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {solutions.map((solution) => (
          <CardFull
            key={solution.id}
            img={`/assets/solutions/${solution.thumbnail}`}
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
            img={`/assets/analytics/${analytic.thumbnail}`}
            title={analytic.name}
            desc={analytic.short_description}
            slug={analytic.slug}
          />
        ))}
      </div>
    </div>
  )
}
