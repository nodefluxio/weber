import { BaseSyntheticEvent, useEffect, useState } from 'react'
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
    <div className="text-center px-6 py-2">
      <h2 className="text-lg font-bold mb-4">Set up your payment limit</h2>
      <span className="text-4xl font-extrabold text-primary-500">
        {value.toLocaleString()}
      </span>
      <p className="font-serif my-4">
        You&apos;re required to enter a PIN if the total purchase of items
        exceeds your entered amount
      </p>
      <div className="mb-6">
        <input
          type="range"
          min={MIN_PAYMENT}
          max={MAX_PAYMENT}
          step={STEP_PAYMENT}
          list="tickmarks"
          value={value}
          className="w-11/12 focus:outline-none"
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
        className="block mx-auto my-4 p-4 outline-none font-serif
                  border-[1px] border-gray-500 rounded-sm
                  focus:border-[1.5px] focus:border-primary-500"
      />
    </div>
  )
}
