import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
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
    <div
      className="fixed top-0 right-0 left-0 bottom-0 
      w-full h-full flex justify-center items-center bg-black/50  z-50">
      <div className="bg-white w-[95%] py-8 px-4 relative rounded-2xl sm:w-[600px] overflow-y-auto max-h-[95vh] overflow-hidden">
        <div className="absolute text-2xl top-8 right-4 ">
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {children}
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
