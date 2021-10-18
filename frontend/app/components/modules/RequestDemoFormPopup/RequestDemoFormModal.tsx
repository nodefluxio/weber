import { useState } from 'react'
import { RequestDemoForm } from '../RequestDemoForm/RequestDemoForm'
import styles from './RequestDemoFormPopup.module.scss'
export const RequestDemoFormPopup = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  return (
    <div className={styles.container}>
      {isSubmitSuccess ? (
        <h1>Success</h1>
      ) : (
        <div>
          <h2>Let us know you!</h2>
          <h3>Please fill this form to continue to try our product. </h3>
          <RequestDemoForm onSuccess={() => setIsSubmitSuccess(true)} />
        </div>
      )}
    </div>
  )
}
