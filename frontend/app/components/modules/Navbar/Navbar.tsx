import { useEffect, useRef, useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { NavItem } from './NavItem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { HamburgerMenu } from './HamburgerMenu'

export const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const drawerRef = useRef<HTMLUListElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const isLg = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    const closeDrawer = (event: any) => {
      if (drawerRef.current && drawerRef.current.contains(event.target)) {
        return
      }
      setOpenDrawer(false)
    }
    document.addEventListener('scroll', () => {
      const scroll = window.scrollY > 5
      if (scroll) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    })
    document.addEventListener('mousedown', closeDrawer)
    return () => document.removeEventListener('mousedown', closeDrawer)
  }, [])

  return (
    <nav
      className={`flex-1 h-16 lg:h-20 w-full uppercase z-40 fixed font-serif 
      bg-gradient-to-r from-customPurple-100 to-customPurple-900 ${
        scrolled && 'drop-shadow-lg'
      }
    ${router.pathname !== '/' ? 'from-primary-500 to-primary-500' : ''}`}>
      <div className="container flex items-center justify-between w-11/12 h-full m-auto lg:w-full">
        <div className="relative w-40 h-full cursor-pointer sm:w-52">
          <Link href="/">
            <a>
              <Image
                src={'/assets/images/nodeflux-logo.png'}
                layout="fill"
                objectFit="contain"
                quality={100}
                priority
                alt="nodeflux-logo"
              />
            </a>
          </Link>
        </div>
        {/* Hamburger Menu */}
        <HamburgerMenu onClick={() => setOpenDrawer(true)} />
        <ul
          ref={drawerRef}
          className={`z-50 fixed lg:relative right-0 
           top-0 lg:top-auto h-screen lg:h-full 
          flex flex-col lg:flex-row py-[20vh] lg:py-1 px-8 lg:px-1
          transition-transform translate-x-full lg:translate-x-0 text-primary-500 lg:text-white 
          font-bold lg:font-semibold bg-secondary-500 lg:bg-transparent  ${
            openDrawer && 'translate-x-0'
          }`}>
          <NavItem href="/#solutions">SOLUTIONS</NavItem>
          <NavItem href="/#analytics">ANALYTICS</NavItem>
          <NavItem href="/#new-innovations">NEW INNOVATIONS</NavItem>
          <NavItem
            href="https://share.hsforms.com/1OKHV2jCyQ2SA3VCMoacgeQ3lep5"
            target="_blank">
            <Button color={isLg ? Color.Secondary : Color.Primary}>
              Redeem Free Quota
            </Button>
          </NavItem>
        </ul>
      </div>
    </nav>
  )
}
