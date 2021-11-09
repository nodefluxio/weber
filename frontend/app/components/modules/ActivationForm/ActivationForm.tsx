import { PinInput } from '@/elements/PinInput/PinInput'
import { Modal } from '@/elements/Modal/Modal'
import { Button } from '../../elements/Button/Button'
import { useEffect, useState } from 'react'
import styles from './ActivationForm.module.scss'
import { Color } from '@/types/elements'
import { PaymentSetup } from '../PaymentSetup/PaymentSetup'

type Props = {
  nextStep: Function
}
const PIN_DIGIT_LENGTH = 6

export const ActivationForm = ({ nextStep }: Props) => {
  const [pinCode, setPinCode] = useState('')
  const [minPayment, setMinPayment] = useState()
  const [isPinCreated, setIsPinCreated] = useState(false)
  const [isModalShowed, setIsModalShowed] = useState(false)

  useEffect(() => {
    console.log(minPayment)
  }, [minPayment])

  return (
    <>
      <Modal show={isModalShowed} onClose={() => setIsModalShowed(false)}>
        <PaymentSetup onChange={setMinPayment} onSuccess={nextStep} />
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
