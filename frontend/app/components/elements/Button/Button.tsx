import { MouseEventHandler } from 'react'

type Props = {
  text: string
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({ text, type, onClick }: Props) => {
  return (
    <button onClick={onClick} type={type}>
      {text}
    </button>
  )
}
