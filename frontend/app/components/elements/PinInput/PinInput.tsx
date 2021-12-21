import {
  BaseSyntheticEvent,
  useState,
  useRef,
  KeyboardEvent,
  useEffect
} from 'react'

type Props = {
  message: string
  digits: number
  onPinChange: (arg: string) => void
}

export const PinInput = ({ message, digits, onPinChange }: Props) => {
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
    <div
      className="flex flex-col items-center justify-between
                  mx-2 sm:mx-auto my-8 px-3 sm:px-6 py-12 rounded-lg
                  shadow-[2px_4px_15px_rgba(0,0,0,0.2)]">
      {message && <span className="text-center font-serif">{message}</span>}
      <div className="flex flex-1 min-w-0 mt-4">
        {[...Array(digits)].map((_, i) => (
          <input
            key={i}
            value={pinCode[i]}
            ref={(el) => refs.current.push(el!)}
            type="password"
            maxLength={1}
            pattern="[0-9]*"
            className={`text-[150%] font-code w-9 h-9 sm:w-14 sm:h-14 outline-none
                      rounded text-center border-[1px] border-neutral-500
                      focus:border-[1.5px] focus:border-primary-500
                      ${i > 0 ? 'ml-2 sm:ml-3' : ''}`}
            onChange={(event) => handleChange(event, i)}
            onKeyDown={(event) => handleKeyDown(event, i)}
            inputMode="numeric"
          />
        ))}
      </div>
    </div>
  )
}
