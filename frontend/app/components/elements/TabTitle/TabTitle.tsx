import { useCallback } from 'react'
import styles from './TabTitle.module.scss'

type Props = {
  title: string
  index: number
  selectedTab: number
  setSelectedTab: (index: number) => void
}

export const TabTitle = ({
  title,
  selectedTab,
  setSelectedTab,
  index
}: Props) => {
  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <li className={styles.tabTitle}>
      <button
        className={selectedTab === index ? styles.active : ''}
        onClick={onClick}>
        {title}
      </button>
    </li>
  )
}
