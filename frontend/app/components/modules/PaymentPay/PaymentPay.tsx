import Image from 'next/image'
import { BigInput } from '@/elements/BigInput/BigInput'
import { Button } from '@/elements/Button/Button'
import { PinInput } from '@/elements/PinInput/PinInput'
import { Color } from '@/types/elements'
import { PIN_DIGIT_LENGTH } from 'app/constants/amounts'
import { useState } from 'react'
import { Cam } from '../Cam/Cam'
import styles from './PaymentPay.module.scss'

type Props = {}

export const PaymentPay = ({}: Props) => {
  const [step, setStep] = useState(1)
  const [pinCode, setPinCode] = useState('')
  const [isPinCreated, setIsPinCreated] = useState(false)
  const [phone, setPhone] = useState('')

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
            <Button color={Color.Primary} onClick={() => setStep(2)}>
              Next Step
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
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
              }}>
              Next
            </Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className={styles.resultWrapper}>
          <h2>Hello, {'User'}</h2>
          <Image
            src={'/assets/icons/thankyou.svg'}
            width={80}
            height={80}
            alt="thank you"
          />
          <p className={styles.balance}>
            You have to pay <strong>{'100.000'}</strong>
          </p>
          <p className={styles.balance}>
            Current Balance <strong>{'60.000'}</strong>
          </p>
          <p className={styles.balance}>
            Final Balance <strong>{'40.000'}</strong>
          </p>

          <Button
            type="button"
            color={Color.Primary}
            onClick={() => setStep(5)}>
            Confirm
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
