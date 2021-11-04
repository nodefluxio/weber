import styles from "./FacePaymentPage.module.scss"
import { FaceRegistration } from "../../modules/FaceRegistration/FaceRegistration"
import { useState } from "react"
import { postActivities } from "../../../api/activitiesAPI"
import { Modal } from "../../elements/Modal/Modal"
import { RequestDemoFormPopup } from "../../modules/RequestDemoFormPopup/RequestDemoFormModal"
import { SESSION_ID_ERROR } from "../../../constants/message"
import { Banner } from "../../modules/Banner/Banner"
import { Button } from "../../elements/Button/Button"
import { Color } from "../../../types/elements"
import { parseCookies } from "nookies"

type Props = {
  id: number,
  name: string,
  short_description: string,
  long_description: string
}

export const FacePaymentPage = ({ id, name, short_description, long_description }: Props) => {

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const { session_id } = parseCookies()

  const nextStep = (step: number) => {
    if (session_id) {
      setCurrentStep(step)
    } else { // Cookie did not exist... open modal
      setOpenModal(true)
    }
  }

  const createVisitorActivities = async (
    serviceId: number,
    sessionId: string,
    completeness: number
  ) => {
    try {
      await postActivities(serviceId, sessionId, completeness)
    } catch (err) {
      if ((err as Error).message === SESSION_ID_ERROR) {
        setOpenModal(true)
      } else {
        console.log((err as Error).message)
      }
    }
  }

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>

      <Banner
        analyticsName={name}
        shortDescription={short_description}
        longDescription={long_description}
      />

      <div className={styles.container}>
        {
          currentStep === 1 &&
          <div className={styles.welcome}>
            <h2>Welcome to {name} Demo</h2>
            <p>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => nextStep(2)}>
              Start
            </Button>
          </div>
        }

        {
          currentStep === 2 &&
          <FaceRegistration
            onChecking={() => console.log("act")}
            openModal={() => setOpenModal(true)}
            />
        }
      </div>
    </>
  )
}