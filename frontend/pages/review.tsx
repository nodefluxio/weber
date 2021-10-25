import { parseCookies } from "nookies"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { postReview } from "../app/api/reviewAPI"
import { Button } from "../app/components/elements/Button/Button"
import { Star } from "../app/components/elements/Star/Star"
import { Color } from "../app/types/elements"
import { ReviewData } from "../app/types/elements"
import styles from "./review.module.scss"

type ReviewProp = {
  id: number
}

const Review = ({ id }: ReviewProp) => {

  const [rating, setRating] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewData>()

  const onSubmit: SubmitHandler<ReviewData> = async (data) => {
    setErrorMsg("")
    console.log(data)
    try {
      const { session_id } = parseCookies() // Assume cookies exist
      const res = await postReview({ id, session_id, ...data })
      // handle data here
    } catch (err) {
      console.log((err as Error).message)
    }
  }

  return (
    <form
      className={styles.review}
      method="post"
      onSubmit={handleSubmit(onSubmit)}>
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
      <textarea
        className={styles.comment}
        placeholder="Any comments?"
        {...register("comment")} />
      <div className={styles.buttonWrapper}>
        <Button type="submit" color={Color.Primary}>Submit</Button>
      </div>
    </form>
  )
}

export default Review;