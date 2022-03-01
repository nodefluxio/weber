import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'
import { Color } from '@/types/elements'

export default {
  title: 'Components/Elements/ButtonLink',
  component: ButtonLink,
  argTypes: {
    color: {
      options: ['primary', 'secondary']
    }
  }
} as ComponentMeta<typeof ButtonLink>

const Template: ComponentStory<typeof ButtonLink> = (args) => (
  <ButtonLink {...args}>Button Link</ButtonLink>
)

export const Primary = Template.bind({})
Primary.args = {
  href: '/home',
  color: Color.Primary
}

export const Secondary = Template.bind({})
Secondary.args = {
  ...Primary.args,
  color: Color.Secondary
}

export const Rect = Template.bind({})
Rect.args = {
  ...Primary.args,
  rect: true
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...Primary.args,
  disabled: true
}
