import styles from "./FacePaymentPage.module.scss"
import { PaymentForm } from "../../modules/PaymentForm/PaymentForm"
import { FaceEnrollment } from "../../modules/FaceEnrollment/FaceEnrollment"

export const FacePaymentPage = () => {
  return (
    <div className={styles.container}>
      {/* <PaymentForm /> */}
      <FaceEnrollment/>
    </div>
  )
}