import { ReactNode, MouseEventHandler, ButtonHTMLAttributes } from 'react'
import { Color } from '../../../types/elements'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  color?: Color
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  rect?: boolean
  className?: string
}

export const Button = ({
  children,
  color,
  rect,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={`py-3 px-5 bg-slate-50 font-bold cursor-pointer rounded-full
      font-sans disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow ${
        color === Color.Primary &&
        'bg-primary-500 text-white hover:bg-primary-600'
      } 
      ${
        color === Color.Secondary &&
        'bg-secondary-500 text-primary-500 hover:bg-secondary-600 '
      } 
      ${rect && 'rounded-md'} ${className}`}
      {...props}>
      {children}
    </button>
  )
}
