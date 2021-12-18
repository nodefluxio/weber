import { parseCookies } from 'nookies'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SubmitHandler, useForm } from 'react-hook-form'
import { postFeedback } from '../../../api/feedbackAPI'
import { Button } from '../../elements/Button/Button'
import { Label } from '../../elements/Label/Label'
import { Star } from '../../elements/Star/Star'
import { Color } from '../../../types/elements'
import { FeedbackData } from '../../../types/elements'
import styles from './Feedback.module.scss'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'

type Props = {
  id: number
  onTryAgain: () => void
  afterSubmit?: () => void
  className?: string
}

const Feedback = ({ id, onTryAgain, afterSubmit, className }: Props) => {
  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('Thank you!')
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FeedbackData>()

  const [watchComment, watchRating] = watch(['comment', 'rating'])
  useEffect(() => {
    if (watchRating >= 4) {
      setIsDisabled(false)
    } else if (watchRating < 4 && watchComment && watchComment.length >= 20) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [watchComment, watchRating])

  const onSubmit: SubmitHandler<FeedbackData> = async (data) => {
    try {
      setIsLoading(true)
      const { session_id } = parseCookies() // Assume cookies exist
      const res = await postFeedback({ id, session_id, ...data })
      if (res && res.ok) {
        setMessage(res.message)
        setIsSuccess(true)

        if (afterSubmit) {
          afterSubmit()
        }
      } else {
        throw new Error('Empty response')
      }
    } catch (err) {
      setMessage('Please submit again')
      setIsSuccess(false)
    } finally {
      setIsSubmitted(true)
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full text-center ${className}`}>
      {isSubmitted && isSuccess ? (
        <div className="flex flex-col items-center justify-center text-centers">
          <Image
            src={'/assets/icons/thankyou.svg'}
            width={90}
            height={90}
            alt="thankyou svg"
          />
          <h3 className="my-4 text-primary-500">{message}</h3>
          <div className="flex flex-col max-w-sm">
            <Button className="mb-4" color={Color.Primary} onClick={onTryAgain}>
              Try again with another photo
            </Button>
            <ButtonLink href="/" color={Color.Secondary}>
              Explore More
            </ButtonLink>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col items-center"
          method="post"
          onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-primary-500 mb-4">How was your experience?</h3>
          {isSubmitted && (
            <WarningDiv message={message} className="inline-block" />
          )}
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                onClick={() => {
                  setValue('rating', i + 1)
                  setRating(i + 1)
                }}
                className="w-8 h-auto cursor-pointer mx-1"
                svgClassName={
                  i + 1 <= rating
                    ? 'fill-secondary-500 transition-[fill] hover:fill-secondary-600'
                    : 'fill-gray-300 transition-[fill] hover:fill-gray-400'
                }
              />
            ))}
          </div>
          <Label
            className="block font-serif font-normal mb-1"
            id={'comment'}
            errors={errors}
            label={
              watchRating < 4
                ? 'Leave a comment (min. 20 characters)'
                : 'Comment'
            }
          />
          <textarea
            id="comment"
            className="p-4 resize-none font-serif
             h-32 rounded border focus:border-primary-300 mb-4 outline-none w-full max-w-sm"
            placeholder="Tell us your experience"
            {...register('comment')}
          />
          <Button
            className="mx-auto w-full max-w-sm"
            type="submit"
            color={Color.Secondary}
            disabled={isDisabled || isLoading}>
            {isLoading ? 'Sending feedback...' : 'Submit'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default Feedback
