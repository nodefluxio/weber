import Image from 'next/image'
import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'
import styles from './MailConfirmation.module.scss'
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
    <div className={styles.mailConfirmationWrapper}>
      <Image src="/assets/icons/thankyou.svg" width={80} height={80} alt="" />
      <h3>Thank you</h3>
      <p>Demo link will be sent to your email soon.</p>
    </div>
  ) : (
    <div className={styles.mailConfirmationWrapper}>
      <Image src="/assets/icons/email-icon.svg" width={80} height={80} alt="" />
      <p>
        Demo link will be sent to your registered email.
        <br />
        Do you want to continue?
      </p>
      <div className={styles.row}>
        <Button color={Color.Primary} onClick={handleReject}>
          No
        </Button>
        <Button color={Color.Primary} onClick={confirmSendEmail}>
          Yes, send email
        </Button>
      </div>
    </div>
  )
}
