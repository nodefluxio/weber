import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Spinner } from './Spinner'

export default {
  title: 'Components/Elements/Spinner',
  component: Spinner,
  argTypes: {
    completed: {
      description: 'Completion between 0 and 100'
    }
  }
} as ComponentMeta<typeof Spinner>

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
Default.args = {}
