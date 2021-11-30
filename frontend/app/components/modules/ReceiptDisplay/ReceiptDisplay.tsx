import { useState } from 'react'
import { OCRReceiptData, ReceiptItem } from '@/types/elements'
import styles from './ReceiptDisplay.module.scss'
import { formatMoneyOnChange } from '@/utils/utils'
import { CodeSnippet } from '@/elements/CodeSnippet/CodeSnippet'

type Props = {
  result: OCRReceiptData
}
const additionalFields = [
  'total',
  'ppn',
  'diskon',
  'discount',
  'subtotal',
  'total diskon',
  'pajak',
  'tax'
]

export const ReceiptDisplay = ({ result }: Props) => {
  const [mode, setMode] = useState<'text' | 'json'>('text')
  const { ocr_receipt } = result

  const displayResult =
    result &&
    (mode === 'json' ? (
      <div className={styles.receiptInfoWrapper}>
        <CodeSnippet code={JSON.stringify(result, null, 3)} lang="json" />
      </div>
    ) : (
      <div
        className={`${styles.receiptInfoWrapper} ${styles.receiptTextFormat}`}>
        <div className={styles.receiptHeader}>
          Merchant Address: {ocr_receipt.address}
        </div>
        <div className={styles.receiptHeader}>
          Merchant Number: {ocr_receipt.number}
        </div>
        <div className={styles.receiptHeader}>Merchant Date: {ocr_receipt.date}</div>
        <table className={styles.receiptTable}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem 0' }}>Description</th>
              <th>qty</th>
              <th className={styles.totalCell}>Price</th>
              <th className={styles.totalCell}>Total</th>
            </tr>
          </thead>
          <tbody>
            {ocr_receipt.item.map((r: ReceiptItem, i: number) => (
              <tr key={i}>
                <td style={{ padding: '0.25rem 0' }}>{r.name}</td>
                <td>{r.qty}</td>
                <td className={styles.totalCell}>
                  {formatMoneyOnChange(r.price)}
                </td>
                <td className={styles.totalCell}>
                  {formatMoneyOnChange(r.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table style={{ float: 'right' }}>
          <tbody>
            {Object.keys(ocr_receipt).map(
              (k, i) =>
                additionalFields.includes(k.toLowerCase()) && (
                  <tr key={i}>
                    <td style={{ paddingRight: '1rem' }}>{k.toUpperCase()}</td>
                    <td style={{ textAlign: 'right' }}>{(ocr_receipt as any)[k]}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    ))
  return (
    <div className={styles.receiptDisplayWrapper}>
      <div className={styles.receiptButtonDiv}>
        <button
          type="button"
          onClick={() => setMode('text')}
          className={`${styles.buttonLeft} ${
            mode === 'text' && styles.buttonActive
          }`}>
          Text
        </button>
        <button
          type="button"
          onClick={() => setMode('json')}
          className={`${styles.buttonRight} ${
            mode === 'json' && styles.buttonActive
          }`}>
          JSON
        </button>
      </div>
      {displayResult}
    </div>
  )
}
