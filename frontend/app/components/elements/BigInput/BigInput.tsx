import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Label } from '../Label/Label'
import styles from './BigInput.module.scss'

type Props = {
  id: string
  type: string
  label: string
  onChange: Dispatch<SetStateAction<string>>
}

export const BigInput = ({ id, type, label, onChange }: Props) => {
  const [text, setText] = useState('')

  useEffect(() => {
    onChange(text)
  }, [text, onChange])

  return (
    <div className={styles.bigInput}>
      <div className={styles.labelContainer}>
        <Label id={id} label={label} />
      </div>
      <input
        type={type}
        id={id}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </div>
  )
}
