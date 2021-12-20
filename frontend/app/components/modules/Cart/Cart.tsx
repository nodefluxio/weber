import { Button } from '@/elements/Button/Button'
import Image from 'next/image'
import { Color, ShoppingItem } from '@/types/elements'
import { useEffect, useState } from 'react'
import { formatMoney } from '@/utils/utils'

type Props = {
  item: ShoppingItem
  onBack?: () => void
  onCheckout: (item: ShoppingItem) => void
}
export const Cart = ({ item, onBack, onCheckout }: Props) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [total, setTotal] = useState(formatMoney(item.price * item.quantity))

  useEffect(() => {
    const formatedTotal = formatMoney(item.price * quantity)
    setTotal(formatedTotal)
  }, [quantity])

  return (
    <div className="max-w-[400px] m-auto font-serif">
      <h2 className="px-4 font-sans font-bold text-2xl">Cart</h2>
      <hr />
      <Button
        className="p-0 text-2xl -scale-x-100 bg-none"
        onClick={onBack}>
        ➜
      </Button>

      <div className="flex justify-center">
        <div
          className="relative w-[150px] h-[100px] sm:w-[200px] sm:h-[200px]
                    self-center mr-4">
          <Image
            src={`/assets/images/solutions/face-payment/${item.image}`}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col items-center mr-4 min-w-[150px]">
          <h4 className="font-bold text-center">{item.name}</h4>
          <p className="mb-6">IDR {formatMoney(item.price)}</p>
          <p>Quantity</p>
          <div className="flex items-center mt-3 mb-6 text-xl">
            <span
              className="cursor-pointer"
              onClick={() =>
                quantity > 1 ? setQuantity(quantity - 1) : setQuantity(1)
              }>
              {'\u02C2'}
            </span>
            <p className="inline-block text-center text-2xl mx-5 w-[30px]">
              {quantity}
            </p>
            <span
              className="cursor-pointer"
              onClick={() =>
                quantity < 99 ? setQuantity(quantity + 1) : setQuantity(99)
              }>
              {'\u02C3'}
            </span>
          </div>
          <div>
            <p>Total</p>
            <p>
              <strong>IDR {total}</strong>
            </p>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div
        className="flex justify-between items-center
                      px-5 py-0 mr-4 my-8">
        <p>Grand Total</p>
        <p className="text-xl">
          <strong>IDR {total}</strong>
        </p>
      </div>
      <Button
        className="block w-1/2 m-auto"
        color={Color.Primary}
        onClick={() => onCheckout({ ...item, quantity: quantity })}>
        Checkout
      </Button>
    </div>
  )
}
