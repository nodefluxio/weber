import { parseCookies } from 'nookies'
import { useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Modal } from '../../elements/Modal/Modal'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { FaceLiveness } from '../../modules/FaceLiveness/FaceLiveness'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import styles from './EkycPage.module.scss'

type Props = {
  name: string
  shortDesc: string
  longDesc: string
}

export const EkycPage = ({ name, shortDesc, longDesc }: Props) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const nextStep = async (page: number) => {
    const { session_id } = parseCookies()
    if (session_id) {
      setCurrentStep(page)
    } else {
      setOpenModal(true)
    }
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>
      <Banner
        analyticsName={name}
        shortDescription={shortDesc}
        longDescription={longDesc}
      />
      <Stepper
        steps={['Start', 'Face Liveness', 'OCR KTP', 'Face Match', 'Finish']}
        activeStep={currentStep}
      />

      <div className={styles.container}>
        {currentStep === 1 && (
          <div>
            <h3>Welcome to e-KYC Demo</h3>
            <p>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => nextStep(2)}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <FaceLiveness
            nextStep={() => nextStep(2)}
            setOpenModal={setOpenModal}
          />
        )}

        {currentStep === 3 && <h3>See you next week 👋</h3>}
      </div>
    </>
  )
}
