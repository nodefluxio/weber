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
    <nav className={styles.navbar}>
      <Link href="/">
        <div className={styles.imageContainer}>
          <Image
            src={'/assets/images/nodeflux-logo.png'}
            width={130}
            height={40}
            quality={100}
          />
        </div>
      </Link>
      <button
        className={styles.hamburgerButton}
        onClick={() => setOpenDrawer(true)}>
        <div className={styles.lines}></div>
      </button>
      <ul ref={drawerRef} className={`${openDrawer && styles.openDrawer}`}>
        {router.pathname !== '/' ? (
          <>
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
          </>
        ) : (
          <>
            <li>
              <a href="#solutions">SOLUTIONS</a>
            </li>
            <li>
              <a href="#analytics">ANALYTICS</a>
            </li>
            <li>
              <a href="#new-innovations">NEW INNOVATIONS</a>
            </li>
          </>
        )}
        <li className={styles.contactUs}>
          <Link href="/contact" passHref>
            <Button className={styles.btn} color={Color.Secondary}>
              Contact Us
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
