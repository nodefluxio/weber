import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { BigInput } from './BigInput'

export default {
  title: 'Components/Elements/BigInput',
  component: BigInput
} as ComponentMeta<typeof BigInput>

const Template: ComponentStory<typeof BigInput> = (args) => (
  <BigInput {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  label: 'label'
}
