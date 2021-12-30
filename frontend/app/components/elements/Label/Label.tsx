import { ErrorMessage } from '@hookform/error-message'
import { ReactNode } from 'react'
import { DeepMap } from 'react-hook-form'
type Props = {
  id: string
  label?: string
  children?: ReactNode
  className?: string
  errors?: DeepMap<any, any>
}

export const Label = ({ id, label, children, errors, className }: Props) => {
  return (
    <label
      className={`block font-semibold text-sm sm:text-base ${className}`}
      htmlFor={id}>
      {label}
      {children}
      {errors ? (
        <ErrorMessage
          className="inline text-xs mt-1 float-right text-red-600"
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
