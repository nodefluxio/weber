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
import { useMediaQuery } from 'app/hooks/useMediaQuery'

type Props = {
  localkey: string
  nextStep: MouseEventHandler<HTMLButtonElement>
  overlayShape: 'rect' | 'circle'
  videoConstraints?: MediaTrackConstraints
  mirrored?: boolean
  facingMode?: 'user' | 'environment'
}

export const Cam = ({
  localkey,
  nextStep,
  videoConstraints,
  overlayShape,
  mirrored = true,
  facingMode = 'user'
}: Props) => {
  const webcamRef = useRef<Webcam>(null)
  const [disabled, setDisabled] = useState(true)
  const [photo, setPhoto] = useState('')

  const isSm = useMediaQuery('(max-width: 640px)')

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
      }
    }
  }, [webcamRef])

  const tryAgain = () => {
    setPhoto('')
  }

  return (
    <div className="w-full">
      <div className="relative">
        {!photo ? (
          <div
            className="border mb-4 border-primary-500 rounded relative
             w-[401px] h-[401px] max-w-[90vw] md:w-[450px] md:h-[337.5px]  mx-auto">
            <Webcam
              className="rounded w-full h-full"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={
                videoConstraints
                  || {
                      width: { min: 512 },
                      height: { min: 512 },
                      aspectRatio: isSm ? 1 : 1.333333,
                      facingMode: { ideal: isSm ? facingMode : '' },
                      frameRate: { ideal: 30, max: 30 }
                    }
              }
              minScreenshotWidth={512}
              minScreenshotHeight={512}
              mirrored={mirrored}
            />
            <Image
              className="opacity-50 rounded z-10"
              src={`/assets/images/face-cam-overlay-${overlayShape}.png`}
              layout="fill"
              objectFit="cover"
              alt="overlay shape"
            />
          </div>
        ) : (
          photo && (
            <div
              className="relative mb-4 w-[401px] h-[401px]
              max-w-[90vw] md:w-[450px] md:h-[337.5px] rounded max-h-[65vh] md:max-h-[unset] mx-auto">
              <Image
                className="rounded"
                src={photo}
                layout="fill"
                objectFit="fill"
                alt="captured photos"
              />
            </div>
          )
        )}
      </div>
      <div className="flex flex-col md:flex-row justify-center">
        {!photo ? (
          <Button
            className="mb-2 md:w-4/5 md:mb-0 md:mr-2"
            onClick={capture}
            color={Color.Primary}>
            Take a photo
          </Button>
        ) : (
          <Button
            className="mb-2 md:w-4/5 md:mb-0 md:mr-2"
            onClick={tryAgain}
            color={Color.Primary}>
            Try Again
          </Button>
        )}
        <Button
          className="md:w-4/5"
          color={Color.Secondary}
          onClick={nextStep}
          disabled={disabled}>
          Next
        </Button>
      </div>
    </div>
  )
}
