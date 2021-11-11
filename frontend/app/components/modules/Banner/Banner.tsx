import styles from './Banner.module.scss'

type Props = {
  analyticsName: string
  shortDescription: string
  longDescription: string
  bannerUrl: string
}

export const Banner = ({
  analyticsName,
  shortDescription,
  longDescription,
  bannerUrl
}: Props) => {
  return (
    <div
      className={styles.intro}
      style={{
        backgroundImage: `url("${bannerUrl}")`
      }}>
      <div className={styles.texts}>
        <h1>{analyticsName}</h1>
        <p>{shortDescription}</p>
        <p>{longDescription}</p>
      </div>
    </div>
  )
}
