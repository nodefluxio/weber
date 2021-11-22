import { Button } from '../../elements/Button/Button'
import { TextField } from '../../elements/TextField/TextField'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Color } from '../../../types/elements'
import axios, { AxiosError } from 'axios'
import {
  VisitorsPostErrorResponse,
  VisitorsPostResponse
} from '../../../types/responses'
import { setCookie } from 'nookies'
import { useState } from 'react'
import styles from './RequestDemoForm.module.scss'
import { SelectBox } from '../../elements/SelectBox/SelectBox'
import data from './industry.json';

const Industries = (data).Industries;

type Props = {
  onSuccess: () => void
}

type FormData = {
  email: string
  full_name: string
  company: string
  job_title: string
  industry: string
}

export const RequestDemoForm = ({ onSuccess }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMessage('')
    try {
      const res = await axios.post<VisitorsPostResponse>('/visitors', data)
      if (res.data.ok) {
        const { data } = res.data
        setCookie(null, 'session_id', data[0].session_id, {
          maxAge: data[0].max_age,
          path: '/'
        })
        onSuccess()
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const e = err as AxiosError<VisitorsPostErrorResponse>
        setErrorMessage(e.response?.data.message)
      } else {
        console.log(err)
      }
    }
  }

  return (
    <form
      className={styles.form}
      method="post"
      onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="email"
        label="Email"
        placeholder="Your business email"
        type="email"
        register={register}
        registerOptions={{ required: 'required' }}
        errors={errors}
      />
      <TextField
        id="full_name"
        label="Full Name"
        placeholder="Your full name"
        type="text"
        register={register}
        registerOptions={{
          required: 'required',
          minLength: { value: 5, message: 'minimum length is 5' },
          maxLength: { value: 40, message: 'maximum length is 40' }
        }}
        errors={errors}
      />
      <TextField
        id="company"
        label="Company"
        placeholder="Company name"
        type="text"
        register={register}
        registerOptions={{ required: 'required' }}
        errors={errors}
      />
      <div className={styles.divide}>
        <div className={styles.divideLeft}>
          <TextField
            id="job_title"
            label="Job Title"
            placeholder="Job title"
            type="text"
            register={register}
            registerOptions={{ required: 'required' }}
            errors={errors}
          />
        </div>
        <div className={styles.divideRight}>
          <SelectBox
            id="industry"
            label="Industry"
            options= {Industries}
            register={register}
            registerOptions={{ required: 'required' }}
            errors={errors}
          />
        </div>
      </div>
      <div className={styles.errorMessage}>
        {errorMessage ? `*${errorMessage}` : null}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.submitButton}
          type="submit"
          color={Color.Primary}>
          Submit
        </Button>
      </div>
    </form>
  )
}
