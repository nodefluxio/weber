export const formatMoney = (money: string | number) => {
  if (money === null) {
    return '0'
  }
  let number_string = money.toString(),
    remainder = number_string.length % 3,
    rupiah = number_string.substr(0, remainder),
    thousands = number_string.substr(remainder).match(/\d{3}/g)

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
  let number_string = money.replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    remainder = split[0].length % 3,
    rupiah = split[0].substr(0, remainder),
    thousands = split[0].substr(remainder).match(/\d{3}/gi)

  // tambahkan titik jika yang di input sudah menjadi angka thousands
  if (thousands) {
    const separator = remainder ? '.' : ''
    rupiah += separator + thousands.join('.')
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return rupiah
}
