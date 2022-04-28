import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Color } from '../../../types/elements'
import { Cam } from '../Cam/Cam'
import { Button } from '../../elements/Button/Button'
import { Spinner } from '@/elements/Spinner/Spinner'
import { parseCookies } from 'nookies'
import { registerAccount } from '../../../api/paymentAPI'
import { ENROLL_SNAPSHOT } from 'app/constants/localStorage'
import { CustomError } from 'app/errors/CustomError'

type Props = {
  openModal: () => void
  nextStep: () => void
  payload: {
    session_id: string
    full_name: string
    phone: string
    have_twin: boolean
  }
}

const wrapper = 'flex flex-col items-center text-center justify-center my-6'

export const FaceEnrollment = ({ openModal, payload, nextStep }: Props) => {
  const [isPhotoTaken, setIsPhotoTaken] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { session_id } = parseCookies()
  const messages = [
    {
      title: 'Registration Failed',
      imgPath: '/assets/icons/warning.svg',
      description:
        'Your selfie is not verified. Try to get clear image and accordance with guideline.',
      button: 'Try Again'
    },
    {
      title: 'Successfully Registered!',
      imgPath: '/assets/icons/thankyou.svg',
      description:
        'Congratulations, your account has been successfully created.',
      button: 'Next'
    }
  ]

  useEffect(() => {
    if (localStorage.getItem(ENROLL_SNAPSHOT)) {
      localStorage.removeItem(ENROLL_SNAPSHOT)
    }
  }, [])

  const getPhoto = () => {
    const photo = localStorage.getItem(ENROLL_SNAPSHOT)
    if (session_id && photo) {
      setIsPhotoTaken(true)
      enroll(photo)
    } else if (!session_id) {
      localStorage.removeItem(ENROLL_SNAPSHOT)
      openModal()
    }
  }

  const enroll = async (photo: string) => {
    if (payload) {
      const { session_id } = parseCookies()
      try {
        const res = await registerAccount(
          session_id,
          payload.phone,
          payload.full_name,
          payload.have_twin,
          [photo]
        )
        if (res?.ok) {
          setIsSuccess(true)
        } else {
          throw new Error()
        }
      } catch (e) {
        if (e instanceof CustomError) {
          switch (e.statusCode) {
            case 401:
              openModal()
              break
            default:
              localStorage.removeItem(ENROLL_SNAPSHOT)
              console.error(e)
          }
        } else {
          console.error(e)
        }
        setIsSuccess(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClick = () => {
    if (isSuccess) {
      nextStep()
    } else {
      setIsPhotoTaken(false)
      setIsLoading(true)
    }
  }

  return (
    <div>
      {isPhotoTaken ? (
        isLoading ? (
          <div className={wrapper}>
            <h2 className="text-2xl font-bold">Registering your account...</h2>
            <Spinner className="my-12" />
            <p className="font-serif">Please wait for a few moment...</p>
          </div>
        ) : (
          <div className={wrapper}>
            <h2 className="text-2xl font-bold">{messages[+isSuccess].title}</h2>
            <div className="mx-auto my-6">
              <Image
                src={messages[+isSuccess].imgPath}
                width={80}
                height={80}
                alt={isSuccess ? 'Success Sign' : 'Warning Sign'}
              />
            </div>
            <p className="font-serif mb-6">
              {messages[+isSuccess].description}
            </p>
            <Button type="button" color={Color.Primary} onClick={handleClick}>
              {messages[+isSuccess].button}
            </Button>
          </div>
        )
      ) : (
        <div className={wrapper}>
          <h2 className="text-2xl font-bold">Take a selfie!</h2>
          <p className="font-serif mt-4">
            Ensure your face position is in the oval area <br />
            Hold the camera at eye level. Look straight to the camera and smile!
          </p>
          <div className="mt-6">
            <Cam
              localkey={ENROLL_SNAPSHOT}
              nextStep={() => getPhoto()}
              overlayShape="circle"
            />
          </div>
        </div>
      )}
    </div>
  )
}
