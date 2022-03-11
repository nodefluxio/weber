import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SelectBox } from './SelectBox'

export default {
  title: 'Components/Elements/SelectBox',
  component: SelectBox,
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
} as ComponentMeta<typeof SelectBox>

const Template: ComponentStory<typeof SelectBox> = (args) => (
  <SelectBox {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  label: 'This is a label',
  options: [
    { value: 'val1', name: 'option1' },
    { value: 'val2', name: 'option2' },
    { value: 'val3', name: 'option3' }
  ]
}
