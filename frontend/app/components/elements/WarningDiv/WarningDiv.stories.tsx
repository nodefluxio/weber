import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { WarningDiv } from './WarningDiv'

export default {
  title: 'Components/Elements/WarningDiv',
  component: WarningDiv
} as ComponentMeta<typeof WarningDiv>

const Template: ComponentStory<typeof WarningDiv> = (args) => (
  <WarningDiv {...args} />
)

export const Default = Template.bind({})
Default.args = {
  message: 'warning message'
}
