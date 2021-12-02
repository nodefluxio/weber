import { OCRReceiptData } from '@/types/elements'

export const formatMoney = (money: string | number) => {
  if (money === null) {
    return '0'
  }
  const number_string = money.toString(),
    remainder = number_string.length % 3,
    thousands = number_string.substr(remainder).match(/\d{3}/g)
  let rupiah = number_string.substr(0, remainder)

  if (thousands) {
    const separator = remainder ? '.' : ''
    rupiah += separator + thousands.join('.')
  }
  if (money < 0) {
    return `-${rupiah}`
  }
  return rupiah
}

export const formatMoneyOnChange = (money: string | number) => {
  money = money.toString()
  const number_string = money.replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    remainder = split[0].length % 3,
    thousands = split[0].substr(remainder).match(/\d{3}/gi)

  let rupiah = split[0].substr(0, remainder)

  // tambahkan titik jika yang di input sudah menjadi angka thousands
  if (thousands) {
    const separator = remainder ? '.' : ''
    rupiah += separator + thousands.join('.')
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return rupiah
}

export const isOCRReceipt = (obj: any): obj is OCRReceiptData => {
  if (typeof obj === 'undefined') {
    return false
  } else if ('ocr_receipt' in obj) {
    const { ocr_receipt } = obj
    let infoIsStringArray = true

    if (ocr_receipt.info && Array.isArray(ocr_receipt.info)) {
      for (let i = 0; i < ocr_receipt.info.length; i++) {
        infoIsStringArray = typeof ocr_receipt.info[i] === 'string'
        if (!infoIsStringArray) break
      }
    } else {
      infoIsStringArray = false
    }

    return (
      obj &&
      'address' in ocr_receipt &&
      'number' in ocr_receipt &&
      'date' in ocr_receipt &&
      'item' in ocr_receipt &&
      infoIsStringArray
    )
  } else {
    return false
  }
}

export const getKeyValue = (key: string) => (obj: Record<string, any>) =>
  obj[key]
