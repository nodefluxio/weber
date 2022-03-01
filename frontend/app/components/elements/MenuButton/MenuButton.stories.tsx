import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MenuButton } from './MenuButton'

export default {
  title: 'Components/Elements/MenuButton',
  component: MenuButton
} as ComponentMeta<typeof MenuButton>

const Template: ComponentStory<typeof MenuButton> = (args) => (
  <MenuButton {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Menu Button'
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...Default.args,
  disabled: true
}
