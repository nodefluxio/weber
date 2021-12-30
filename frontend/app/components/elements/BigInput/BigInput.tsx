import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Label } from '../Label/Label'

type Props = {
  id: string
  type: string
  label: string
  onChange: Dispatch<SetStateAction<string>>
}

export const BigInput = ({ id, type, label, onChange }: Props) => {
  const [text, setText] = useState('')

  useEffect(() => {
    onChange(text)
  }, [text, onChange])

  return (
    <div>
      <div className="flex justify-center mb-4">
        <Label id={id} label={label} className="md:text-2xl" />
      </div>
      <input
        type={type}
        id={id}
        onChange={(e) => setText(e.target.value)}
        value={text}
        className="bg-neutral-200 w-full font-serif
                    border-0 text-4xl pl-2 sm:text-5xl"
      />
    </div>
  )
}
