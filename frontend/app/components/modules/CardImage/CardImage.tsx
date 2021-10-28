import Image from 'next/image'
import styles from './CardImage.module.scss'

type Props = {
  img: string
  imgWidth: number
  imgHeight: number
  className?: string
}

export const CardImage = ({ img, imgWidth, imgHeight, className }: Props) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <Image src={img} width={imgWidth} height={imgHeight} />
    </div>
  )
}
