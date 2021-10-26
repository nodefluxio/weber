import { parseCookies } from "nookies"
import { useState } from "react"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"
import { postReview } from "../../../api/reviewAPI"
import { Button } from "../../../components/elements/Button/Button"
import { Label } from "../../../components/elements/Label/Label"
import { Star } from "../../../components/elements/Star/Star"
import { Color } from "../../../types/elements"
import { ReviewData } from "../../../types/elements"
import styles from "./Review.module.scss"

type ReviewProp = {
  id: number
}

const Review = ({ id }: ReviewProp) => {

  const [rating, setRating] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewData>()

  const onSubmit: SubmitHandler<ReviewData> = async (data) => {
    setErrorMsg("")
    try {
      const { session_id } = parseCookies() // Assume cookies exist
      // setSuccess(true)
      const res = await postReview({ id, session_id, ...data })
      if (res!.ok) {
        setSuccess(true)
      }
    } catch (err) {
      console.log((err as Error).message)
    }
  }

  return (
    success ?
    <div className={styles.thankYou}>
      <Image src={"/assets/icons/thankyou.svg"} width={75} height={75} />
      <h3>Thanks for your feedback!</h3>
    </div>
    :
    <form
      className={styles.review}
      method="post"
      onSubmit={handleSubmit(onSubmit)}>
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
          minLength: rating < 4 ? { value: 20, message: "min. 20 characters"} :  undefined
          })} />
      <div className={styles.buttonWrapper}>
        <Button type="submit" color={Color.Secondary}>Submit</Button>
      </div>
    </form>
  )
}

export default Review;