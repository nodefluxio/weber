import { MenuButton } from '@/elements/MenuButton/MenuButton'
import { MenuInfo } from '@/types/elements'

type Props = {
  buttons: MenuInfo[]
  disabledList: number[]
  title: string
}

export const PaymentMenu = ({ buttons, disabledList, title }: Props) => {
  return (
    <div className="flex flex-col w-1/2 text-center items-center">
      <h3>{title}</h3>
      <div className="flex flex-col sm:flex-row mt-4">
        {buttons.map((btn, i) => (
          <MenuButton
            {...btn}
            disabled={disabledList.includes(i)}
            key={i}
            className={i > 0 ? 'mt-3 sm:mt-0 sm:ml-3' : ''}
          />
        ))}
      </div>
    </div>
  )
}
