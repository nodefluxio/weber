import { MenuButton } from '@/elements/MenuButton/MenuButton'
import { MenuInfo } from '@/types/elements'
import styles from './PaymentMenu.module.scss'

type Props = {
  buttons: MenuInfo[]
  disabledList: number[]
}

export const PaymentMenu = ({ buttons, disabledList }: Props) => {
  return (
    <div className={styles.menuWrapper}>
      {buttons.map((btn, i) => (
        <MenuButton {...btn} disabled={disabledList.includes(i)} />
      ))}
    </div>
  )
}
