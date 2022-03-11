import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Tab } from './Tab'

export default {
  title: 'Components/Elements/Tab',
  component: Tab
} as ComponentMeta<typeof Tab>

const Template: ComponentStory<typeof Tab> = (args) => (
  <Tab {...args}>See Tabs documentation for how to use Tab</Tab>
)

export const Default = Template.bind({})
Default.args = {
  title: 'tab title'
}
