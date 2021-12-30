import { useState } from 'react'
import { RequestDemoForm } from '../RequestDemoForm/RequestDemoForm'
import Image from 'next/image'

export const RequestDemoFormPopup = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  return (
    <div className="px-2 md:px-8">
      {isSubmitSuccess ? (
        <div className="flex flex-col items-center py-16 text-center ">
          <Image
            src="/assets/icons/thankyou.svg"
            alt="checklist circle"
            width={117}
            height={117}
          />
          <h2 className="mb-1 mt-7 text-lg font-medium">
            You are successfully registered
          </h2>
          <p className="font-serif">Thank you for submitting this form.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl mb-2">Let us know you!</h2>
            <p className="font-serif font-medium text-lg">
              Please fill this form to continue to try our product.{' '}
            </p>
          </div>
          <RequestDemoForm onSuccess={() => setIsSubmitSuccess(true)} />
        </div>
      )}
    </div>
  )
}
