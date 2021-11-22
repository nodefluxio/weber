import styles from './Cam.module.scss'
import Webcam from 'react-webcam'
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Image from 'next/image'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'

type Props = {
  localkey: string
  nextStep: MouseEventHandler<HTMLButtonElement>
  overlayShape: 'rect' | 'circle'
  videoConstraints?: Object
  mirrored?: boolean
}

export const Cam = ({
  localkey,
  nextStep,
  videoConstraints,
  overlayShape,
  mirrored = true
}: Props) => {
  const webcamRef = useRef<Webcam>(null)

  const [disabled, setDisabled] = useState(true)
  const [flash, setFlash] = useState(false)
  const [photo, setPhoto] = useState('')

  useEffect(() => {
    const storedPhoto = localStorage.getItem(localkey)
    if (storedPhoto) {
      setPhoto(storedPhoto)
      setDisabled(false)
    }
  }, [localkey])

  const capture = useCallback(() => {
    if (webcamRef.current !== null) {
      const snapshot = webcamRef.current.getScreenshot()

      if (snapshot) {
        localStorage.setItem(localkey, snapshot)

        setPhoto(snapshot)
        setDisabled(false)
        setFlash(true)
        setTimeout(() => setFlash(false), 1000)
      }
    }
  }, [webcamRef])

  const tryAgain = () => {
    setPhoto('')
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${flash ? styles.flash : ''}`}>
        {!photo ? (
          <div className={styles.webcamContainer}>
            <Webcam
              className={styles.webcam}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              videoConstraints={videoConstraints}
              imageSmoothing={false}
              minScreenshotWidth={401}
              minScreenshotHeight={301}
              mirrored={mirrored}
            />
            <Image
              className={styles.overlayImg}
              src={`/assets/images/face-cam-overlay-${overlayShape}.png`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ) : (
          photo && (
            <div className={styles.capturedPhotoContainer}>
              <Image
                className={styles.capturedPhoto}
                src={photo}
                layout="fill"
                objectFit="contain"
                alt="captured photos"
              />
            </div>
          )
        )}
      </div>

      <div className={styles.btnGroup}>
        {!photo ? (
          <Button
            onClick={capture}
            color={Color.Primary}
            className={styles.btn}>
            Take a photo
          </Button>
        ) : (
          <Button
            onClick={tryAgain}
            color={Color.Primary}
            className={styles.btn}>
            Try Again
          </Button>
        )}

        <Button
          color={Color.Primary}
          className={styles.btn}
          onClick={nextStep}
          disabled={disabled}>
          Next
        </Button>
      </div>
    </div>
  )
}
