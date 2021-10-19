import { ErrorMessage } from '@hookform/error-message'
import { DeepMap } from 'react-hook-form'
import styles from './Label.module.scss'
type Props = {
  id: string
  label: string
  errors?: DeepMap<any, any>
}

export const Label = ({ id, label, errors }: Props) => {
  return (
    <label className={styles.label} htmlFor={id}>
      {label}
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
