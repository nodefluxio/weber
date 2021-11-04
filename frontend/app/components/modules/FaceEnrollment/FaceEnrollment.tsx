import { useState } from "react"
import Image from "next/image"
import { Color } from "../../../types/elements"
import { Cam } from "../Cam/Cam"
import { Button } from "../../elements/Button/Button"
import styles from "./FaceEnrollment.module.scss"
import { parseCookies } from "nookies"

const ENROLL_SNAPSHOT = "enroll_snapshot"

export const FaceEnrollment = () => {

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

  const enrollPhoto = () => {
    if (session_id) {
      // TODO : Handle API call
      const photo = localStorage.getItem(ENROLL_SNAPSHOT)
      console.log(photo)
      setIsPhotoTaken(true)
    } else {
      // TODO : if enrollment failed
      localStorage.removeItem(ENROLL_SNAPSHOT)
    }
  }

  const handleClick = () => {
    if (isSuccess) {
      console.log("Success")
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
            <Cam localkey={ENROLL_SNAPSHOT} nextStep={() => enrollPhoto()} />
          </>
      }
    </div>
  )
}