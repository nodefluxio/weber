import { Button } from '@/elements/Button/Button'
import { CardImage } from '../CardImage/CardImage'
import { Card } from '../Card/Card'
import { CardContent } from '../CardContent/CardContent'
import { Color, ShoppingItem } from '@/types/elements'
import { formatMoney } from '@/utils/utils'
import { useEffect, useState } from 'react'
import { checkAccount } from '@/api/paymentAPI'
import Image from 'next/image'

const ITEM_LIST: ShoppingItem[] = [
  {
    id: '1',
    name: 'Hair Clips',
    image: 'hair-clips.png',
    price: 5000,
    quantity: 1
  },
  {
    id: '2',
    name: 'Polka-dot Vintage Dress',
    image: 'polka-dot-vintage-dress.png',
    price: 120000,
    quantity: 1
  },
  {
    id: '3',
    name: 'Soccer Ball',
    image: 'soccer-ball.png',
    price: 30000,
    quantity: 1
  },
  {
    id: '4',
    name: 'Black Hoodie',
    image: 'black-hoodie.png',
    price: 95000,
    quantity: 1
  }
]
type Props = {
  onAddToCart: (item: ShoppingItem) => void
  sessionId: string
}
export const Catalog = ({ onAddToCart, sessionId }: Props) => {
  const [balance, setBalance] = useState<number>()
  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const res = await checkAccount(sessionId)
        const accountData = res?.data
        setBalance(accountData?.balance)
      } catch (e) {
        console.error(e)
      }
    }
    getAccountInfo()
  }, [])
  return (
    <div className="flex flex-col w-[90%] sm:w-[80%]">
      <div
        className="flex self-end bg-primary-500 p-4 mb-8
                      rounded-lg text-neutral-100 sm:mr-3">
        <Image
          src="/assets/icons/balance-icon.svg"
          width={20}
          height={20}
          alt="balance-icon"
        />
        <p className="ml-4">Rp. {balance ? formatMoney(balance) : 0}</p>
      </div>
      <div className="flex flex-wrap m-auto">
        {ITEM_LIST.map((item) => (
          <div key={item.id} className="flex-[1_0_40%]">
            <Card className="w-[95%] mb-[5%]">
              <CardImage
                className="relative w-[100px] h-[100px]
                           mx-auto my-8 sm:w-[200px] sm:h-[200px]"
                img={`/assets/images/solutions/face-payment/${item.image}`}
                layout="fill"
                objectFit="contain"
                alt={item.name}
              />
              <CardContent className="p-4 sm:p-8 text-neutral-100">
                <h3 className="h-[48px] mb-4">{item.name}</h3>
                <div
                  className="flex flex-col items-start justify-between
                                sm:flex-row sm:items-center">
                  <p className="mt-4 block font-extrabold">
                    IDR {formatMoney(item.price)}
                  </p>
                  <Button
                    className="mt-4 self-center text-sm md:self-center md:mt-0"
                    color={Color.Secondary}
                    onClick={() => onAddToCart(item)}
                    rect>
                    Add to cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
