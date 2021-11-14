import styles from './MenuButton.module.scss'

type Props = {
  title: string
  disabled: boolean
}

export const MenuButton = ({ title, disabled }: Props) => {
  return (
    <div
      className={`${styles.menuButtonWrapper} ${
        disabled ? styles.disabled : styles.active
      }`}>
      <span>{title}</span>
    </div>
  )
}
