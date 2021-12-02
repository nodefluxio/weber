import Image from 'next/image'
import styles from './ResponsiveImage.module.scss'

type Props = {
  className?: string
  src: string
  alt: string
  objectFit: NonNullable<JSX.IntrinsicElements['img']['style']>['objectFit']
  onClick?: () => void
}

export const ResponsiveImage = ({
  className,
  src,
  alt,
  objectFit,
  onClick
}: Props) => {
  return (
    <div
      className={`${styles.responsiveImage} ${className}`}
      onClick={() => onClick && onClick()}>
      <Image src={src} alt={alt} layout="fill" objectFit={objectFit} />
    </div>
  )
}
