import Link from 'next/link'
import Image from 'next/image'
import styles from './CardFull.module.scss'
import { ReactNode } from 'react'

type Props = {
  img: string
  title: string
  href: string
  children: ReactNode
}

export const CardFull = ({ img, title, href, children }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <Image
          alt={`image of ${title}`}
          src={img}
          layout="fill"
          objectFit="contain"
          quality={100}
        />
      </div>

      {children}
      <Link href={href}>
        <a>Try it now</a>
      </Link>
    </div>
  )
}
