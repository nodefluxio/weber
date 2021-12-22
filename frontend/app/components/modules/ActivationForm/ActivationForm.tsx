import { PinInput } from '@/elements/PinInput/PinInput'
import { Modal } from '@/elements/Modal/Modal'
import { Button } from '../../elements/Button/Button'
import { useEffect, useState } from 'react'
import Image from 'next/image'
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
      if (res?.ok) {
        setIsModalSuccess(true)
      }
    } catch (e) {
      // TO DO: give error message
      setIsModalSuccess(false)
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
          <div className="flex flex-col text-center mb-8">
            <h2 className="text-xl font-bold mb-6">Activation Success</h2>
            <Image src={'/assets/icons/thankyou.svg'} width={90} height={90} />
            <div className="mt-6">
              <p className="font-serif">
                Congratulations, your account has been activated!
              </p>
              <div className="mt-4">Your balance</div>
              <div className="text-3xl font-extrabold text-primary-500">
                {`IDR ${MAX_PAYMENT.toLocaleString()}`}
              </div>
            </div>
          </div>
        ) : (
          <PaymentSetup onChange={setPayment} />
        )}
        <div className="font-serif text-red-600 text-center mb-4">
          {warningMsg}
        </div>
        <div className="text-center">
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
      <div
        className="w-full sm:w-[75%] md:w-[55%]
                  mx-auto my-8 text-center max-w-[800px]">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create PIN</h2>
          <p className="font-serif">
            To ensure the security and convinience, you need to create a pin for
            double layer
            <br />
            verification for payment above the limit.
          </p>
        </div>
        <PinInput
          message={"Keep your PIN private and don't tell anyone your PIN!"}
          digits={PIN_DIGIT_LENGTH}
          onPinChange={setPinCode}
        />
        <div className="font-serif text-red-600 text-center mb-4">
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
