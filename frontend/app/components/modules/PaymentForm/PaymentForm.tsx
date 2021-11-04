import { SubmitHandler, useForm } from "react-hook-form"
import { Color } from "../../../types/elements"
import { Button } from "../../elements/Button/Button"
import { TextField } from "../../elements/TextField/TextField"
import { Label } from "../../elements/Label/Label"
import styles from "./PaymentForm.module.scss"
import { parseCookies } from "nookies"
import { postActivities } from "../../../api/activitiesAPI"

type PaymentFormData = {
  name: string,
  phone_num: string,
  have_twin: string
}

type Props = {
  onNextStep: Function,
  onInvalidSession?: Function
}

export const PaymentForm = ({ onNextStep, onInvalidSession }: Props) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormData>()

  const onSubmit: SubmitHandler<PaymentFormData> = (data) => {
    const { session_id } = parseCookies()
    if (session_id) {
      // postActivities()
      onNextStep({
        ...data,
        have_twin: data.have_twin === 'true'
      })
    }
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.subtitle}>
        <h2>Register Yourself</h2>
        <p>Before making any transaction using face payment, you must register your e-wallet account first</p>
      </div>
      <form
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
          <div style={{ textAlign: "center" }}>
            <Label id={"have_twin"} errors={errors} label={"Do you have any twins?"} />
            <div className={styles.radios}>
              <label htmlFor="have_twin_yes">
                <input
                  type="radio"
                  value="true"
                  id="have_twin_yes"
                  {...register("have_twin", { required: "required" })} />
                Yes
              </label>
              <label htmlFor="have_twin_no">
                <input
                  type="radio"
                  value="false"
                  id="have_twin_no"
                  {...register("have_twin", { required: "required" })} />
                No
              </label>
            </div>
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Button type="submit" color={Color.Primary}>Next</Button>
        </div>
      </form>
    </div>
  )
}