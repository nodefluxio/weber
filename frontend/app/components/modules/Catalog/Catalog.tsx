import styles from './Catalog.module.scss'
import { Button } from '@/elements/Button/Button'
import { CardImage } from '../CardImage/CardImage'
import { Card } from '../Card/Card'
import { CardContent } from '../CardContent/CardContent'
import { Color, ShoppingItem } from '@/types/elements'

const ITEM_LIST: ShoppingItem[] = [
  {
    id: '1',
    name: 'Teh botol sosro',
    image: 'teh-botol.png',
    price: 45000,
    quantity: 1
  },
  {
    id: '2',
    name: 'Teh botol sosro',
    image: 'teh-botol.png',
    price: 45000,
    quantity: 1
  },
  {
    id: '3',
    name: 'Teh botol sosro',
    image: 'teh-botol.png',
    price: 45000,
    quantity: 1
  },
  {
    id: '4',
    name: 'Teh botol sosro',
    image: 'teh-botol.png',
    price: 45000,
    quantity: 1
  }
]
type Props = {
  onAddToCart: (item: ShoppingItem) => void
}
export const Catalog = ({ onAddToCart }: Props) => {
  return (
    <div className={styles.catalog}>
      {ITEM_LIST.map((item) => (
        <Card key={item.id} className={styles.card} color={Color.Secondary}>
          <CardImage
            className={styles.cardImage}
            img={`/assets/images/solutions/face-payment/${item.image}`}
            layout="fill"
          />
          <CardContent className={styles.cardContent}>
            <h3>{item.name}</h3>
            <div className={styles.row}>
              <p>{`Rp${item.price}`}</p>
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
      ))}
    </div>
  )
}
