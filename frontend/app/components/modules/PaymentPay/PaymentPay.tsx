import Image from 'next/image'
import { BigInput } from '@/elements/BigInput/BigInput'
import { Button } from '@/elements/Button/Button'
import { PinInput } from '@/elements/PinInput/PinInput'
import { Color, PaymentAccountInfo } from '@/types/elements'
import { PIN_DIGIT_LENGTH } from 'app/constants/amounts'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Cam } from '../Cam/Cam'
import { checkAccount, pay, resetBalance } from '@/api/paymentAPI'
import { getImageFromLocalStorage } from '@/utils/localStorage/localStorage'
import { Spinner } from '@/elements/Spinner/Spinner'
import { FACE_MATCH_LIVENESS_SNAPSHOT } from 'app/constants/localStorage'
import { CustomError } from 'app/errors/CustomError'
import { formatMoney } from '@/utils/utils'

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
            localStorage.removeItem(FACE_MATCH_LIVENESS_SNAPSHOT)
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
        <div className="block max-w-full">
          <BigInput
            type="tel"
            id="phone"
            label="Please enter your phone number:"
            onChange={setPhone}
          />
          <span className="text-red-600 text-lg font-serif">{phoneError}</span>
          <div className="flex mt-4 justify-center">
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
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Take a selfie!</h2>
            <p className="font-serif mt-2">
              Ensure your face position is in the oval area <br />
              Hold the camera at eye level. Look straight to the camera and
              smile!
            </p>
          </div>
          <div className="mt-6">
            <Cam
              localkey={FACE_MATCH_LIVENESS_SNAPSHOT}
              overlayShape="circle"
              nextStep={() => setStep(isPinRequired ? 3 : 4)}
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="w-full sm:w-[60%]">
          <div className="mx-auto">
            <PinInput
              message={"You've reached the limit, please input your pin"}
              digits={PIN_DIGIT_LENGTH}
              onPinChange={setPinCode}
            />
          </div>
          <div className="mt-4 flex justify-center">
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
        <div
          className="flex flex-col items-center justify-center
                        w-full md:w-[35%] my-6 mx-0 font-serif">
          <h2 className="text-2xl font-bold">{`Hello, ${paymentAccountInfo.full_name}`}</h2>
          <div className="flex flex-col text-xl w-full my-4">
            <div className="flex flex-row justify-between">
              <p>You have to pay</p>
              <p>
                <strong>{`IDR ${formatMoney(amount)}`}</strong>
              </p>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <p>Current balance</p>
              <p>
                <strong>{`IDR ${formatMoney(
                  paymentAccountInfo.balance
                )}`}</strong>
              </p>
            </div>
            {isBalanceSufficient ? (
              <div className="flex flex-row justify-between my-2">
                <p>Remaining Balance</p>
                <p>
                  <strong>
                    {`IDR ${formatMoney(paymentAccountInfo.balance - amount)}`}
                  </strong>
                </p>
              </div>
            ) : (
              <p className="my-2">
                <strong>Sorry, your balance is not enough</strong>
              </p>
            )}
          </div>
          {isBalanceSufficient ? (
            <>
              <div className="mt-5">
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
                      getImageFromLocalStorage(
                        FACE_MATCH_LIVENESS_SNAPSHOT,
                        () => setStep(2)
                      )
                    )
                  }}>
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <Button
                  type="button"
                  color={Color.Primary}
                  className="m-2"
                  onClick={() => backToCatalog()}>
                  Back to Catalog
                </Button>
                <Button
                  type="button"
                  color={Color.Primary}
                  className="m-2"
                  onClick={() => resolveResetBalance(sessionId)}>
                  Reset Balance
                </Button>
                <Button
                  type="button"
                  color={Color.Primary}
                  className="m-2"
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
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold">
              Processing your transaction...
            </h2>
            <Spinner className="my-10" />
            <p className="font-serif">Kindly wait for a moment</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-6">
              {isSuccess ? 'Payment Successful' : 'Payment Unsuccessfull'}
            </h2>
            <Image
              src={`/assets/icons/${
                isSuccess ? 'thankyou.svg' : 'warning.svg'
              }`}
              width={80}
              height={80}
              alt="thank you"
            />
            <p className="font-serif mt-6 mb-8">
              {isSuccess
                ? 'Thank you! your data will be deleted at the end of the day,\n You have to re-register if you want to try again on the next day.'
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
