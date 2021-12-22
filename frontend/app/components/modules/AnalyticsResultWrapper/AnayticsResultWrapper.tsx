import { ReactNode } from 'react'
import { ResponsiveImage } from '../ResponsiveImage/ResponsiveImage'

type Props = {
  imageBase64: string
  children: ReactNode
  handleTryAgain: () => void
  className?: string
}

export const AnalyticsResultWrapper = ({
  imageBase64,
  children,
  className
}: Props) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row justify-center items-center">
        {imageBase64 && (
          <ResponsiveImage
            className="h-48 w-full max-w-xs md:max-w-lg md:w-1/2 md:mr-12 md:h-80"
            src={imageBase64}
            objectFit="fill"
            alt="inputed image"
          />
        )}
        <div className="mt-6 w-full md:w-1/2 md:self-start md:mt-0 max-w-lg">
          <h3 className="font-medium text-lg mb-2">Results</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
