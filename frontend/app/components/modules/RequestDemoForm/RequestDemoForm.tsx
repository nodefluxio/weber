import { Button } from '../../elements/Button/Button'
import { TextField } from '../../elements/TextField/TextField'
import { useForm } from 'react-hook-form'

type Props = {
  onSubmit: (data: FormData) => void
}

type FormData = {
  email: string
  full_name: string
  company: string
  job_title: string
  industry: string
}
export const RequestDemoForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  return (
    <form method='post' onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id='email'
        label='Email'
        placeholder='Your business email'
        type='email'
        register={register}
        registerOptions={{ required: 'Email is required' }}
        errors={errors}
      />
      <TextField
        id='full_name'
        label='Full Name'
        placeholder='Your full name'
        type='text'
        register={register}
        registerOptions={{
          required: 'Full Name is required',
          minLength: { value: 5, message: 'the minimum length is 5' },
          maxLength: { value: 40, message: 'the maximum length is 40' },
        }}
        errors={errors}
      />
      <TextField
        id='company'
        label='Company'
        placeholder='Company name'
        type='text'
        register={register}
        registerOptions={{ required: 'Company is required' }}
        errors={errors}
      />
      <div>
        <TextField
          id='job_title'
          label='Job Title'
          placeholder='Job title'
          type='text'
          register={register}
          registerOptions={{ required: 'Job Title is required' }}
          errors={errors}
        />
        <TextField
          id='industry'
          label='Industry'
          placeholder='Your company Industry'
          type='text'
          register={register}
          registerOptions={{ required: 'Industry is required' }}
          errors={errors}
        />
      </div>
      <Button text='Request Demo' type='submit' />
    </form>
  )
}
