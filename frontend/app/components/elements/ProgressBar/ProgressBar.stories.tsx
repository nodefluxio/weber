import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

export default {
  title: 'Components/Elements/ProgressBar',
  component: ProgressBar,
  argTypes: {
    completed: {
      description: 'Completion between 0 and 100'
    }
  }
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
)

export const Default = Template.bind({})
Default.args = {
  completed: 50
}
