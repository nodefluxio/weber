import { FacePaymentPage } from "../../app/components/templates/FacePaymentPage/FacePaymentPage";
import { Banner } from "../../app/components/modules/Banner/Banner";

const FacePayment = () => {
  return (
    <>
      <Banner
        analyticsName="Face Payment"
        shortDescription="Short desc."
        longDescription="Long desc."/>
      <FacePaymentPage />
    </>
  )
}

export default FacePayment