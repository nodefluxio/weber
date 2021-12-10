import Link from 'next/link'
import Image from 'next/image'
import styles from './CardFull.module.scss'
import { ReactNode } from 'react'

type Props = {
  img: string
  title: string
  href: string
  isExternal?: boolean
  isPopUp?: boolean
  target?: string
  onClick?: () => void
  children: ReactNode
}

export const CardFull = ({
  img,
  title,
  href,
  target,
  onClick,
  isExternal = false,
  isPopUp = false,
  children
}: Props) => {
  const anchor = isPopUp ? (
    <a onClick={() => onClick && onClick()}>Try it now</a>
  ) : (
    <a href={href} target={target} onClick={() => onClick && onClick()}>
      Try it now
    </a>
  )

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

      {isExternal ? anchor : <Link href={href}>{anchor}</Link>}
    </div>
  )
}
