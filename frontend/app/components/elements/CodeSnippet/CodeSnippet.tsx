import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { googlecode } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Image from 'next/image'
import styles from './CodeSnippet.module.scss'

type Props = {
  code: string
  lang: string
}

export const CodeSnippet = ({ code, lang }: Props) => {
  const [isMessage, setIsMessage] = useState(false)
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setIsMessage(true)
    setTimeout(() => {
      setIsMessage(false)
    }, 600)
  }

  return (
    <div className={styles.wholeSnippetContainer}>
      <button className={styles.receiptButtonCopy} onClick={() => copyCode()}>
        <Image src="/assets/icons/copy.svg" width={20} height={20} />
      </button>
      {isMessage && (
        <div className={`${styles.receiptButtonCopy} ${styles.copyMessage}`}>
          Copied!
        </div>
      )}
      <div className={styles.codeSnippetContainer}>
        <SyntaxHighlighter language={lang} style={googlecode}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
