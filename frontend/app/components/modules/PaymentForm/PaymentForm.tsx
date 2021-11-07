import { SubmitHandler, useForm } from 'react-hook-form'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { TextField } from '../../elements/TextField/TextField'
import { Label } from '../../elements/Label/Label'
import styles from './PaymentForm.module.scss'
import { parseCookies } from 'nookies'
import { registerAccount } from '../../../api/paymentAPI'
import { SESSION_ID_ERROR } from '../../../constants/message'
import { useState } from 'react'

type PaymentFormData = {
  full_name: string
  phone: string
  have_twin: string
}

type Props = {
  onNextStep: Function
  onInvalidSession: Function
}

export const PaymentForm = ({ onNextStep, onInvalidSession }: Props) => {
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<PaymentFormData>()

  const onSubmit: SubmitHandler<PaymentFormData> = async (data) => {
    const { session_id } = parseCookies()
    if (session_id) {
      try {
        const res = await registerAccount(session_id, data.phone, data.full_name, data.have_twin === 'true')
        if (res.ok) {
          onNextStep({
            ...data,
            have_twin: data.have_twin === 'true'
          })
        } else {
          if (res.error === 401) { // Unauthorized
            onInvalidSession()
          } else if (res.error === 400) { // Not unique phone
            setError('phone', {
              type: 'server',
              message: res.message
            })
          } else {
            throw new Error(res.message)
          }
        }
      } catch (e) {
        setErrorMsg((e as Error).message)
      }
    } else {
      onInvalidSession()
    }
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.subtitle}>
        <h2>Register Yourself</h2>
        <p>
          Before making any transaction using face payment, you must register
          your e-wallet account first
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formOutline}>
          <TextField
            id="full_name"
            label="Name"
            placeholder="Your full name"
            type="text"
            register={register}
            registerOptions={{ required: 'required' }}
            errors={errors}
          />
          <TextField
            id="phone"
            label="Phone Number"
            placeholder="Your phone number"
            type="text"
            register={register}
            registerOptions={{
              required: 'required',
              pattern: { value: /^[0-9]*$/, message: 'wrong format' }
            }}
            errors={errors}
          />
          <div style={{ textAlign: 'center' }}>
            <Label
              id={'have_twin'}
              errors={errors}
              label={'Do you have any twins?'}
            />
            <div className={styles.radios}>
              <label htmlFor="have_twin_yes">
                <input
                  type="radio"
                  value="true"
                  id="have_twin_yes"
                  {...register('have_twin', { required: 'required' })}
                />
                Yes
              </label>
              <label htmlFor="have_twin_no">
                <input
                  type="radio"
                  value="false"
                  id="have_twin_no"
                  {...register('have_twin', { required: 'required' })}
                />
                No
              </label>
            </div>
          </div>
        </div>
        {errorMsg && <span>{errorMsg}</span>}
        <div className={styles.buttonWrapper}>
          <Button type="submit" color={Color.Primary}>
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}