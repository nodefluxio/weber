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
  const router = useRouter()
  useEffect(() => {
    const closeDrawer = (event: any) => {
      if (drawerRef.current && drawerRef.current.contains(event.target)) {
        return
      }
      setOpenDrawer(false)
    }
    document.addEventListener('mousedown', closeDrawer)
    return () => document.removeEventListener('mousedown', closeDrawer)
  }, [])

  return (
    <nav
      className={`${styles.navbar} ${
        router.pathname === '/' ? styles.fixedNav : ''
      }`}>
      <div className={styles.container}>
        <Link href="/">
          <div className={styles.imageContainer}>
            <Image
              src={'/assets/images/nodeflux-logo.png'}
              layout="fill"
              objectFit="contain"
              quality={100}
              priority
            />
          </div>
        </Link>
        <button
          className={styles.hamburgerButton}
          onClick={() => setOpenDrawer(true)}>
          <div className={styles.lines}></div>
        </button>
        <ul ref={drawerRef} className={`${openDrawer && styles.openDrawer}`}>
          <li>
            <Link href="/#solutions">
              <span>SOLUTIONS</span>
            </Link>
          </li>
          <li>
            <Link href="/#analytics">
              <span>ANALYTICS</span>
            </Link>
          </li>
          <li>
            <Link href="/#new-innovations">
              <span>NEW INNOVATIONS</span>
            </Link>
          </li>
          <li className={styles.contactUs}>
            <Button className={styles.btn} color={Color.Secondary}>
              Contact Us
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
