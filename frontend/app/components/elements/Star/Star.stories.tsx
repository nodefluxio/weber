import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Star } from './Star'

export default {
  title: 'Components/Elements/Star',
  component: Star
} as ComponentMeta<typeof Star>

const Template: ComponentStory<typeof Star> = (args) => <Star {...args} />

export const Default = Template.bind({})
Default.args = {}
