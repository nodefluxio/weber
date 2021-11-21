import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styles from './Modal.module.scss'
type Props = {
  show: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ show, onClose, children }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleCloseClick = (e: any) => {
    e.preventDefault()
    onClose()
  }

  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root')!
    )
  } else {
    return null
  }
}
