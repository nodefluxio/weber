import { useState } from 'react'
import { OCRReceiptData, ReceiptItem } from '@/types/elements'

type Props = {
  result: OCRReceiptData | undefined
}

export const ReceiptDisplay = ({ result }: Props) => {
  const [mode, setMode] = useState<'text' | 'json'>('text')
  const displayResult =
    result &&
    (mode === 'json' ? (
      <pre>{JSON.stringify(result, null, 4)}</pre>
    ) : (
      <table style={{ textAlign: 'left', width: '100%' }}>
        <thead>
          <th>Description</th>
          <th>qty</th>
          <th>Price</th>
          <th>Total</th>
        </thead>
        <tbody>
          {result.item.map((r: ReceiptItem, i: number) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.qty}</td>
              <td>{r.price}</td>
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ))
  return (
    <div>
      <div>
        <button onClick={() => setMode('text')}>Text</button>
        <button onClick={() => setMode('json')}>JSON</button>
      </div>
      {displayResult}
    </div>
  )
}
