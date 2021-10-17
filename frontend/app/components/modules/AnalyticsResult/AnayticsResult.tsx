import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "./AnalyticsResult.module.scss"

type Props = {
  imageBase64: string
}

export const AnalyticsResult = ({ imageBase64 }: Props) => {

  const [preview, setPreview] = useState("")

  useEffect(() => {
    setPreview(imageBase64)
  }, [])

  return (
    <div className={styles.result}>
      <h3>See your Result</h3>
      {
        preview &&
        <div className={styles.resultFlex}>
          <div className={styles.resultImage}>
            <Image
              src={preview}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p>Results Here</p>
        </div>     
      }
    </div>
  )
}