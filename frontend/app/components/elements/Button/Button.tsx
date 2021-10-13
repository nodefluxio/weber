import { ReactNode, MouseEventHandler, forwardRef } from 'react'
import styles from './Button.module.scss'
import { colorChoices } from '../../../types/elements'

type Props = {
  children: ReactNode
  color: colorChoices
  type?: 'button' | 'submit' | 'reset' | 'link' | undefined
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const Button = forwardRef(
  ({ children, color, type, onClick }: Props, ref) => {
    let tagName = 'button'
    if (type === 'link') {
      tagName = 'a'
    }

    const Component = tagName as React.ElementType

    const attributes = {
      className: `${styles.btn} ${color && styles[color]}`,
      type: type === 'link' ? undefined : type,
      onClick: onClick,
      ref: ref,
    }

    return (
      <>
        <Component {...attributes}>{children}</Component>
      </>
    )
  }
)
