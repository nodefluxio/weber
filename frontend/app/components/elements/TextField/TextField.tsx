import { HTMLInputTypeAttribute } from 'react'
import { DeepMap, RegisterOptions, UseFormRegister } from 'react-hook-form'
import styles from './TextField.module.scss'
import { Label } from '../Label/Label'

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
      <Label id={id} errors={errors} label={label} />
      {register ? (
        <input {...register(id, registerOptions)} {...otherProps} />
      ) : (
        <input {...otherProps} />
      )}
    </div>
  )
}
