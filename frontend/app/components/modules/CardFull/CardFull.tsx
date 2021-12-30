import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  isExternal?: boolean
  isPopUp?: boolean
  target?: string
  onClick?: () => void
  className?: string
}

export const CardFull = ({
  href,
  target,
  onClick,
  isExternal = false,
  isPopUp = false,
  children,
  className
}: Props) => {
  const anchor = isPopUp ? (
    <a
      className="text-transparent absolute top-0 left-0 right-0 bottom-0 content-['']"
      onClick={() => onClick && onClick()}>
      Try it now
    </a>
  ) : (
    <a
      className="text-transparent absolute top-0 left-0 right-0 bottom-0 content-['']"
      href={href}
      target={target}
      onClick={() => onClick && onClick()}>
      Try it now
    </a>
  )

  return (
    <div
      className={`relative w-full m-auto overflow-hidden 
      text-white rounded-3xl bg-primary-500 
       md:hover:bg-primary-600 transition-colors ${className}`}>
      {children}
      {isExternal ? anchor : <Link href={href}>{anchor}</Link>}
    </div>
  )
}
