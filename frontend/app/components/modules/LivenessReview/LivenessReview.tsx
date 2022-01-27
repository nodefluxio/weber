import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'
import { useState } from 'react'
import Image from 'next/image'
import { postFeedback } from '@/api/feedbackAPI'
import { parseCookies } from 'nookies'

type Props = {
  id: number
  className?: string
  onChosen?: (arg: string) => void
}

const options = [
  { comment: 'Yes, my selfie is a real selfie and I pass the verification' },
  { comment: "Yes, my selfie is a spoof selfie and I'm rejected" },
  { comment: "No, my selfie is a real selfie but I'm rejected" },
  { comment: 'No, my selfie is a spoof selfie but I pass the verification' }
]

export const LivenessReview = ({ id, className, onChosen }: Props) => {
  const [hasChosen, setHasChosen] = useState(false)
  const handleClick = async (comment: string) => {
    try {
      onChosen(comment)
      const { session_id } = parseCookies()
      const res = await postFeedback({ id, session_id, comment })
      if (res && res.ok) {
        setHasChosen(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {hasChosen ? (
        <Image
          src={'/assets/icons/thankyou.svg'}
          width={100}
          height={100}
          alt="thankyou svg"
        />
      ) : (
        options.map((o, i) => (
          <Button
            key={i}
            color={Color.Primary}
            className={`py-4 ${i > 0 ? 'mt-4' : ''}`}
            onClick={() => handleClick(o.comment)}>
            {o.comment}
          </Button>
        ))
      )}
    </div>
  )
}
