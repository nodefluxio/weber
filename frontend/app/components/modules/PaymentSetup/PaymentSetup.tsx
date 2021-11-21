import { BaseSyntheticEvent, useEffect, useState } from 'react'
import styles from './PaymentSetup.module.scss'
import {
  MIN_PAYMENT,
  MAX_PAYMENT,
  TICK_INTERVAL,
  STEP_PAYMENT
} from 'app/constants/amounts'

type Props = {
  onChange: (arg: number) => void
}

export const PaymentSetup = ({ onChange }: Props) => {
  const [value, setValue] = useState(MIN_PAYMENT) // value in float
  const [fieldInput, setFieldInput] = useState('') // value displayed in text field

  const ticks = Array.from(
    { length: Math.floor((MAX_PAYMENT - MIN_PAYMENT) / TICK_INTERVAL) + 1 },
    (_, i: number) => TICK_INTERVAL * (i + 1)
  )

  const handleInputChange = (e: BaseSyntheticEvent) => {
    const typed = e.target.value
    if (typed === '') {
      setValue(0)
      setFieldInput('')
    } else if (/^[0-9\b]+$/.test(typed)) {
      setValue(+typed)
      setFieldInput(typed)
    }
  }

  const handleSlideChange = (e: BaseSyntheticEvent) => {
    setValue(+e.target.value)
    setFieldInput((+e.target.value).toString())
  }

  useEffect(() => {
    onChange(value)
  }, [value, onChange])

  return (
    <div className={styles.modalPayment}>
      <h2>Set up your minimum payment</h2>
      <span className={styles.value}>{value.toLocaleString()}</span>
      <p>
        If the payment exceeds the minimum payment, you are required to input
        pin
      </p>
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min={MIN_PAYMENT}
          max={MAX_PAYMENT}
          step={STEP_PAYMENT}
          list="tickmarks"
          value={value}
          className={styles.slider}
          onChange={handleSlideChange}
        />
        <datalist id="tickmarks">
          {ticks.map((v: number, i: number) => (
            <option value={v} key={i} />
          ))}
        </datalist>
      </div>
      <span>You could type your nominal below</span>
      <input
        type="text"
        value={fieldInput}
        placeholder={'Enter nominal'}
        maxLength={6}
        onChange={handleInputChange}
        className={styles.inputNominal}
      />
    </div>
  )
}
