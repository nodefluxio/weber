import styles from './Cam.module.scss'
import Webcam from 'react-webcam'
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button } from '../../elements/Button/Button'
import { Color } from '../../../types/elements'

type Props = {
  localkey: string
  nextStep: MouseEventHandler<HTMLButtonElement>
}

export const Cam = ({ localkey, nextStep }: Props) => {
  const webcamRef = useRef<Webcam>(null)

  const [disabled, setDisabled] = useState(true)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(localkey)) {
      setDisabled(false)
    }
  }, [])

  const capture = useCallback(() => {
    if (webcamRef.current !== null) {
      const snapshot = webcamRef.current.getScreenshot()

      if (snapshot) {
        localStorage.setItem(localkey, snapshot)

        setDisabled(false)
        setFlash(true)
        setTimeout(() => setFlash(false), 1000)
      }
    }
  }, [webcamRef])

  return (
    <div className={styles.container}>
      <div className={`${styles.cam} ${flash ? styles.flash : ''}`}>
        <Webcam
          audio={false}
          height={360}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
        />
      </div>

      <div className={styles.btnGroup}>
        <Button onClick={capture} color={Color.Primary} className={styles.btn}>
          Take a photo
        </Button>

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
