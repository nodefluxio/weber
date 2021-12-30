import { HTMLInputTypeAttribute } from 'react'
import { DeepMap, RegisterOptions, UseFormRegister } from 'react-hook-form'
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
    <div className="my-2">
      <Label id={id} errors={errors} label={label} />
      {register ? (
        <input
          className="w-full py-3 px-2 my-2 border-2 border-solid text-sm sm:text-base 
          border-gray-300 rounded focus:outline-none focus:border-primary-500 font-serif"
          {...register(id, registerOptions)}
          {...otherProps}
        />
      ) : (
        <input
          className="w-full py-3 px-2 my-2 border-2 border-solid text-sm sm:text-base 
          border-gray-300 rounded focus:outline-none focus:border-primary-500 font-serif"
          {...otherProps}
        />
      )}
    </div>
  )
}
