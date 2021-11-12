import { FaceRegistration } from '../../modules/FaceRegistration/FaceRegistration'
import { useState } from 'react'
import { postActivities } from '../../../api/activitiesAPI'
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import { SESSION_ID_ERROR } from '../../../constants/message'
import { Banner } from '../../modules/Banner/Banner'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { Catalog } from '@/modules/Catalog/Catalog'
import { Cart } from '@/modules/Cart/Cart'
import { OrderSummary } from '@/modules/OrderSummary/OrderSummary'
import { Color, ShoppingItem } from '../../../types/elements'
import { parseCookies } from 'nookies'
import styles from './FacePaymentPage.module.scss'
import Feedback from '@/modules/Feedback/Feedback'
import { ActivationForm } from '@/modules/ActivationForm/ActivationForm'

type Props = {
  id: number
  name: string
  short_description: string
  long_description: string
}

export const FacePaymentPage = ({
  id,
  name,
  short_description,
  long_description
}: Props) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentStepStepper, setCurrentStepStepper] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [cart, setCart] = useState<ShoppingItem>()
  const { session_id } = parseCookies()

  const moveStep = (numStep: number, moveStepStepper?: boolean) => {
    if (session_id) {
      setCurrentStep(currentStep + numStep)
      if (moveStepStepper) {
        setCurrentStepStepper(currentStepStepper + numStep)
      }
    } else {
      // Cookie does not exist... opening modal
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
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>

      <Banner
        bannerUrl="/assets/images/solutions/face-payment/banner.jpg"
        analyticsName={name}
        shortDescription={short_description}
        longDescription={long_description}
      />

      <Stepper
        steps={[
          'Start',
          'Registration',
          'Activate Account',
          'Face Payment',
          'Finish'
        ]}
        activeStep={currentStepStepper}
      />

      <div className={styles.container}>
        {currentStep === 1 && (
          <div className={styles.welcome}>
            <h2>Welcome to {name} Demo</h2>
            <p style={{ width: '65%', margin: '2rem auto' }}>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => moveStep(1, true)}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <FaceRegistration
            onChecking={() => {
              createVisitorActivities(id, session_id, 1)
            }}
            onFinished={() => {
              createVisitorActivities(id, session_id, 2)
              moveStep(1, true)
            }}
            openModal={() => setOpenModal(true)}
          />
        )}

        {currentStep === 3 && (
          <ActivationForm
            nextStep={() => {
              createVisitorActivities(id, session_id, 3)
              moveStep(1, true)
            }}
          />
        )}

        {currentStep === 4 && (
          <Catalog
            onAddToCart={(item) => {
              setCart(item)
              createVisitorActivities(id, session_id, 4)
              moveStep(1)
            }}
          />
        )}

        {currentStep === 5 && cart && (
          <Cart
            onBack={() => moveStep(-1)}
            onCheckout={(item) => {
              setCart(item)
              createVisitorActivities(id, session_id, 5)
              moveStep(1)
            }}
            item={cart}
          />
        )}
        {currentStep === 6 && cart && (
          <OrderSummary
            cart={cart}
            onNext={(total) => {
              createVisitorActivities(id, session_id, 6)
              moveStep(1)
            }}
            onBack={() => moveStep(-1)}
          />
        )}
        {currentStep === 7 && (
          <Feedback
            id={id}
            onTryAgain={() => {
              setCurrentStep(1)
              setCurrentStepStepper(1)
              setCart(undefined)
            }}
          />
        )}
      </div>
    </>
  )
}
