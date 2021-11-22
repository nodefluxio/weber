import { MenuButton } from '@/elements/MenuButton/MenuButton'
import { MenuInfo } from '@/types/elements'
import styles from './PaymentMenu.module.scss'

type Props = {
  buttons: MenuInfo[]
  disabledList: number[]
  title: string
}

export const PaymentMenu = ({ buttons, disabledList, title }: Props) => {
  return (
    <div className={styles.menuWrapper}>
      <h3>{title}</h3>
      <div className={styles.buttonWrapper}>
        {buttons.map((btn, i) => (
          <MenuButton {...btn} disabled={disabledList.includes(i)} key={i} />
        ))}
      </div>
    </div>
  )
}
