import { PaymentForm } from "../PaymentForm/PaymentForm"
import { FaceEnrollment } from "../FaceEnrollment/FaceEnrollment"
import { useState } from "react"

type RegistPayload = {
  session_id: string,
  full_name: string,
  phone: string,
  have_twin: boolean
}

type Props = {
  openModal: () => void,
  onFinished: () => void
}

export const FaceRegistration = ({ openModal, onFinished }: Props) => {

  const [isFormFilled, setIsFormFilled] = useState(false)
  const [payload, setPayload] = useState<RegistPayload>()

  const onFormFilled = (data: any) => {
    setPayload({ ...data })
    setIsFormFilled(true)
  }

  return (
    <>
      {
        isFormFilled ?
          (
            payload &&
            <FaceEnrollment
              openModal={openModal}
              payload={payload}
              nextStep={onFinished}
            />
          )
          :
          (
            <PaymentForm
              onNextStep={onFormFilled}
              onInvalidSession={openModal}
            />
          )
      }
    </>
  )
}
