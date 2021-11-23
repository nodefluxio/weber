import { useState } from 'react'
import { Color, OCRReceiptData, ReceiptItem } from '@/types/elements'
import { Button } from '@/elements/Button/Button'
import styles from './ReceiptDisplay.module.scss'

type Props = {
  result: OCRReceiptData | undefined
}

export const ReceiptDisplay = ({ result }: Props) => {
  const [mode, setMode] = useState<'text' | 'json'>('text')
  const displayResult =
    result &&
    (mode === 'json' ? (
      <div className={styles.receiptInfoWrapper}>
        <pre className={styles.receiptJSON}>
          {JSON.stringify(result, null, 4)}
        </pre>
      </div>
    ) : (
      <div className={styles.receiptInfoWrapper}>
        <table className={styles.receiptTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th>qty</th>
              <th>Price</th>
              <th className={styles.totalCell}>Total</th>
            </tr>
          </thead>
          <tbody>
            {result.item.map((r: ReceiptItem, i: number) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.qty}</td>
                <td>{r.price}</td>
                <td className={styles.totalCell}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  return (
    <div className={styles.receiptDisplayWrapper}>
      <div className={styles.receiptButtonDiv}>
        <Button
          type="button"
          color={Color.Primary}
          onClick={() => setMode('text')}>
          Text
        </Button>
        <Button
          type="button"
          color={Color.Primary}
          onClick={() => setMode('json')}>
          JSON
        </Button>
      </div>
      {displayResult}
    </div>
  )
}
