import { DeepMap, RegisterOptions, UseFormRegister } from 'react-hook-form'
import { Label } from '../Label/Label'

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
    <div className="my-2">
      <Label id={id} errors={errors} label={label} />
      {register ? (
        <select
          className="w-full py-[13px] px-2 my-2 border-2 border-solid border-gray-300
          rounded focus:outline-none focus:border-primary-500 font-serif bg-white text-sm sm:text-base"
          {...register(id, registerOptions)}
          {...otherProps}>
          <option value="" disabled selected hidden>
            Select option
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          className="w-full py-[13px] px-2 my-2 border-2 border-solid border-gray-300
           rounded focus:outline-none focus:border-primary-500 font-serif bg-white text-sm sm:text-base"
          {...otherProps}>
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
