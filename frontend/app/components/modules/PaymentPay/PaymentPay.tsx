import Image from 'next/image'
import { BigInput } from '@/elements/BigInput/BigInput'
import { Button } from '@/elements/Button/Button'
import { PinInput } from '@/elements/PinInput/PinInput'
import { Color, PaymentAccountInfo } from '@/types/elements'
import { PIN_DIGIT_LENGTH } from 'app/constants/amounts'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Cam } from '../Cam/Cam'
import styles from './PaymentPay.module.scss'
import { checkAccount, pay, resetBalance } from '@/api/paymentAPI'
import { getImageFromLocalStorage } from '@/utils/localStorage/localStorage'
import { Spinner } from '@/elements/Spinner/Spinner'
import { FACE_MATCH_LIVENESS_SNAPSHOT } from 'app/constants/localStorage'
import { CustomError } from 'app/errors/CustomError'

type Props = {
  sessionId: string
  amount: number
  paymentAccountInfo: PaymentAccountInfo
  setPaymentAccountInfo: Dispatch<
    SetStateAction<PaymentAccountInfo | undefined>
  >
  afterPay: () => void
  backToCatalog: () => void
  backToStart: () => void
}

export const PaymentPay = ({
  sessionId,
  amount,
  paymentAccountInfo,
  setPaymentAccountInfo,
  afterPay,
  backToCatalog,
  backToStart
}: Props) => {
  const [step, setStep] = useState(1)
  const [pinCode, setPinCode] = useState('')
  const [phone, setPhone] = useState('')
  const [isPinRequired, setIsPinRequired] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false)
  const [message, setMessage] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [httpCode, setHttpCode] = useState(500)

  useEffect(() => {
    setIsBalanceSufficient(paymentAccountInfo.balance - amount >= 0)
    setIsPinRequired(
      paymentAccountInfo.minimum_payment < amount ||
        paymentAccountInfo.have_twin
    )
  }, [
    amount,
    paymentAccountInfo.balance,
    paymentAccountInfo.have_twin,
    paymentAccountInfo.minimum_payment
  ])

  const checkPhone = () => {
    if (paymentAccountInfo.phone !== phone) {
      setPhoneError('Your phone number does not match with the registered one')
    } else {
      setPhoneError('')
      setStep(2)
    }
  }

  const resolveResetBalance = async (sessionId: string) => {
    try {
      await resetBalance(sessionId)
      const res = await checkAccount(sessionId)

      setPaymentAccountInfo(res?.data)
      backToCatalog()
    } catch (e) {
      if (e instanceof CustomError) {
        setHttpCode(e.statusCode)
        switch (e.statusCode) {
          case 404:
            backToStart()
            break
          default:
            console.error(e)
            break
        }
      } else {
        console.error(e)
      }
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
    } catch (e) {
      if (e instanceof CustomError) {
        setHttpCode(e.statusCode)
        switch (e.statusCode) {
          case 400:
          case 402:
            setIsSuccess(false)
            setMessage(e.message)
            break
          case 401:
            // TODO ADD OPEN MODAL
            break
          default:
            console.error(e)
            break
        }
      } else {
        setIsSuccess(false)
        console.error(e)
      }
      setIsLoading(false)
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
                checkPhone()
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
          <h2>{`Hello, ${paymentAccountInfo.full_name}`}</h2>

          <p className={styles.balance}>
            You have to pay <strong>{amount}</strong>
          </p>
          <p className={styles.balance}>
            Current Balance <strong>{paymentAccountInfo.balance}</strong>
          </p>
          {isBalanceSufficient ? (
            <>
              <p className={styles.balance}>
                Remaining Balance{' '}
                <strong>{paymentAccountInfo.balance - amount}</strong>
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
            </>
          ) : (
            <>
              <p className={styles.balance}>
                <strong>Sorry, your balance is not enough</strong>
              </p>
              <div className={styles.btnGroup}>
                <Button
                  type="button"
                  color={Color.Primary}
                  onClick={() => backToCatalog()}>
                  Back to Catalog
                </Button>
                <Button
                  type="button"
                  color={Color.Primary}
                  onClick={() => resolveResetBalance(sessionId)}>
                  Reset Balance
                </Button>
                <Button
                  type="button"
                  color={Color.Primary}
                  onClick={() => {
                    afterPay()
                  }}>
                  Finish
                </Button>
              </div>
            </>
          )}
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
                isSuccess || httpCode === 402 ? afterPay() : setStep(2)
              }}>
              {isSuccess || httpCode === 402 ? 'Next' : 'Try Again'}
            </Button>
          </div>
        ))}
    </>
  )
}
