import { useState, ReactElement, useEffect } from 'react'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'

type Props = {
  children: ReactElement[]
  withButton?: boolean
  vertical?: boolean
  delay?: number
  className?: string
}

export const Carousel = ({
  children,
  withButton = true,
  vertical = false,
  delay = 3000,
  className
}: Props) => {
  const [slideIndex, setSlideIndex] = useState(1)
  const [isDotClicked, setIsDotClicked] = useState(false)

  useEffect(() => {
    if (!isDotClicked) {
      const timer = setTimeout(() => {
        if (slideIndex === children.length) moveDot(1)
        else moveDot(slideIndex + 1)
      }, delay)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [slideIndex, isDotClicked, children.length, delay])

  const next = () => {
    if (slideIndex !== children.length) {
      setSlideIndex(slideIndex + 1)
    } else if (slideIndex === children.length) {
      setSlideIndex(1)
    }
  }

  const prev = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1)
    } else if (slideIndex === 1) {
      setSlideIndex(children.length)
    }
  }

  const moveDot = (index: number) => {
    setSlideIndex(index)
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`relative  ${
            slideIndex === index + 1 ? 'block' : 'hidden'
          }`}>
          {child}
        </div>
      ))}
      {/* dot */}
      <div
        className={`absolute  bottom-8 left-1/2 -translate-x-1/2 flex ${
          vertical &&
          'bottom-1/2 left-[unset] right-[5%] -translate-x-1/2 translate-y-1/2 flex-col'
        }`}>
        {children.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setIsDotClicked(true)
              moveDot(index + 1)
            }}
            className={`w-4 h-4 rounded-full mx-1.5 cursor-pointer ${
              vertical && 'mx-0 my-1.5'
            } ${
              // dot active
              slideIndex === index + 1
                ? 'bg-secondary-500 cursor-auto'
                : 'bg-white'
            }`}></div>
        ))}
      </div>
      {withButton && (
        <>
          <Button
            color={Color.Secondary}
            type={'button'}
            onClick={() => {
              setIsDotClicked(true)
              prev()
            }}
            className="absolute left-[5vw] top-[90vh] sm:top-[50vh] -scale-x-100
            w-12 h-12 py-2 px-4 rounded-full text-white">
            ➜
          </Button>
          <Button
            color={Color.Secondary}
            type={'button'}
            onClick={() => {
              setIsDotClicked(true)
              next()
            }}
            className="absolute right-[5vw] top-[90vh] sm:top-[50vh]
            w-12 h-12 py-2 px-4 rounded-full text-white">
            ➜
          </Button>
        </>
      )}
    </div>
  )
}
