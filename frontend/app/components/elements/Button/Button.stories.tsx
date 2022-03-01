import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'

export default {
  title: 'Components/Elements/Button',
  component: Button,
  argTypes: {
    color: {
      options: ['primary', 'secondary']
    }
  }
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Button</Button>
)

export const Primary = Template.bind({})
Primary.args = {
  color: Color.Primary
}

export const Secondary = Template.bind({})
Secondary.args = {
  color: Color.Secondary
}

export const Rect = Template.bind({})
Rect.args = {
  color: Color.Primary,
  rect: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  color: Color.Primary,
  disabled: true
}
