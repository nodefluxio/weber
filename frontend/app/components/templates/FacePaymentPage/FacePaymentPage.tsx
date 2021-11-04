import { parseCookies } from "nookies"
import { useState } from "react"
import { Banner } from "../../modules/Banner/Banner"
import { RequestDemoFormPopup } from "../../modules/RequestDemoFormPopup/RequestDemoFormModal"
import { Modal } from "../../elements/Modal/Modal"
import { Button } from "../../elements/Button/Button"
import { Color } from "../../../types/elements"
import styles from "./FacePaymentPage.module.scss"

type Props = {
  id: number, // service ID
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
          <div>
            <h3>Welcome to {name} Demo</h3>
            <p>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => nextStep(2)}>
              Start
            </Button>
          </div>
        }
      </div>
      {/* Add your components... */}

    </>
  )
}
