import { ErrorMessage } from '@hookform/error-message'
import { ReactNode } from 'react'
import { DeepMap } from 'react-hook-form'
import styles from './Label.module.scss'
type Props = {
  id: string
  label?: string
  children?: ReactNode
  errors?: DeepMap<any, any>
}

export const Label = ({ id, label, children, errors }: Props) => {
  return (
    <label className={styles.label} htmlFor={id}>
      {label}
      {children}
      {errors ? (
        <ErrorMessage
          className={styles.errorMessage}
          errors={errors}
          name={id}
          as="p"
        />
      ) : (
        ''
      )}
    </label>
  )
}
