import { useCallback } from 'react'

type Props = {
  title: string
  index: number
  selectedTab: number
  setSelectedTab: (index: number) => void
  className?: string
}

export const TabTitle = ({
  title,
  selectedTab,
  setSelectedTab,
  index,
  className
}: Props) => {
  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <li className={`w-full ${className}`}>
      <button
        className={`w-full py-2 px-8 cursor-pointer border border-primary-500
         border-b-0 transition font-semibold focus:outline-none 
        hover:bg-primary-500 hover:text-white 
         ${
           selectedTab === index
             ? 'bg-primary-500 text-white'
             : 'bg-white text-primary-500'
         }`}
        onClick={onClick}>
        {title}
      </button>
    </li>
  )
}
