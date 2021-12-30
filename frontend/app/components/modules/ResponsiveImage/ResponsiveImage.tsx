import Image, { ImageProps } from 'next/image'

interface Props extends ImageProps {
  className?: string
  src: string
  alt: string
  objectFit: NonNullable<JSX.IntrinsicElements['img']['style']>['objectFit']
  imgClassName?: string
  onClick?: () => void
}

export const ResponsiveImage = ({
  className,
  src,
  alt,
  objectFit,
  imgClassName,
  onClick,
  ...props
}: Props) => {
  return (
    <div
      className={`relative ${className}`}
      onClick={() => onClick && onClick()}>
      <Image
        className={imgClassName}
        src={src}
        alt={alt}
        layout="fill"
        objectFit={objectFit}
        {...props}
      />
    </div>
  )
}
