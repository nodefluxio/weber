import Image from 'next/image'

type Props = {
  message: string
  className?: string
}

export const WarningDiv = ({ message, className }: Props) => {
  return (
    <div className={className}>
      <div
        className={`text-yellow-700 flex flex-col sm:flex-row items-center justify-center py-3 px-3 ${
          message && 'bg-yellow-200 border-yellow-700 border rounded'
        }`}>
        {message && (
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={'/assets/icons/error-icon.svg'}
              width={32}
              height={32}
              alt="alert symbol"
            />
          </div>
        )}
        <span className="mt-3 sm:mt-0 sm:ml-3 text-sm">{message}</span>
      </div>
    </div>
  )
}
