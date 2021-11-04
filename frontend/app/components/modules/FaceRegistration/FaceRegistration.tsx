import { PaymentForm } from "../PaymentForm/PaymentForm"
import { FaceEnrollment } from "../FaceEnrollment/FaceEnrollment"
import { useState } from "react"
import { postActivities } from "../../../api/activitiesAPI"

type RegistPayload = {
  session_id: string,
  name: string,
  phone_num: string,
  have_twin: boolean,
  images: string[]
}

type Props = {
  onArrival: Function
  onChecking: Function
}

export const FaceRegistration = ({ onArrival, onChecking }: Props) => {

  const [isFormFilled, setIsFormFilled] = useState(false)
  const [payload, setPayload] = useState<RegistPayload>()

  const onFormFilled = (data: any) => {
    setPayload({...data})
    setIsFormFilled(true)
  }

  return (
    <>
      {
        isFormFilled ?
          <FaceEnrollment />
          :
          <PaymentForm onNextStep={onFormFilled} />
      }
    </>
  )
}