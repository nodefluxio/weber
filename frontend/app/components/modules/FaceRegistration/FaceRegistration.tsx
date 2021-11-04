import { PaymentForm } from "../PaymentForm/PaymentForm"
import { FaceEnrollment } from "../FaceEnrollment/FaceEnrollment"
import { useState } from "react"

type RegistPayload = {
  session_id: string,
  name: string,
  phone_num: string,
  have_twin: boolean
}

type Props = {
  onChecking: Function,
  openModal: Function
}

export const FaceRegistration = ({ onChecking, openModal }: Props) => {

  const [isFormFilled, setIsFormFilled] = useState(false)
  const [payload, setPayload] = useState<RegistPayload>()

  const onFormFilled = (data: any) => {
    // Handle data from form
    onChecking()
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
              nextStep={() => console.log("Final step")}
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