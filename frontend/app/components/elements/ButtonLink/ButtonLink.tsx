import Link from 'next/link'
import { ReactNode, AnchorHTMLAttributes } from 'react'
import { Color } from '../../../types/elements'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href: string
  color?: Color
  disabled?: boolean
  rect?: boolean
}

export const ButtonLink = ({
  children,
  color,
  rect,
  className,
  href,
  ...props
}: Props) => {
  return (
    <Link href={href}>
      <a
        className={`py-3 px-5 bg-slate-50 font-bold cursor-pointer rounded-full inline-block
      font-sans  disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow
       ${
         color === Color.Primary &&
         'bg-primary-500 text-white hover:bg-primary-600'
       } 
      ${
        color === Color.Secondary &&
        'bg-secondary-500 text-primary-500 hover:bg-secondary-600'
      } 
      ${rect && 'rounded-md'} ${className}`}
        {...props}>
        {children}
      </a>
    </Link>
  )
}
