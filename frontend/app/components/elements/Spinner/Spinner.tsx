import styles from './Spinner.module.scss'

type Props = {
  className?: string
}

export const Spinner = ({ className }: Props) => {
  return <div className={`${styles.loader} ${className}`}>Loading...</div>
}
