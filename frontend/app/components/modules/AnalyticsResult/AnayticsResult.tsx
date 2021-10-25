import Image from "next/image"
import styles from "./AnalyticsResult.module.scss"

type Props = {
  imageBase64: string,
  result: object,
  errorMsg: string
}

export const AnalyticsResult = ({ imageBase64, result, errorMsg }: Props) => {

  return (
    <>
      <div className={styles.result}>
        <div className={styles.resultFlex}>
          <div className={styles.resultImage}>
            {
              imageBase64 &&
              <Image
                src={imageBase64}
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
    </>
  )
}