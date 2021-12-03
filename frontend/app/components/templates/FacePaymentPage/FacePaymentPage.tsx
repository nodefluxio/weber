import { FaceRegistration } from '../../modules/FaceRegistration/FaceRegistration'
import { useState } from 'react'
import { postActivities } from '../../../api/activitiesAPI'
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import { Banner } from '../../modules/Banner/Banner'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { Catalog } from '@/modules/Catalog/Catalog'
import { Cart } from '@/modules/Cart/Cart'
import { OrderSummary } from '@/modules/OrderSummary/OrderSummary'
import {
  Color,
  PaymentAccountInfo,
  ShoppingItem
} from '../../../types/elements'
import { parseCookies } from 'nookies'
import styles from './FacePaymentPage.module.scss'
import Feedback from '@/modules/Feedback/Feedback'
import { ActivationForm } from '@/modules/ActivationForm/ActivationForm'
import { PaymentPay } from '@/modules/PaymentPay/PaymentPay'
import { PaymentMenu } from '@/modules/PaymentMenu/PaymentMenu'
import { checkAccount } from '@/api/paymentAPI'
import { CustomError } from 'app/errors/CustomError'
import {
  ENROLL_SNAPSHOT,
  FACE_MATCH_LIVENESS_SNAPSHOT
} from 'app/constants/localStorage'

type Props = {
  id: number
  name: string
  long_description: string
}

const mainMenuInfo = [
  'Create an account to enable your face payment'
]

export const FacePaymentPage = ({ id, name, long_description }: Props) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentStepStepper, setCurrentStepStepper] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [cart, setCart] = useState<ShoppingItem>()
  const [total, setTotal] = useState(0)
  const [isAccountMade, setIsAccountMade] = useState(false)
  const [paymentAccountInfo, setPaymentAccountInfo] =
    useState<PaymentAccountInfo>()
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
      if (err instanceof CustomError && err.statusCode === 401) {
        setOpenModal(true)
      } else {
        console.error(err)
      }
    }
  }

  const checkStatus = async () => {
    if (session_id) {
      try {
        const res = await checkAccount(session_id)
        if (res) {
          setIsAccountMade(res.ok)
          setPaymentAccountInfo(res.data)
        }
      } catch (e) {
        if (e instanceof CustomError && e.statusCode === 400) {
          setIsAccountMade(false)
        }
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
        bannerUrl="/assets/images/solutions/face-payment/banner.png"
        analyticsName={name}
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
            <h2>Welcome to {name} Demo App</h2>
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
            onFinished={() => {
              createVisitorActivities(id, session_id, 25)
              moveStep(1, true)
            }}
            openModal={() => setOpenModal(true)}
          />
        )}

        {currentStep === 4 && (
          <ActivationForm
            nextStep={() => {
              createVisitorActivities(id, session_id, 50)
              checkStatus()
              setCurrentStep(2)
            }}
          />
        )}

        {currentStep === 5 && (
          <Catalog
            sessionId={session_id}
            onAddToCart={(item) => {
              setCart(item)
              moveStep(1)
            }}
          />
        )}

        {currentStep === 6 && cart && (
          <Cart
            onBack={() => moveStep(-1)}
            onCheckout={(item) => {
              setCart(item)
              moveStep(1)
            }}
            item={cart}
          />
        )}

        {currentStep === 7 && cart && (
          <OrderSummary
            cart={cart}
            onNext={(total) => {
              setTotal(total)
              moveStep(1)
            }}
            onBack={() => moveStep(-1)}
          />
        )}

        {currentStep === 8 && paymentAccountInfo !== undefined && (
          <PaymentPay
            paymentAccountInfo={paymentAccountInfo}
            sessionId={session_id}
            amount={total}
            setPaymentAccountInfo={setPaymentAccountInfo}
            afterPay={() => {
              moveStep(1)
              setCurrentStepStepper(5)
              createVisitorActivities(id, session_id, 90)
            }}
            backToCatalog={() => setCurrentStep(5)}
            backToStart={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 9 && (
          <Feedback
            id={id}
            afterSubmit={() => {
              createVisitorActivities(id, session_id, 100)
              localStorage.removeItem(ENROLL_SNAPSHOT)
              localStorage.removeItem(FACE_MATCH_LIVENESS_SNAPSHOT)
            }}
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
