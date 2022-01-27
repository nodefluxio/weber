import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'
import { useState } from 'react'
import Image from 'next/image'
import { postFeedback } from '@/api/feedbackAPI'
import { parseCookies } from 'nookies'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'

type Props = {
  id: number
  jobId: string
  className?: string
  onChosen: () => void
  onTryAgain: () => void
}

const options = [
  {
    rating: 4,
    label: 'Yes, my selfie is a real selfie and I pass the verification',
    comment: 'true accept'
  },
  {
    rating: 3,
    label: "Yes, my selfie is a spoof selfie and I'm rejected",
    comment: 'true reject'
  },
  {
    rating: 2,
    label: "No, my selfie is a real selfie but I'm rejected",
    comment: 'false reject'
  },
  {
    rating: 1,
    label: 'No, my selfie is a spoof selfie but I pass the verification',
    comment: 'false accept'
  }
]

export const LivenessReview = ({
  id,
  jobId,
  className,
  onChosen,
  onTryAgain
}: Props) => {
  const [hasChosen, setHasChosen] = useState(false)
  const handleClick = async (comment: string, rating: number) => {
    try {
      const { session_id } = parseCookies()
      const jsonComment = JSON.stringify({ jobId: jobId, comment: comment })
      const res = await postFeedback({
        id,
        session_id,
        rating,
        comment: jsonComment
      })
      if (res && res.ok) {
        setHasChosen(true)
        onChosen()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {hasChosen ? (
        <>
          <h3 className="mb-8 text-2xl font-bold">Thanks for your feedback!</h3>
          <Image
            src={'/assets/icons/thankyou.svg'}
            width={100}
            height={100}
            alt="thankyou svg"
          />
          <div className="flex flex-col max-w-sm mt-8">
            <Button className="mb-4" color={Color.Primary} onClick={onTryAgain}>
              Try again with another photo
            </Button>
            <ButtonLink href="/" color={Color.Secondary}>
              Explore More
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">
            Thank you for using the Liveness Demo App
          </h2>
          <span className="text-xl font-semibold my-10">
            Is our liveness prediction true?
          </span>
          {options.map((o, i) => (
            <Button
              key={i}
              color={Color.Primary}
              className={`py-4 ${i > 0 ? 'mt-4' : ''}`}
              onClick={() => handleClick(o.comment, o.rating)}>
              {o.label}
            </Button>
          ))}
        </>
      )}
    </div>
  )
}
