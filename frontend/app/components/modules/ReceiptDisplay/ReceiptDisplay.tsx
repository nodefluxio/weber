import { useState } from 'react'
import { OCRReceiptData, ReceiptItem } from '@/types/elements'
import styles from './ReceiptDisplay.module.scss'
import { formatMoneyOnChange } from '@/utils/utils'

type Props = {
  result: OCRReceiptData
}
const fixedFields = ['address', 'info', 'item', 'number']

export const ReceiptDisplay = ({ result }: Props) => {
  const [mode, setMode] = useState<'text' | 'json'>('text')

  const displayResult =
    result &&
    (mode === 'json' ? (
      <div className={styles.receiptInfoWrapper}>
        <pre>
          <code className={styles.receiptJSON}>
            {JSON.stringify(result, null, 4)}
          </code>
        </pre>
      </div>
    ) : (
      <div className={styles.receiptInfoWrapper}>
        <div className={styles.receiptHeader}>
          Merchant Address: {result.address}
        </div>
        <div className={styles.receiptHeader}>
          Merchant Number: {result.number}
        </div>
        {result.info.map((s, i) => (
          <div style={{ fontSize: '0.9rem' }} key={i}>
            {s}
          </div>
        ))}
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
            {result.item.map((r: ReceiptItem, i: number) => (
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
          <tr>
            <td colSpan={2} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
              Additional Info
            </td>
          </tr>
          {Object.keys(result).map(
            (k, i) =>
              !fixedFields.includes(k) && (
                <tr key={i}>
                  <td style={{ paddingRight: '1rem' }}>{k}</td>
                  <td style={{ textAlign: 'right' }}>{(result as any)[k]}</td>
                </tr>
              )
          )}
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
