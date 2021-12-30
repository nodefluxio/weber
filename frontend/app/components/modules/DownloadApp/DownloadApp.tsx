import Link from 'next/link'
import Image from 'next/image'

interface DownloadProps {
  appStoreUrl: string
  googlePlayUrl: string
  onBadgeClick: () => void
}

export const DownloadApp: React.FC<DownloadProps> = ({
  appStoreUrl,
  googlePlayUrl,
  onBadgeClick
}) => {
  return (
    <div className="flex flex-col items-center w-[85%] m-auto py-2">
      <span
        className="text-lg sm:text-2xl font-extrabold
                  text-center text-primary-500 mt-4 sm:mt-0">
        Download Citizen App for free
      </span>
      <span className="font-serif text-lg mt-1 mb-5">For IOS and Android</span>
      <div className="flex flex-col sm:flex-row">
        <Link href={appStoreUrl}>
          <a target="_blank" onClick={() => onBadgeClick()}>
            <Image
              src="/assets/images/apple-app-store.svg"
              width={180}
              height={52}
            />
          </a>
        </Link>
        <div className="ml-0 mt-3 sm:mt-0 sm:ml-4">
          <Link href={googlePlayUrl}>
            <a target="_blank" onClick={() => onBadgeClick()}>
              <Image
                src="/assets/images/google-play-badge.svg"
                width={180}
                height={52}
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
