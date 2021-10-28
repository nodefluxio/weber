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
    <div className={styles.fme}>
      <ul>
        <li>match : {match ? 'true' : 'false'}</li>
        <li>similarity : {similarity}</li>
      </ul>
    </div>
  )
}

export const OCRResult = ({ result }: Props<OCRResultResponse>) => {
  return (
    <div className={styles.ocr}>
      {Object.entries(result).map(([key, value]) => (
        <li key={key}>
          <b>{key}</b>: {value}
        </li>
      ))}
    </div>
  )
}

export const LPRResult = ({ result }: Props<LPRResultResponse>) => {
  const { license_plate_recognitions } = result
  const { bounding_box, confidence, detected, license_plate_number } =
    license_plate_recognitions[0]

  return (
    <div className={styles.lpr}>
      <ul>
        <p>Bounding Box</p>
        <li>width : {bounding_box.width}</li>
        <li>height : {bounding_box.height}</li>
        <li>top : {bounding_box.top}</li>
        <li>left : {bounding_box.left}</li>
      </ul>
      <li>confidence: {confidence}</li>
      <li>detected: {detected}</li>
      <li>license_plate_number: {license_plate_number}</li>
    </div>
  )
}
