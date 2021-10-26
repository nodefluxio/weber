import styles from './Footer.module.scss'
import Image from 'next/image'
import Link from 'next/link'
export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.col1}>
            <Image
              width={184}
              height={56}
              src="/assets/images/nodeflux-logo-white.png"
              alt="nodeflux logo"
            />
            <p>Jl. Kemang Timur No. 24 Jakarta Selatan, 12730 Indonesia</p>
            <p>(021) 22718184</p>
          </div>
          <div className={styles.links}>
            <div className={styles.col2}>
              <h4>Developer</h4>
              <p>Documentation</p>
              <p>FAQ</p>
              <p>Support Center</p>
            </div>
            <div className={styles.col3}>
              <h4>Developer</h4>
              <p>Documentation</p>
              <p>FAQ</p>
              <p>Support Center</p>
            </div>
          </div>
        </div>
        <div className={styles.sosmed}>
          <div className={styles.icon}>
            <Link href="/">
              <a>
                <Image
                  src="/assets/icons/wa.png"
                  alt="whatsap"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
          <div className={styles.icon}>
            <Link href="/">
              <a>
                <Image
                  src="/assets/icons/ig.png"
                  alt="whatsap"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
          <div className={styles.icon}>
            <Link href="/">
              <a>
                <Image
                  src="/assets/icons/linkedin.png"
                  alt="whatsap"
                  width={27}
                  height={27}
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
