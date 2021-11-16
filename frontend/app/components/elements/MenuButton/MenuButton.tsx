import styles from './MenuButton.module.scss'

type Props = {
  title: string
  disabled: boolean
  onClick: Function
}

export const MenuButton = ({ title, disabled, onClick }: Props) => {
  return (
    <div
      className={`${styles.menuButtonWrapper} ${
        disabled ? styles.disabled : styles.active
      }`}
      onClick={() => {
        if (!disabled) onClick()
      }}>
      <span>{title}</span>
    </div>
  )
}
