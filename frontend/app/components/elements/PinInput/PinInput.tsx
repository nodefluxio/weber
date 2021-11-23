import {
  BaseSyntheticEvent,
  useState,
  useRef,
  KeyboardEvent,
  useEffect
} from 'react'
import styles from './PinInput.module.scss'

type Props = {
  message: string
  digits: number
  onPinChange: (arg: string) => void
}

export const PinInput = ({
  message,
  digits,
  onPinChange
}: Props) => {
  const [pinCode, setPinCode] = useState(
    Array.from({ length: digits }, () => '')
  )

  useEffect(() => {
    onPinChange(pinCode.join(''))
  }, [pinCode])

  const refs = useRef<HTMLInputElement[]>([])

  const handleChange = (event: BaseSyntheticEvent, i: number) => {
    if (/\d/.test(event.target.value)) {
      setPinCode([
        ...pinCode.slice(0, i),
        event.target.value,
        ...pinCode.slice(i + 1, digits)
      ])
      if (refs.current[i] !== null && i < digits - 1) {
        refs.current[i + 1].focus()
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (event.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1].focus()
    } else if (event.key === 'ArrowRight' && i < digits - 1) {
      refs.current[i + 1].focus()
    } else if (event.key === 'Backspace') {
      if (pinCode[i] === '') {
        setPinCode([
          ...pinCode.slice(0, i - 1),
          '',
          ...pinCode.slice(i, digits)
        ])
      } else {
        setPinCode([
          ...pinCode.slice(0, i),
          '',
          ...pinCode.slice(i + 1, digits)
        ])
      }
      if (i > 0) refs.current[i - 1].focus()
    } else if (event.key <= '0' && event.key >= '9') {
      setPinCode([...pinCode.slice(0, i), '', ...pinCode.slice(i + 1, digits)])
    }
  }

  return (
    <div className={styles.pinInputWrapper}>
      {message && <span>{message}</span>}
      <div className={styles.grid}>
        {[...Array(digits)].map((_, i) => (
          <input
            key={i}
            value={pinCode[i]}
            ref={(el) => refs.current.push(el!)}
            type="password"
            maxLength={1}
            pattern="[0-9]"
            className={styles.pinInput}
            onChange={(event) => handleChange(event, i)}
            onKeyDown={(event) => handleKeyDown(event, i)}
          />
        ))}
      </div>
    </div>
  )
}
