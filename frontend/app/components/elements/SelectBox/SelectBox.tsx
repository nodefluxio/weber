import { DeepMap, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { Label } from '../Label/Label'
import styles from './SelectBox.module.scss'

type Props = {
  id: string
  label: string
  options: { value: string; name: string }[]
  register?: UseFormRegister<any>
  registerOptions?: RegisterOptions
  errors?: DeepMap<any, any>
}

export const SelectBox = ({
  label,
  register,
  registerOptions,
  errors,
  options,
  ...otherProps
}: Props) => {
  const { id } = otherProps
  return (
    <div className={styles.container}>
      <Label id={id} errors={errors} label={label} />
      {register ? (
        <select {...register(id, registerOptions)} {...otherProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      ) : (
        <select {...otherProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
