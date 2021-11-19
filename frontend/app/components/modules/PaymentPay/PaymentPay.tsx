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
import { Spinner } from '@/elements/Spinner/Spinner'
import { FACE_MATCH_LIVENESS_SNAPSHOT } from 'app/constants/localStorage'

type Props = { sessionId: string; amount: number; afterPay: () => void }

export const PaymentPay = ({ sessionId, amount, afterPay }: Props) => {
  const [step, setStep] = useState(1)
  const [pinCode, setPinCode] = useState('')
  const [phone, setPhone] = useState('')
  const [isPinRequired, setIsPinRequired] = useState(true)
  const [user, setUser] = useState('User')
  const [balance, setBalance] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const resolveCheckLimit = async (
    session_id: string,
    phone: string,
    amount: number
  ) => {
    try {
      const res = await checkLimit(session_id, phone, amount)

      if (res?.ok) {
        setIsPinRequired(res.data[0].is_limit || res.data[0].have_twin)
        setUser(res.data[0].full_name)
        setBalance(res.data[0].balance)
        setPhoneError('')
      } else {
        if (res?.message) {
          setPhoneError(res?.message)
          setStep(1)
        }
      }
    } catch (err) {
      console.log(err, 'error')
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
      setIsLoading(true)
      const res = await pay(session_id, phone, pin, amount, image)
      setIsLoading(false)

      if (res) {
        setIsSuccess(res?.ok)
        setMessage(res?.message)
      }
    } catch (err) {
      setIsSuccess(false)
      setIsLoading(false)
      console.error(err)
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
          <span className={styles.danger}>{phoneError}</span>
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
      {step === 2 && (
        <div>
          <Cam
            localkey={FACE_MATCH_LIVENESS_SNAPSHOT}
            overlayShape="circle"
            nextStep={() => setStep(isPinRequired ? 3 : 4)}
          />
        </div>
      )}
      {step === 3 && (
        <div className={styles.pinInputWrapper}>
          <PinInput
            message={'You’ve reach your minimum payment, please input your pin'}
            digits={PIN_DIGIT_LENGTH}
            onPinChange={setPinCode}
          />
          <div className={styles.buttonWrapper}>
            <Button
              type="button"
              color={Color.Primary}
              disabled={pinCode.length < PIN_DIGIT_LENGTH}
              onClick={() => setStep(4)}>
              Next
            </Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className={styles.resultWrapper}>
          <h2>{`Hello, ${user}`}</h2>

          <p className={styles.balance}>
            You have to pay <strong>{amount}</strong>
          </p>
          <p className={styles.balance}>
            Current Balance <strong>{balance}</strong>
          </p>
          <p className={styles.balance}>
            Remaining Balance <strong>{balance - amount}</strong>
          </p>

          <Button
            type="button"
            color={Color.Primary}
            onClick={() => {
              setStep(5)
              resolvePay(
                sessionId,
                phone,
                pinCode,
                amount,
                getImageFromLocalStorage(FACE_MATCH_LIVENESS_SNAPSHOT, () =>
                  setStep(2)
                )
              )
            }}>
            Confirm
          </Button>
        </div>
      )}
      {step === 5 &&
        (isLoading ? (
          <Spinner />
        ) : (
          <div className={styles.resultWrapper}>
            <h2>
              {isSuccess ? 'Payment Successful!' : 'Payment Unsuccessfull!'}
            </h2>
            <Image
              src={`/assets/icons/${
                isSuccess ? 'thankyou.svg' : 'warning.svg'
              }`}
              width={80}
              height={80}
              alt="thank you"
            />
            <p>
              {isSuccess
                ? 'Thank you! your data will be deleted at the end of the day, You have to re-register if you want to try again on the next day.'
                : message}
            </p>
            <Button
              type="button"
              color={Color.Primary}
              onClick={() => {
                isSuccess ? afterPay() : setStep(2)
              }}>
              {isSuccess ? 'Next' : 'Try Again'}
            </Button>
          </div>
        ))}
    </>
  )
}
