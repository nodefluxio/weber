import Image from 'next/image'
import { Card } from '../../modules/Card/Card'
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
        quality={100}
      />
      <div className={styles.card}>
        <Card
          title={title}
          desc={desc}
          slug={slug}
        />
      </div>
    </div>
  )
}
