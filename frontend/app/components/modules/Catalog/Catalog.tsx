import styles from './Catalog.module.scss'
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
    <div className={styles.catalogContainer}>
      <div className={styles.balance}>
        <Image
          src="/assets/icons/balance-icon.svg"
          width={20}
          height={20}
          alt="balance-icon"
        />
        <p>Rp. {balance ? formatMoney(balance) : 0}</p>
      </div>
      <div className={styles.catalog}>
        {ITEM_LIST.map((item) => (
          <div key={item.id} className={styles.item}>
            <Card className={styles.card} color={Color.Secondary}>
              <CardImage
                className={styles.cardImage}
                img={`/assets/images/solutions/face-payment/${item.image}`}
                layout="fill"
                objectFit="contain"
                alt={item.name}
              />
              <CardContent className={styles.cardContent}>
                <h3>{item.name}</h3>
                <div className={styles.row}>
                  <p>IDR {formatMoney(item.price)}</p>
                  <Button
                    className={styles.btn}
                    color={Color.Primary}
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
