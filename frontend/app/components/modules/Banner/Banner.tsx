import styles from './Banner.module.scss'

type Props = {
  analyticsName: string
  shortDescription: string
  longDescription: string
  slug: string
}

export const Banner = ({
  analyticsName,
  shortDescription,
  longDescription,
  slug
}: Props) => {
  return (
    <div
      className={styles.intro}
      style={{
        backgroundImage: `url("/assets/images/banner/${slug}.jpg")`
      }}>
      <div className={styles.texts}>
        <h1>{analyticsName}</h1>
        <p>{shortDescription}</p>
        <p>{longDescription}</p>
      </div>
    </div>
  )
}
