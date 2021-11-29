import { ReactNode } from 'react'
import Image from 'next/image'
import styles from './HCardContent.module.scss'

type Props = {
  title: string
  content: ReactNode
  imgSrc: string
  imgAlt: string
}

export const HCardContent = ({ imgSrc, imgAlt, title, content }: Props) => {
  return (
    <div className={styles.hCardContent}>
      <div className={styles.image}>
        <Image src={imgSrc} alt={imgAlt} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  )
}
