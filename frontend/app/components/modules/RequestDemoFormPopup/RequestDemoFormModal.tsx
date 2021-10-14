import { useState } from 'react'
import { RequestDemoForm } from '../RequestDemoForm/RequestDemoForm'

export const RequestDemoFormPopup = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  return (
    <div>
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
