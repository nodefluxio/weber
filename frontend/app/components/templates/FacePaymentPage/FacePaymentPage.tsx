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

  const nextStep = (stepper?: boolean) => {
    if (session_id) {
      setCurrentStep(currentStep + 1)
      if (stepper) {
        setCurrentStepStepper(currentStepStepper + 1)
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
            <Button color={Color.Primary} onClick={() => nextStep(true)}>
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
              nextStep(true)
            }}
            openModal={() => setOpenModal(true)}
          />
        )}

        {currentStep === 3 && (
          <Catalog
            onAddToCart={(item) => {
              setCart(item)
              createVisitorActivities(id, session_id, 3)
              nextStep()
            }}
          />
        )}
        {currentStep === 4 && cart && (
          <Cart
            onBack={() => {}}
            onCheckout={(item) => {
              setCart(item)
              createVisitorActivities(id, session_id, 4)
              nextStep()
            }}
            item={cart}
          />
        )}
        {currentStep === 5 && cart && (
          <OrderSummary
            cart={cart}
            onNext={(total) => {
              createVisitorActivities(id, session_id, 5)
              nextStep()
            }}
            onBack={() => {}}
          />
        )}
      </div>
    </>
  )
}
