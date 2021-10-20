import styles from "./Banner.module.scss"
import Image from "next/image"

type Props = {
  analyticsName: string,
  shortDescription: string,
  longDescription: string
}

export const Banner = ({ analyticsName, shortDescription, longDescription }: Props) => {
  return (
    <div className={styles.intro}>
      <div className={styles.title}>
        <h1>{analyticsName}</h1>
        <p>{shortDescription}</p>
        <p>{longDescription}</p>
      </div>
      <div className={styles.imageIntro}>
        <Image
          src={'/assets/images/placeholder.jpg'}
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  )
}