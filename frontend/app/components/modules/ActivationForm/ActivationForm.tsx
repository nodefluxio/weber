import { PinInput } from '@/elements/PinInput/PinInput'
import { Modal } from '@/elements/Modal/Modal'
import { Button } from '../../elements/Button/Button'
import { useEffect, useState } from 'react'
import styles from './ActivationForm.module.scss'
import { Color } from '@/types/elements'
import {
  MAX_PAYMENT,
  MIN_PAYMENT,
  PIN_DIGIT_LENGTH
} from 'app/constants/amounts'
import { PaymentSetup } from '../PaymentSetup/PaymentSetup'
import { activateAccount } from '@/api/paymentAPI'
import { parseCookies } from 'nookies'
import { Spinner } from '@/elements/Spinner/Spinner'

type Props = {
  nextStep: Function
}

export const ActivationForm = ({ nextStep }: Props) => {
  const [pinCode, setPinCode] = useState('')
  const [payment, setPayment] = useState(MIN_PAYMENT)
  const [warningMsg, setWarningMsg] = useState('')
  const [isPinCreated, setIsPinCreated] = useState(false)
  const [isModalShowed, setIsModalShowed] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)

  useEffect(() => {
    if (payment < MIN_PAYMENT || payment > MAX_PAYMENT) {
      setWarningMsg(
        `*Enter value between IDR ${MIN_PAYMENT.toLocaleString()} and IDR ${MAX_PAYMENT.toLocaleString()}`
      )
    } else {
      setWarningMsg('')
    }
  }, [payment])

  const activate = async () => {
    const { session_id } = parseCookies()
    setIsModalLoading(true)
    try {
      const res = await activateAccount(session_id, pinCode, payment)
      if (res.ok) {
        setIsModalShowed(false)
        nextStep()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Modal show={isModalShowed} onClose={() => setIsModalShowed(false)}>
        {isModalLoading ? <Spinner /> : <PaymentSetup onChange={setPayment} />}
        <span className={styles.warningMsg}>{warningMsg}</span>
        <div className={styles.buttonWrapper}>
          <Button
            type="button"
            color={Color.Primary}
            disabled={
              isModalLoading || payment < MIN_PAYMENT || payment > MAX_PAYMENT
            }
            onClick={() => {
              activate()
              setIsModalLoading(false)
            }}>
            Next
          </Button>
        </div>
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
