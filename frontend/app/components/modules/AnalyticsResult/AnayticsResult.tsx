import image from "next/image"
import Image from "next/image"
import { parseCookies } from "nookies"
import { useEffect, useState } from "react"
import { postServicePhoto } from "../../../api/analyticsAPI"
import styles from "./AnalyticsResult.module.scss"

type Props = {
  imageBase64: string,
  serviceID: number
}

export const AnalyticsResult = ({ imageBase64, serviceID }: Props) => {

  const [preview, setPreview] = useState("")
  const [result, setResult] = useState<object>()
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    setPreview(imageBase64)
    const { session_id } = parseCookies()
    postServicePhoto(serviceID, session_id, imageBase64)
      .then(res => setResult(res!))
      .catch(err => setErrorMsg((err as Error).message))
  }, [])

  return (
    <div className={styles.result}>
      <div className={styles.resultFlex}>
        <div className={styles.resultImage}>
          {
            preview &&
            <Image
              src={preview}
              layout="fill"
              objectFit="contain"
            />
          }
        </div>
        <div className={styles.resultInfo}>
          {
            result ?
              <div>
                <p>Results Here</p>
                <ul>
                  {
                    Object.entries(result).map(([key, value]) => (
                      <li key={key}><b>{key}</b>: {value}</li>
                    ))
                  }
                </ul>
              </div>
              :
              errorMsg ?
                <div>{errorMsg}</div>
                :
                <div>Loading your results... Please wait</div>
          }
        </div>
      </div>
    </div>
  )   
}