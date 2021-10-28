import { parseCookies } from "nookies"
import { useState } from "react"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"
import { postReview } from "../../../api/reviewAPI"
import { Button } from "../../../components/elements/Button/Button"
import { Label } from "../../../components/elements/Label/Label"
import { Star } from "../../../components/elements/Star/Star"
import { Color } from "../../../types/elements"
import { FeedbackData } from "../../../types/elements"
import styles from "./Feedback.module.scss"

interface ReviewProp {
  id: number
}

const Feedback: React.FC<ReviewProp> = ({ id }) => {

  const [rating, setRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("Thank you!")

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FeedbackData>()

  const onSubmit: SubmitHandler<FeedbackData> = async (data) => {
    if (rating === 0) return 
    try {
      const { session_id } = parseCookies() // Assume cookies exist
      const res = await postReview({ id, session_id, ...data })
      if (res && res.ok) {
        setMessage(res.message)
        setIsSuccess(true)
      } else {
        throw new Error("Something wrong has happened")
      }
    } catch (err) {
      setMessage((err as Error).message)
      setIsSuccess(false)
    } finally {
      setIsSubmitted(true)
    }
  }

  return (
    isSubmitted && isSuccess ?
      <div className={styles.thankYou}>
        <Image src={"/assets/icons/thankyou.svg"} width={75} height={75} />
        <h3>{message}</h3>
      </div>
      :
      <form
        className={styles.review}
        method="post"
        onSubmit={handleSubmit(onSubmit)}>
        { isSubmitted && "Try Again" }
        <h3>How was your experience?</h3>
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
        <Label id={"comment"} errors={errors} label={"Comment"} />
        <textarea
          id="comment"
          className={styles.comment}
          placeholder="Tell us your experience"
          {...register("comment", {
            required: rating < 4 ? "required" : undefined,
            minLength: rating < 4 ? { value: 20, message: "min. 20 characters" } : undefined
          })} />
        <div className={styles.buttonWrapper}>
          <Button type="submit" color={Color.Secondary}>Submit</Button>
        </div>
      </form>
  )
}

export default Feedback;