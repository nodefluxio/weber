import Image from 'next/image'
import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'
import { useState } from 'react'

type Props = {
  handleAccept: () => void
  handleReject: () => void
}

export const MailConfirmation = ({ handleAccept, handleReject }: Props) => {
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const confirmSendEmail = async () => {
    try {
      await handleAccept()
      setIsFinished(true)
    } catch (e) {
      console.error(e)
    }
  }

  return isFinished ? (
    <div className="flex flex-col items-center font-serif
                    w-[85%] h-[240px]
                    justify-center text-center m-auto">
      <Image src="/assets/icons/thankyou.svg" width={80} height={80} alt="" />
      <h3 className="font-bold text-xl my-3">Thank you</h3>
      <p>Demo link will be sent to your email soon.</p>
    </div>
  ) : (
    <div
      className="flex flex-col items-center
                    justify-center w-[85%] h-[240px]
                    m-auto px-0 py-4 text-center font-serif">
      <Image src="/assets/icons/email-icon.svg" width={80} height={80} alt="" />
      <p className="text-lg font-semibold mt-4">Demo link will be sent to your registered email.</p>
      <p className="mb-2">Do you want to continue?</p>
      <div className="flex flex-row mt-2">
        <Button color={Color.Primary} onClick={handleReject}>
          No
        </Button>
        <Button
          color={Color.Primary}
          onClick={confirmSendEmail}
          className="ml-4">
          Yes, send email
        </Button>
      </div>
    </div>
  )
}
