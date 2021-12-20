import { Button } from '@/elements/Button/Button'
import { Color, ShoppingItem } from '@/types/elements'
import { formatMoney } from '@/utils/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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
    <div className="max-w-[400px] m-auto font-serif">
      <h2 className="px-4 font-sans font-bold text-2xl">Order Summary</h2>
      <hr />
      <div className="px-4 py-0">
        <Button onClick={onBack} className="-scale-x-100 text-2xl p-0 bg-none">
          ➜
        </Button>
      </div>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="relative w-[120px] h-[120px] mr-4">
            <Image
              src={`/assets/images/solutions/face-payment/${cart.image}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p>{cart.name}</p>
          <div className="flex flex-col items-end whitespace-nowrap ml-8">
            <p>{`x${cart.quantity}`}</p>
            <p>{`IDR ${formatMoney(cart.price)}`}</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p>Sub Total</p>
          <h4>{`IDR ${formatMoney(cart.quantity * cart.price)}`}</h4>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p>Shipping Fee</p>
          <h4>{`IDR ${formatMoney(SHIPPING_FEE)}`}</h4>
        </div>
      </div>
      <hr />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p>Payment Method</p>
          <h4>Face Payment</h4>
        </div>
        <div className="flex justify-between items-center mt-2 mb-6">
          <p>Total</p>
          <p className="text-xl">
            <strong>{`IDR ${formatMoney(totalPay)}`}</strong>
          </p>
        </div>
      </div>
      <Button
        onClick={() => onNext(totalPay)}
        className="block w-1/2 m-auto"
        color={Color.Primary}>
        Next
      </Button>
    </div>
  )
}
