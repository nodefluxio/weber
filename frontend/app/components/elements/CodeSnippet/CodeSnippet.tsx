import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { googlecode } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import styles from './CodeSnippet.module.scss'

type Props = {
  code: string
  lang: string
}

export const CodeSnippet = ({ code, lang }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMessage, setIsMessage] = useState(false)
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setIsMessage(true)
    setTimeout(() => {
      setIsMessage(false)
    }, 700)
  }

  return (
    <div
      className={styles.codeSnippetContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isHovered && (
        <button className={styles.receiptButtonCopy} onClick={() => copyCode()}>
          {isMessage ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      )}
      <SyntaxHighlighter language={lang} style={googlecode}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
