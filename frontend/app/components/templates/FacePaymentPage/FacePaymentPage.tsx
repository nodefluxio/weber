import styles from "./FacePaymentPage.module.scss"
import { FaceRegistration } from "../../modules/FaceRegistration/FaceRegistration"
import { useState } from "react"
import { postActivities } from "../../../api/activitiesAPI"
import { Modal } from "../../elements/Modal/Modal"
import { RequestDemoFormPopup } from "../../modules/RequestDemoFormPopup/RequestDemoFormModal"
import { SESSION_ID_ERROR } from "../../../constants/message"
import { Banner } from "../../modules/Banner/Banner"
import { Stepper } from "../../elements/Stepper/Stepper"
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
    } else { // Cookie does not exist... opening modal
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

      <Stepper
        steps={["Start", "Registration", "Activate Account", "Face Payment", "Finish"]}
        activeStep={currentStep}
      />

      <div className={styles.container}>
        {
          currentStep === 1 &&
          <div className={styles.welcome}>
            <h2>Welcome to {name} Demo</h2>
            <p style={{ width: "65%", margin: "2rem auto" }}>
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
            onChecking={() => createVisitorActivities(id, session_id, 1)}
            onFinished={() => { 
              createVisitorActivities(id, session_id, 2)
              nextStep(3)
            }}
            openModal={() => setOpenModal(true)}
          />
        }
      </div>
    </>
  )
}
