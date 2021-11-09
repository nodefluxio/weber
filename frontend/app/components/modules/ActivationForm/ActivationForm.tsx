import { PinInput } from '@/elements/PinInput/PinInput'
import { Modal } from '@/elements/Modal/Modal'
import { Button } from '../../elements/Button/Button'
import { useEffect, useState } from 'react'
import styles from './ActivationForm.module.scss'
import { Color } from '@/types/elements'
import { PaymentSetup } from '../PaymentSetup/PaymentSetup'
import { parseCookies } from 'nookies'
import { activateAccount } from '@/api/paymentAPI'
import { Spinner } from '@/elements/Spinner/Spinner'

type Props = {
  nextStep: Function
}
const PIN_DIGIT_LENGTH = 6

export const ActivationForm = ({ nextStep }: Props) => {
  const [pinCode, setPinCode] = useState('')
  const [minPayment, setMinPayment] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isPinCreated, setIsPinCreated] = useState(false)
  const [isModalShowed, setIsModalShowed] = useState(false)

  const activate = async () => {
    const { session_id } = parseCookies()
    try {
      const res = await activateAccount(session_id, pinCode, minPayment)
      if (res.ok) {
        nextStep()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log(minPayment)
  }, [minPayment])

  return (
    <>
      <Modal show={isModalShowed} onClose={() => setIsModalShowed(false)}>
        <PaymentSetup
          onChange={setMinPayment}
          onSuccess={() => {
            setIsLoading(true)
            activate()
          }}
        />
      </Modal>
      <div className={styles.pinInputWrapper}>
        <div>
          <h2>Activate Account</h2>
          <p>
            You are required to input them if you exceed the minimum payment
          </p>
        </div>
        <PinInput
          message={'Please remember the code and don’t tell anyone your code'}
          digits={PIN_DIGIT_LENGTH}
          onPinChange={setPinCode}
          isDisabled={isPinCreated}
        />
        <Button
          type="button"
          color={Color.Primary}
          disabled={pinCode.length < PIN_DIGIT_LENGTH}
          onClick={() => {
            setIsPinCreated(true)
            setIsModalShowed(true)
          }}>
          Next
        </Button>
      </div>
    </>
  )
}
