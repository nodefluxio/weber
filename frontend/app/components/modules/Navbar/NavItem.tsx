import Link from 'next/link'
import { HTMLAttributeAnchorTarget, ReactNode } from 'react'

type Props = {
  children: ReactNode
  href: string
  className?: string
  target?: HTMLAttributeAnchorTarget
}

export const NavItem = ({ children, href, className, target }: Props) => {
  return (
    <li
      className={`${className} py-6 lg:flex lg:items-center lg:pl-16 lg:cursor-pointer text-sm lg:text-base`}>
      <Link href={href}>
        <a target={target} className="lg:py-4">
          {children}
        </a>
      </Link>
    </li>
  )
}
