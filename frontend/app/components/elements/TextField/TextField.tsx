import { HTMLInputTypeAttribute } from 'react'
import { DeepMap, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import styles from './TextField.module.scss'

type Props = {
  id: string
  label: string
  type: HTMLInputTypeAttribute
  placeholder?: string
  register?: UseFormRegister<any>
  registerOptions?: RegisterOptions
  errors?: DeepMap<any, any>
}

export const TextField = ({
  label,
  register,
  registerOptions,
  errors,
  ...otherProps
}: Props) => {
  const { id } = otherProps
  return (
    <div className={styles.container}>
      <label htmlFor={id}>{label}</label>
      {register ? (
        <input {...register(id, registerOptions)} {...otherProps} />
      ) : (
        <input {...otherProps} />
      )}
      {errors ? <ErrorMessage errors={errors} name={id} as='p' /> : ''}
    </div>
  )
}
