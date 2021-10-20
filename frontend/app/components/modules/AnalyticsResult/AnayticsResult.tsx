import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "./AnalyticsResult.module.scss"

type Props = {
  imageBase64: string,
  result: object
}

export const AnalyticsResult = ({ imageBase64, result }: Props) => {

  const [preview, setPreview] = useState("")

  useEffect(() => {
    setPreview(imageBase64)
  }, [])

  return (
    <div className={styles.result}>
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
          <div className={styles.resultInfo}>
            <p>Results Here</p>
            <ul>
            {
              Object.entries(result).map(([key, value]) => (
                <li><b>{key}</b>: {value}</li>
              ))
            }
            </ul>
          </div>
        </div>     
      }
    </div>
  )
}