import styles from './Catalog.module.scss'
import { Button } from '@/elements/Button/Button'
import { CardImage } from '../CardImage/CardImage'
import { Card } from '../Card/Card'
import { CardContent } from '../CardContent/CardContent'
import { Color, ShoppingItem } from '@/types/elements'
import { formatMoney } from '@/utils/utils'

const ITEM_LIST: ShoppingItem[] = [
  {
    id: '1',
    name: 'Glitter Silver High Heels',
    image: 'glitter-silver-high-heels.png',
    price: 760000,
    quantity: 1
  },
  {
    id: '2',
    name: 'Polka-dot Vintage Dress Red',
    image: 'polka-dot-vintage-dress-red.png',
    price: 360000,
    quantity: 1
  },
  {
    id: '3',
    name: 'Football Soccer Ball - Size 5',
    image: 'football-soccer-ball.png',
    price: 280000,
    quantity: 1
  },
  {
    id: '4',
    name: '2pcs Badminton Rackets',
    image: '2pc-badminton-rackets.png',
    price: 320000,
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
            objectFit="contain"
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
      ))}
    </div>
  )
}
