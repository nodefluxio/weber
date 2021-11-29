import Image from 'next/image'
import styles from './ResponsiveImage.module.scss'

type Props = {
  className?: string
  src: string
  alt: string
}

export const ResponsiveImage = ({ className, src, alt }: Props) => {
  return (
    <div className={className || styles.responsiveImage}>
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  )
}
