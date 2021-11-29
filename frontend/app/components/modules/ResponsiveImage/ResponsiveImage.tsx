import Image from 'next/image'
import styles from './ResponsiveImage.module.scss'

type Props = {
  className?: string
  src: string
  alt: string
  objectFit: NonNullable<JSX.IntrinsicElements['img']['style']>['objectFit']
}

export const ResponsiveImage = ({ className, src, alt, objectFit }: Props) => {
  return (
    <div className={className || styles.responsiveImage}>
      <Image src={src} alt={alt} layout="fill" objectFit={objectFit} />
    </div>
  )
}
