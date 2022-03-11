import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TextField } from './TextField'

export default {
  title: 'Components/Elements/TextField',
  component: TextField,
  argTypes: {
    errors: {
      description:
        'Errors object from [useFormState](https://react-hook-form.com/api/useformstate)'
    },
    register: {
      description:
        'Used with [React Hook Form](https://react-hook-form.com/), see [here](https://react-hook-form.com/api/useform/register/) for register documentation'
    }
  }
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = (args) => (
  <TextField {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  type: 'text',
  label: 'Label',
  placeholder: 'placeholder'
}
