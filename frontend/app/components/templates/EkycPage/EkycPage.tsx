import { parseCookies } from 'nookies'
import { useState } from 'react'
import { postActivities } from '../../../api/activitiesAPI'
import { SESSION_ID_ERROR } from '../../../constants/message'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Modal } from '../../elements/Modal/Modal'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { FaceLiveness } from '../../modules/FaceLiveness/FaceLiveness'
import Feedback from '../../modules/Feedback/Feedback'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import styles from './EkycPage.module.scss'

type Props = {
  serviceId: number
  name: string
  shortDesc: string
  longDesc: string
}

export const EkycPage = ({ serviceId, name, shortDesc, longDesc }: Props) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const { session_id } = parseCookies()

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

  const nextStep = async (page: number) => {
    if (session_id) {
      setCurrentStep(page)
    } else {
      setOpenModal(true)
    }
  }

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false)
        }}>
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
            <h3 className={styles.title}>Welcome to e-KYC Demo</h3>
            <p className={styles.desc}>
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
            solutionId={serviceId}
            nextStep={() => nextStep(3)}
            setOpenModal={setOpenModal}
            onArrival={() => createVisitorActivities(serviceId, session_id, 40)}
            onChecking={() => createVisitorActivities(serviceId, session_id, 50)}
            onResult={() => createVisitorActivities(serviceId, session_id, 60)}
          />
        )}

        {currentStep === 3 && <Feedback id={serviceId} onClick={() => setCurrentStep(1)}/>}
      </div>
    </>
  )
}
