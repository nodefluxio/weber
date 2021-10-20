import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'
import styles from './Card.module.scss'

type Props = {
  img?: string
  title: string
  desc: string
  slug: string
  color?: Color
}

export const Card = ({ img, title, desc, slug, color }: Props) => {
  return (
    <div className={`${styles.card} ${color && styles[color]}`}>
      {img && (
        <div className={styles.cover}>
          <Image src={img} width={100} height={100} />
        </div>
      )}

      <div className={`${styles.body} ${color && styles[color]}`}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className={styles.footer}>
          <Link href={'/analytics/' + slug} passHref>
            <Button type="link" color={color === 'secondary' ? Color.Primary : Color.Secondary}>
              Try It Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
