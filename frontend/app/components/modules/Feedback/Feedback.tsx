import { parseCookies } from "nookies"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"
import { postFeedback } from "../../../api/feedbackAPI"
import { Button } from "../../elements/Button/Button"
import { Label } from "../../elements/Label/Label"
import { Star } from "../../elements/Star/Star"
import { Color } from "../../../types/elements"
import { FeedbackData } from "../../../types/elements"
import styles from "./Feedback.module.scss"
import Link from "next/link"

interface ReviewProp {
  id: number
  onTryAgain: () => void
  afterSubmit?: () => void
}

const Feedback: React.FC<ReviewProp> = ({ id, onTryAgain, afterSubmit }) => {

  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("Thank you!")
  const [isDisabled, setIsDisabled] = useState(true)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FeedbackData>()

  const [watchComment, watchRating] = watch(["comment", "rating"])
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
      const { session_id } = parseCookies() // Assume cookies exist
      const res = await postFeedback({ id, session_id, ...data })
      if (res && res.ok) {
        setMessage(res.message)
        setIsSuccess(true)

        if (afterSubmit) {
          afterSubmit()
        }
      } else {
        throw new Error("Empty response")
      }
    } catch (err) {
      setMessage("Please try submit again")
      setIsSuccess(false)
    } finally {
      setIsSubmitted(true)
    }
  }

  return (
    isSubmitted && isSuccess ?
      <div className={styles.thankYou}>
        <Image src={"/assets/icons/thankyou.svg"} width={90} height={90} />
        <h3>{message}</h3>
        <Button type="button" color={Color.Primary} onClick={onTryAgain}>Try again with another photo</Button>
        <Link passHref href="/">
          <Button type="link" color={Color.Secondary}>Explore More</Button>
        </Link>
      </div>
      :
      <form
        className={styles.review}
        method="post"
        onSubmit={handleSubmit(onSubmit)}>
        <h3>How was your experience?</h3>
        {isSubmitted && <span>{message}</span>}
        <div className={styles.starFlex}>
          {
            [...Array(5)].map((_, i) =>
              <Star
                key={i}
                onClick={() => {
                  setValue("rating", i + 1)
                  setRating(i + 1)
                }}
                className={`${styles.star} ${i + 1 <= rating ? styles.colored : styles.idle}`}
              />
            )
          }
        </div>
        <Label
          id={"comment"}
          errors={errors}
          label={watchRating < 4 ? "Leave a comment (min. 20 characters)" : "Comment"} />
        <textarea
          id="comment"
          className={styles.comment}
          placeholder="Tell us your experience"
          {...register("comment")} />
        <div className={styles.buttonWrapper}>
          <Button
            type="submit"
            color={Color.Secondary}
            disabled={isDisabled}>Submit</Button>
        </div>
      </form>
  )
}

export default Feedback;
