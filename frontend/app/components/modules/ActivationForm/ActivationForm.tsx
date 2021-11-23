import { PinInput } from '@/elements/PinInput/PinInput'
import { Modal } from '@/elements/Modal/Modal'
import { Button } from '../../elements/Button/Button'
import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  nextStep: () => void
}

export const ActivationForm = ({ nextStep }: Props) => {
  const [pinCode, setPinCode] = useState('')
  const [payment, setPayment] = useState(MIN_PAYMENT)
  const [warningMsg, setWarningMsg] = useState('')
  const [isModalShowed, setIsModalShowed] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [isModalSuccess, setIsModalSuccess] = useState(false)

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
        setIsModalSuccess(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleModalButtonOnClick = () => {
    if (isModalSuccess) {
      setIsModalShowed(false)
      nextStep()
    } else {
      activate()
      setIsModalLoading(false)
    }
  }

  return (
    <>
      <Modal show={isModalShowed} onClose={() => setIsModalShowed(false)}>
        {isModalLoading ? (
          <Spinner />
        ) : isModalSuccess ? (
          <div className={styles.activationSuccess}>
            <h2>Activation Success</h2>
            <Image src={'/assets/icons/thankyou.svg'} width={90} height={90} />
            <div>
              <p>Congratulations, your account has been activated!</p>
              <div>Your balance</div>
              <div className={styles.initBalance}>
                {/* Mungkin butuh penyesuaian, kalo mau nilainya dipassing dari backend */}
                {`IDR ${MAX_PAYMENT.toLocaleString()}`}
              </div>
            </div>
          </div>
        ) : (
          <PaymentSetup onChange={setPayment} />
        )}
        <div className={styles.warningMsg}>{warningMsg}</div>
        <div className={styles.buttonWrapper}>
          <Button
            type="button"
            color={Color.Primary}
            disabled={
              isModalLoading || payment < MIN_PAYMENT || payment > MAX_PAYMENT
            }
            onClick={handleModalButtonOnClick}>
            {isModalSuccess ? 'Go to Store' : 'Next'}
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
        />
        <div className={styles.warningMsg}>
          {pinCode === '000000' &&
            'All zeros pin is not allowed. Please use other combination'}
        </div>
        <Button
          type="button"
          color={Color.Primary}
          disabled={pinCode.length < PIN_DIGIT_LENGTH || pinCode === '000000'}
          onClick={() => {
            setIsModalShowed(true)
          }}>
          Next
        </Button>
      </div>
    </>
  )
}
