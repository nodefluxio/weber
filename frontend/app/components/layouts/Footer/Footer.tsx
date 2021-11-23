import styles from './Footer.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.col1}>
            <div className={styles.imgContainer}>
              <Image
                src="/assets/images/nodeflux-logo-white.png"
                alt="nodeflux logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p>Jl. Kemang Timur No. 24 Jakarta Selatan, 12730 Indonesia</p>
            <p>(021) 22718184</p>
          </div>
          <div className={styles.col2}>
            <div className={styles.awardsAndRecognitions}>
              <div className={styles.recognitions}>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/nvidia-logo.png"
                    layout="fill"
                    objectFit="contain"
                    alt="nvidia logo"
                  />
                </div>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/satu-indonesia-logo.png"
                    layout="fill"
                    objectFit="contain"
                    alt="satu indonesia logo"
                  />
                </div>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/bia-logo.png"
                    layout="fill"
                    objectFit="contain"
                    alt="BIA logo"
                  />
                </div>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/identik-logo.png"
                    layout="fill"
                    objectFit="contain"
                    alt="identik logo"
                  />
                </div>
              </div>
              <div className={styles.awards}>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/nist-logo.png"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p>Ranked Top 30th Percentile in the Leaderboard</p>
                </div>
              </div>
            </div>
            <div className={styles.links}>
              <div className={styles.col}>
                <h4>Products</h4>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/visionaire-white.png"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className={styles.imgContainer}>
                  <Image
                    src="/assets/images/identifai-white.png"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className={styles.col}>
                <h4>Company</h4>
                <p>About Us</p>
                <p>FAQ</p>
                <p>Press</p>
              </div>
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
