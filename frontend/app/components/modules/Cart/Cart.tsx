import { Button } from '@/elements/Button/Button'
import Image from 'next/image'
import { Color, ShoppingItem } from '@/types/elements'
import { useState } from 'react'
import styles from './Cart.module.scss'

type Props = {
  item: ShoppingItem
  onBack?: () => void
  onCheckout: (item: ShoppingItem) => void
}
export const Cart = ({ item, onBack, onCheckout }: Props) => {
  const [quantity, setQuantity] = useState<number>(1)

  return (
    <div className={styles.cart}>
      <p className={styles.title}>Cart</p>
      <hr />
      <Button className={styles.backButton} onClick={onBack}>
        ➜
      </Button>

      <div className={styles.items}>
        <div className={styles.imgContainer}>
          <Image
            src={`/assets/images/solutions/face-payment/${item.image}`}
            layout="fill"
          />
        </div>
        <div className={styles.details}>
          <h4 className={styles.name}>{item.name}</h4>
          <p className={styles.price}>IDR {item.price}</p>
          <p className={styles.quantityText}>Quantity</p>
          <div className={styles.quantityControl}>
            <span
              onClick={() =>
                quantity > 1 ? setQuantity(quantity - 1) : setQuantity(1)
              }>
              {'\u02C3'}
            </span>
            <p className={styles.quantity}>{quantity}</p>
            <span
              onClick={() =>
                quantity < 99 ? setQuantity(quantity + 1) : setQuantity(99)
              }>
              {'\u02C3'}
            </span>
          </div>
          <div className={styles.total}>
            <p>Total</p>
            <p>
              <strong>{item.price * quantity}</strong>
            </p>
          </div>
        </div>
      </div>

      <hr />
      <div className={styles.grandTotal}>
        <p className={styles.grandTotalText}>Grand Total</p>
        <p className={styles.totalCalc}>
          <strong>IDR {item.price * quantity}</strong>
        </p>
      </div>
      <Button
        className={styles.submitBtn}
        color={Color.Primary}
        onClick={() => onCheckout({ ...item, quantity: quantity })}
        rect>
        Checkout
      </Button>
    </div>
  )
}
