import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Label } from './Label'

export default {
  title: 'Components/Elements/Label',
  component: Label,
  argTypes: {
    errors: {
      description:
        'Errors object from [useFormState](https://react-hook-form.com/api/useformstate)'
    }
  }
} as ComponentMeta<typeof Label>

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  label: 'This is a label'
}
export const WithError = Template.bind({})

WithError.args = {
  ...Default.args,
  errors: { id: { message: 'this is an error message' } }
}
