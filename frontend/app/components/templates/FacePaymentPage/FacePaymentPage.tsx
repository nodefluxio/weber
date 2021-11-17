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
import { PaymentPay } from '@/modules/PaymentPay/PaymentPay'
import { PaymentMenu } from '@/modules/PaymentMenu/PaymentMenu'
import { checkAccount } from '@/api/paymentAPI'

type Props = {
  id: number
  name: string
  short_description: string
  long_description: string
}

const mainMenuInfo = [
  'Before we start our payment, create your account first',
  'Do your transactions using face payment'
]

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
  const [total, setTotal] = useState(0)
  const [isAccountMade, setIsAccountMade] = useState(false)
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

  const checkStatus = async () => {
    if (session_id) {
      try {
        const res = await checkAccount(session_id)
        if (res) {
          // Current userflow, not activated is considered same as not registered
          console.log(res)
          setIsAccountMade(res?.have_active_account)
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      setOpenModal(true)
    }
  }

  const menuButtons = [
    {
      title: 'Account Registration',
      onClick: () => {
        setCurrentStep(3)
        setCurrentStepStepper(2)
      }
    },
    {
      title: 'Face Payment',
      onClick: () => {
        setCurrentStep(5)
        setCurrentStepStepper(4)
      }
    }
  ]

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
            <Button
              color={Color.Primary}
              onClick={() => {
                moveStep(1, false)
                checkStatus()
              }}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <PaymentMenu
            buttons={menuButtons}
            disabledList={[+!isAccountMade]}
            title={mainMenuInfo[+isAccountMade]}
          />
        )}

        {currentStep === 3 && (
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

        {currentStep === 4 && (
          <ActivationForm
            nextStep={() => {
              createVisitorActivities(id, session_id, 3)
              checkStatus()
              setCurrentStep(2)
            }}
          />
        )}

        {currentStep === 5 && (
          <Catalog
            onAddToCart={(item) => {
              setCart(item)
              createVisitorActivities(id, session_id, 4)
              moveStep(1)
            }}
          />
        )}

        {currentStep === 6 && cart && (
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

        {currentStep === 7 && cart && (
          <OrderSummary
            cart={cart}
            onNext={(total) => {
              createVisitorActivities(id, session_id, 6)
              setTotal(total)
              moveStep(1)
            }}
            onBack={() => moveStep(-1)}
          />
        )}

        {currentStep === 8 && (
          <PaymentPay sessionId={session_id} amount={total} />
        )}

        {currentStep === 9 && (
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
