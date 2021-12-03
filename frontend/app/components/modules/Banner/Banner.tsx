import styles from './Banner.module.scss'

type Props = {
  analyticsName: string
  longDescription: string
  bannerUrl?: string
}

export const Banner = ({
  analyticsName,
  longDescription,
  bannerUrl
}: Props) => {
  return (
    <div
      className={styles.banner}
      style={{
        backgroundImage: `url("${bannerUrl}")`
      }}>
      <div className={styles.container}>
        <div className={styles.texts}>
          <h1>{analyticsName}</h1>
          <p className={styles.descriptions}>{longDescription}</p>
        </div>
      </div>
    </div>
  )
}
