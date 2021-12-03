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
  }, [value])

  return (
    <div className={styles.modalPayment}>
      <h2>Set up your payment limit</h2>
      <span className={styles.value}>{value.toLocaleString()}</span>
      <p>
        You're required to enter a PIN if the total purchase of items exceeds your entered amount
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
        maxLength={7}
        onChange={handleInputChange}
        className={styles.inputNominal}
      />
    </div>
  )
}
