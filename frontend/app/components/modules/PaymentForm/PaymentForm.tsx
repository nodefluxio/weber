import { SubmitHandler, useForm } from "react-hook-form"
import { Color } from "../../../types/elements"
import { Button } from "../../elements/Button/Button"
import { TextField } from "../../elements/TextField/TextField"
import styles from "./PaymentForm.module.scss"

type PaymentFormData = {
  name: string,
  phone_num: string // must be number
}

export const PaymentForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<PaymentFormData> = async (data) => {
    // TODO: Handle API Call Here
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.subtitle}>
        <h2>Register Yourself</h2>
        <p>Before making any transaction using face payment, you must register your e-wallet account first</p>
      </div>
      <form
        method="post"
        onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formOutline}>
          <TextField
            id="name"
            label="Name"
            placeholder="Your full name"
            type="text"
            register={register}
            registerOptions={{ required: "required" }}
            errors={errors} />
          <TextField
            id="phone_num"
            label="Phone Number"
            placeholder="Your phone number"
            type="text"
            register={register}
            registerOptions={{
              required: "required",
              pattern: { value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, message: "wrong format" }
            }}
            errors={errors} />
        </div>
        <div className={styles.buttonWrapper}>
          <Button type="submit" color={Color.Primary}>Next</Button>
        </div>
      </form>
    </div>
  )
}