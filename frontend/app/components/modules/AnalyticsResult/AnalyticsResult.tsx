import {
  FMEResultResponse,
  LPRResultResponse,
  OCRResultResponse
} from '../../../types/responses'
import styles from './AnalyticsResult.module.scss'

type Props<T> = {
  result: T
}

export const FMEResult = ({ result }: Props<FMEResultResponse>) => {
  const { face_match } = result
  const { match, similarity } = face_match
  return (
    <div className={styles.container}>
      <div>
        <p>match</p>
        <p>{match ? 'true' : 'false'}</p>
      </div>
      <div>
        <p>similarity</p>
        <p>{similarity}</p>
      </div>
    </div>
  )
}

export const OCRResult = ({ result }: Props<OCRResultResponse>) => {
  return (
    <div className={styles.container}>
      {Object.entries(result).map(([key, value]) => (
        <div key={key}>
          <p>{key}</p>
          <p>{value}</p>
        </div>
      ))}
    </div>
  )
}

export const LPRResult = ({ result }: Props<LPRResultResponse>) => {
  const { license_plate_recognitions } = result
  const { bounding_box, confidence, detected, license_plate_number } =
    license_plate_recognitions[0]

  return (
    <div className={styles.container}>
      <div>
        <p>Bounding Box</p>
        <div>
          <p>width</p>
          <p>{bounding_box.width}</p>
        </div>
        <div>
          <p>height</p>
          <p>{bounding_box.height}</p>
        </div>
        <div>
          <p>top</p>
          <p>{bounding_box.top}</p>
        </div>
        <div>
          <p>left</p>
          <p>{bounding_box.left}</p>
        </div>
      </div>
      <div>
        <p>confidence</p>
        <p>{confidence}</p>
      </div>
      <div>
        <p>detected</p>
        <p>{detected}</p>
      </div>
      <div>
        <p>license_plate_number</p>
        <p>{license_plate_number}</p>
      </div>
    </div>
  )
}
