import Image from 'next/image'
import { BigInput } from '@/elements/BigInput/BigInput'
import { Button } from '@/elements/Button/Button'
import { PinInput } from '@/elements/PinInput/PinInput'
import { Color } from '@/types/elements'
import { PIN_DIGIT_LENGTH } from 'app/constants/amounts'
import { useState } from 'react'
import { Cam } from '../Cam/Cam'
import styles from './PaymentPay.module.scss'
import { checkLimit, pay } from '@/api/paymentAPI'
import { getImageFromLocalStorage } from '@/utils/localStorage/localStorage'

type Props = { sessionId: string; amount: number }

export const PaymentPay = ({ sessionId, amount }: Props) => {
  const [step, setStep] = useState(1)
  const [pinCode, setPinCode] = useState('')
  const [isPinCreated, setIsPinCreated] = useState(false)
  const [phone, setPhone] = useState('')
  const [isPinRequired, setIsPinRequired] = useState(true)
  const [user, setUser] = useState('User')
  const [balance, setBalance] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')

  const resolveCheckLimit = async (
    session_id: string,
    phone: string,
    amount: number
  ) => {
    try {
      const res = await checkLimit(session_id, phone, amount)

      if (res?.ok) {
        setIsPinRequired(!res.data[0].is_limit)
        setUser(res.data[0].full_name)
        setBalance(res.data[0].balance)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const resolvePay = async (
    session_id: string,
    phone: string,
    pin: string,
    amount: number,
    image: string
  ) => {
    try {
      const res = await pay(session_id, phone, pin, amount, image)

      if (res) {
        setIsSuccess(res?.ok)
        setMessage(res?.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {step === 1 && (
        <div className={styles.phoneNumber}>
          <BigInput
            type="tel"
            id="phone"
            label="Please enter your phone number:"
            onChange={setPhone}
          />
          <div className={styles.buttonWrapper}>
            <Button
              color={Color.Primary}
              onClick={() => {
                setStep(2)
                resolveCheckLimit(sessionId, phone, amount)
              }}>
              Next Step
            </Button>
          </div>
        </div>
      )}
      {step === 2 && isPinRequired && (
        <div>
          <Cam
            localkey="face_match_&_liveness"
            overlayShape="circle"
            nextStep={() => setStep(3)}
          />
        </div>
      )}
      {step === 3 && (
        <div className={styles.pinInputWrapper}>
          <PinInput
            message={'You’ve reach your minimum payment, please input your pin'}
            digits={PIN_DIGIT_LENGTH}
            onPinChange={setPinCode}
            isDisabled={isPinCreated}
          />
          <div className={styles.buttonWrapper}>
            <Button
              type="button"
              color={Color.Primary}
              disabled={pinCode.length < PIN_DIGIT_LENGTH}
              onClick={() => {
                setStep(4)
                setIsPinCreated(true)
                resolvePay(
                  sessionId,
                  phone,
                  pinCode,
                  amount,
                  getImageFromLocalStorage('face_match_&_liveness', () =>
                    setStep(2)
                  )
                )
              }}>
              Next
            </Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className={styles.resultWrapper}>
          <h2>{isSuccess && `Hello, ${user}`}</h2>
          <Image
            src={`/assets/icons/${isSuccess ? 'thankyou.svg' : 'warning.svg'}`}
            width={80}
            height={80}
            alt={isSuccess ? 'thank you' : 'warning'}
          />
          {isSuccess ? (
            <>
              <p className={styles.balance}>
                You have to pay <strong>{amount}</strong>
              </p>
              <p className={styles.balance}>
                Current Balance <strong>{balance}</strong>
              </p>
              <p className={styles.balance}>
                Final Balance <strong>{balance - amount}</strong>
              </p>
            </>
          ) : (
            <p>{message}</p>
          )}

          <Button
            type="button"
            color={Color.Primary}
            onClick={() => setStep(isSuccess ? 5 : 2)}>
            {isSuccess ? 'Confirm' : 'Try Again'}
          </Button>
        </div>
      )}
      {step === 5 && (
        <div className={styles.resultWrapper}>
          <h2>Payment Successful!</h2>
          <Image
            src="/assets/icons/thankyou.svg"
            width={80}
            height={80}
            alt="thank you"
          />
          <p>
            Thank you! your data will be deleted at the end of the day, You have
            to re-register if you want to try again on the next day.
          </p>
          <Button
            type="button"
            color={Color.Primary}
            onClick={() => setStep(5)}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}
