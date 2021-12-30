import React from 'react'
import { OCRReceiptData, ReceiptItem } from '@/types/elements'
import { formatMoneyOnChange } from '@/utils/utils'
import { CodeSnippet } from '@/elements/CodeSnippet/CodeSnippet'
import { Tabs } from '../Tabs/Tabs'
import { Tab } from '@/elements/Tab/Tab'

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
  const { ocr_receipt } = result

  return (
    <div className="relative">
      <Tabs>
        <Tab
          title="Text"
          className="h-[400px] overflow-y-auto py-4 px-2 font-serif border border-primary-500 rounded-b">
          <div className="mb-1 font-semibold">
            Merchant Address: {ocr_receipt.address}
          </div>
          <div className="mb-1 font-semibold">
            Merchant Number: {ocr_receipt.number}
          </div>
          <div className="mb-1 font-semibold">
            Merchant Date: {ocr_receipt.date}
          </div>
          <table className="text-left my-3 w-full border-t border-b border-gray-200">
            <thead>
              <tr>
                <th className="py-2">Description</th>
                <th>qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {ocr_receipt.item.map((r: ReceiptItem, i: number) => (
                <tr key={i}>
                  <td className="py-1">{r.name}</td>
                  <td>{r.qty}</td>
                  <td className="text-right">{formatMoneyOnChange(r.price)}</td>
                  <td className="text-right">{formatMoneyOnChange(r.total)}</td>
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
                      <td className="pr-4">{k.toUpperCase()}</td>
                      <td className="text-right">{(ocr_receipt as any)[k]}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </Tab>
        <Tab
          title="JSON"
          className="h-[400px] border border-primary-500 rounded-b">
          <CodeSnippet code={JSON.stringify(result, null, 3)} lang="json" />
        </Tab>
      </Tabs>
    </div>
  )
}
