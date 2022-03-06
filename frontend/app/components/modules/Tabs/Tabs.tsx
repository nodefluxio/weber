import React, { ReactElement, useState } from 'react'
import { TabTitle } from '@/elements/TabTitle/TabTitle'
import styles from './Tabs.module.css'

type Props = {
  children: ReactElement[]
}

export const Tabs = ({ children }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className="flex flex-col">
      <ul className={`${styles.tabs} rounded-2xl flex justify-center`}>
        {children.map((item, index) => (
          <TabTitle
            key={index}
            title={item.props.title}
            index={index}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </ul>
      {children[selectedTab]}
    </div>
  )
}
