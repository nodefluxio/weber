import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { googlecode } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Image from 'next/image'

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
    <div className="relative h-[inherit]">
      <button
        className="bg-black/30 text-white outline-none rounded top-4 
        right-8 z-10 h-9 cursor-pointer p-2 absolute transition block hover:bg-black/60"
        onClick={() => copyCode()}>
        <Image
          src="/assets/icons/copy.svg"
          width={20}
          height={20}
          alt="copy button"
        />
      </button>
      {isMessage && (
        <div
          className="bg-black/30 text-white outline-none rounded top-4 
         z-10 h-9 cursor-pointer p-2 absolute transition block hover:bg-black/60
         right-20 font-serif">
          Copied!
        </div>
      )}
      <div className="relative overflow-y-auto h-[inherit]">
        <SyntaxHighlighter language={lang} style={googlecode}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
