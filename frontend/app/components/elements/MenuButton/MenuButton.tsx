import styles from './MenuButton.module.scss'

type Props = {
  title: string
}

export const MenuButton = ({ title }: Props) => {
  return (
    <div className={styles.menuButtonWrapper}>
      <span>{ title }</span>
    </div>
  )
}
