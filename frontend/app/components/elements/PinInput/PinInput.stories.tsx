import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PinInput } from './PinInput'

export default {
  title: 'Components/Elements/PinInput',
  component: PinInput
} as ComponentMeta<typeof PinInput>

const Template: ComponentStory<typeof PinInput> = (args) => (
  <PinInput {...args} />
)

export const Default = Template.bind({})
Default.args = {
  message: 'message',
  digits: 6
}
