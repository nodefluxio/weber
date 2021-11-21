import { useState } from 'react'
import Image from 'next/image'
import { RequestDemoForm } from '../RequestDemoForm/RequestDemoForm'
import styles from './RequestDemoFormPopup.module.scss'
export const RequestDemoFormPopup = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  return (
    <div className={styles.container}>
      {isSubmitSuccess ? (
        <div className={styles.successContainer}>
          <Image
            src="/assets/icons/thankyou.svg"
            alt="checklist circle"
            width={117}
            height={117}
          />
          <h2>You are successfully registered</h2>
          <p>Thank you for submitting this form.</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.text}>
            <h2>Let us know you!</h2>
            <p>Please fill this form to continue to try our product. </p>
          </div>
          <RequestDemoForm onSuccess={() => setIsSubmitSuccess(true)} />
        </div>
      )}
    </div>
  )
}
