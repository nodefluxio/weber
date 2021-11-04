import styles from "./FacePaymentPage.module.scss"
import { FaceRegistration } from "../../modules/FaceRegistration/FaceRegistration"
import { useState } from "react"
import { postActivities } from "../../../api/activitiesAPI"
import { Modal } from "../../elements/Modal/Modal"
import { RequestDemoFormPopup } from "../../modules/RequestDemoFormPopup/RequestDemoFormModal"
import { SESSION_ID_ERROR } from "../../../constants/message"
import { Banner } from "../../modules/Banner/Banner"
import { parseCookies } from "nookies"

type Props ={
  serviceId: number,
  name: string,
  shortDesc: string,
  longDesc: string
}

export const FacePaymentPage = ({ serviceId, name, shortDesc, longDesc }: Props) => {

  const [currentStep, setCurrentStep] = useState(2)
  const [openModal, setOpenModal] = useState(false)

  const { session_id } = parseCookies()

  const nextStep = (step: number) => {
    if (session_id) {
      setCurrentStep(step)
    } else {
      // Cookie did not exist
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
        shortDescription={shortDesc}
        longDescription={longDesc}
      />

      <div className={styles.container}>
        {
          currentStep === 2 &&
          <FaceRegistration
            onArrival={() => createVisitorActivities(serviceId, session_id, 1)}
            onChecking={() => createVisitorActivities(serviceId, session_id, 2)}/>
        }
      </div>
    </>
  )
}