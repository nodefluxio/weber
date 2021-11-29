import { useEffect, useRef, useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.scss'

export const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const drawerRef = useRef<HTMLUListElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()

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
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}
    ${router.pathname !== '/' ? styles.plainNavbar : ''}`}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
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

        <button
          className={styles.hamburgerButton}
          onClick={() => setOpenDrawer(true)}>
          <div className={styles.lines}></div>
        </button>
        <ul ref={drawerRef} className={`${openDrawer && styles.openDrawer}`}>
          <li>
            <Link href="/#solutions">
              <a>SOLUTIONS</a>
            </Link>
          </li>
          <li>
            <Link href="/#analytics">
              <a>ANALYTICS</a>
            </Link>
          </li>
          <li>
            <Link href="/#new-innovations">
              <a>NEW INNOVATIONS</a>
            </Link>
          </li>
          <li className={styles.contactUs}>
            <Link href="https://bit.ly/nodeflux-engagement-form">
              <a target="_blank">
                <Button className={styles.btn} color={Color.Secondary}>
                  Contact Us
                </Button>
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
