import Image from 'next/image'
import styles from './CardImage.module.css'

type Props = {
  img: string
  alt: string
  width?: number
  height?: number
  layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive' | undefined
  objectFit?: 'cover' | 'contain' | undefined
  className?: string
}

export const CardImage = ({
  img,
  width,
  height,
  layout,
  objectFit,
  alt,
  className
}: Props) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <Image
        src={img}
        width={width}
        height={height}
        layout={layout}
        objectFit={objectFit}
        alt={alt}
      />
    </div>
  )
}
