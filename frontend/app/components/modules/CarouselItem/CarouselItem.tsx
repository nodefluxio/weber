import Image from 'next/image'
import { Color } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardContent } from '../CardContent/CardContent'
import { Button } from '../../elements/Button/Button'
import Link from 'next/link'
import styles from './CarouselItem.module.scss'

type Props = {
  img: string
  title: string
  desc: string
  slug: string
}

export const CarouselItem = ({ img, title, desc, slug }: Props) => {
  return (
    <div className={styles.carouselItem}>
      <Image
        className={styles.image}
        alt={`image of ${title}`}
        src={img}
        layout="fill"
        objectFit="cover"
      />
      <Card className={styles.card}>
        <CardContent
          className={styles.cardContent}
          title={title}
          height={'400px'}>
          {desc}
          <div className={styles.footer}>
            <Link href={'/innovations/' + slug} passHref>
              <Button type="link" color={Color.Secondary}>
                Try It Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
