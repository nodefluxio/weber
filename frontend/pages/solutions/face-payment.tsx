import { FacePaymentPage } from "../../app/components/templates/FacePaymentPage/FacePaymentPage";
import { Banner } from "../../app/components/modules/Banner/Banner";

const FacePayment = () => {
  return (
    <>
      <FacePaymentPage
        serviceId={6}
        name="Face Payment"
        shortDesc="Face Payment Short Description"
        longDesc="Face Payment Long Description"
        />
    </>
  )
}

export default FacePayment