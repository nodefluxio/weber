import Link from 'next/link'
import Image from 'next/image'
import styles from './CardFull.module.scss'

type Props = {
  img: string
  title: string
  desc: string
  href: string
}

export const CardFull = ({ img, title, desc, href }: Props) => {
  return (
    <div className={styles.card}>
      <Image
        className={styles.image}
        alt={`image of ${title}`}
        src={img}
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className={styles.body}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <Link href={href}>
        <a>Try it now</a>
      </Link>
    </div>
  )
}
