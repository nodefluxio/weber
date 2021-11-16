import { Button } from '@/elements/Button/Button'
import { Color, ShoppingItem } from '@/types/elements'
import { formatMoney } from '@/utils/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './OrderSummary.module.scss'

type Props = {
  cart: ShoppingItem
  onNext: (total: number) => void
  onBack?: () => void
}
const SHIPPING_FEE = 15000

export const OrderSummary = ({ cart, onBack, onNext }: Props) => {
  const [totalPay, setTotalPay] = useState<number>(
    cart.price * cart.quantity - SHIPPING_FEE
  )

  useEffect(() => {
    const total = cart.quantity * cart.price + SHIPPING_FEE
    setTotalPay(total)
  }, [cart])

  return (
    <div className={styles.orderSummary}>
      <div className={styles.container}>
        <p className={styles.title}>Order Summary</p>
      </div>
      <hr />
      <div className={styles.container}>
        <Button onClick={onBack} className={styles.backButton}>
          ➜
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.items}>
          <div className={styles.imgContainer}>
            <Image
              src={`/assets/images/solutions/face-payment/${cart.image}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p>{cart.name}</p>
          <div className={styles.qAndTotal}>
            <p>{`x${cart.quantity}`}</p>
            <p>{`IDR ${formatMoney(cart.price)}`}</p>
          </div>
        </div>
      </div>
      <h2 />
      <div className={styles.container}>
        <div className={styles.flex}>
          <p>Sub Total</p>
          <h4>{`IDR ${formatMoney(cart.quantity * cart.price)}`}</h4>
        </div>
        <div className={styles.flex}>
          <p>Shipping Fee</p>
          <h4>{`IDR ${formatMoney(SHIPPING_FEE)}`}</h4>
        </div>
      </div>
      <hr />
      <div className={styles.container}>
        <div className={styles.flex}>
          <p>Payment Method</p>
          <h4>Face Payment</h4>
        </div>
        <div className={`${styles.flex} ${styles.total}`}>
          <p>Total</p>
          <p>
            <strong>{`IDR ${formatMoney(totalPay)}`}</strong>
          </p>
        </div>
      </div>
      <Button
        onClick={() => onNext(totalPay)}
        className={styles.submitBtn}
        color={Color.Primary}>
        Next
      </Button>
    </div>
  )
}
