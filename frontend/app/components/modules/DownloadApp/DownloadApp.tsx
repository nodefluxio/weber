import Link from 'next/link'
import Image from 'next/image'
import styles from './DownloadApp.module.scss'

interface DownloadProps {
  appStoreUrl: string
  googlePlayUrl: string
  onBadgeClick: () => void
}

export const DownloadApp: React.FC<DownloadProps> = ({
  appStoreUrl,
  googlePlayUrl,
  onBadgeClick
}) => {
  return (
    <div className={styles.downloadAppWrapper}>
      <span className={styles.downloadBanner}>
        Download Citizen App for free
      </span>
      <span className={styles.storeMessage}>For IOS and Android</span>
      <div className={styles.badgeWrappers}>
        <Link href={appStoreUrl}>
          <a target="_blank" onClick={() => onBadgeClick()}>
            <Image
              src="/assets/images/apple-app-store.svg"
              width={180}
              height={52}
            />
          </a>
        </Link>
        <div className={styles.endItem}>
          <Link href={googlePlayUrl}>
            <a target="_blank" onClick={() => onBadgeClick()}>
              <Image
                src="/assets/images/google-play-badge.svg"
                width={180}
                height={52}
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
