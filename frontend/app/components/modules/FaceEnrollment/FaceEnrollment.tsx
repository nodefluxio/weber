import { useState } from "react"
import Image from "next/image"
import { Color } from "../../../types/elements"
import { Cam } from "../Cam/Cam"
import { Button } from "../../elements/Button/Button"
import styles from "./FaceEnrollment.module.scss"
import { parseCookies } from "nookies"
import { registerAccount } from "../../../api/paymentAPI"
import { SESSION_ID_ERROR } from "../../../constants/message"

const ENROLL_SNAPSHOT = "enroll_snapshot"

type Props = {
  openModal: Function,
  nextStep: Function,
  payload: {
    session_id: string,
    name: string,
    phone_num: string,
    have_twin: boolean
  }
}

export const FaceEnrollment = ({ openModal, payload,nextStep }: Props) => {

  const [isPhotoTaken, setIsPhotoTaken] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { session_id } = parseCookies()
  const messages = [
    {
      title: "Registration Failed",
      imgPath: "/assets/icons/warning.svg",
      description: "Your selfie is not verified. Try to get clear image and accordance with guideline.",
      button: "Try Again"
    },
    {
      title: "Successfully Registered!",
      imgPath: "/assets/icons/thankyou.svg",
      description: "Congratulations, your account has been successfully created.",
      button: "Next"
    }
  ]

  const getPhoto = () => {
    if (session_id) {
      const photo = localStorage.getItem(ENROLL_SNAPSHOT)
      setIsPhotoTaken(true)
      enroll()
    } else {
      localStorage.removeItem(ENROLL_SNAPSHOT)
      openModal() 
    }
  }

  const enroll = async() => {
    if (payload) {
      const { session_id } = parseCookies()
      try {
        const res = await registerAccount(session_id, payload.phone_num, payload.name, payload.have_twin, payload.images)
        if (res.ok) {
          setIsSuccess(true)
        } else {
          if (res.message === SESSION_ID_ERROR) {
            openModal()
          }
        }
      } catch (e) {
        console.log((e as Error).message)
        setIsSuccess(false)
      }
    }
  }

  const handleClick = () => {
    if (isSuccess) {
      nextStep()
    } else {
      setIsPhotoTaken(false)
    }
  }

  return (
    <div className={styles.enrollWrapper}>
      {
        isPhotoTaken ?
          <div className={styles.subtitle}>
            <h2>{ messages[+isSuccess].title }</h2>
            <Image src={ messages[+isSuccess].imgPath } width={80} height={80} />
            <p>{ messages[+isSuccess].description }</p>
            <Button
              type="button"
              color={Color.Primary}
              onClick={handleClick}
            >{ messages[+isSuccess].button }</Button>
          </div>
          :
          <>
            <div className={styles.subtitle}>
              <h2>Say Cheese!</h2>
              <p>Take a selfie to register your payment account</p>
            </div>
            <Cam localkey={ENROLL_SNAPSHOT} nextStep={() => getPhoto()} />
          </>
      }
    </div>
  )
}