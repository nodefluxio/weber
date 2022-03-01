import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { CodeSnippet } from './CodeSnippet'

export default {
  title: 'Components/Elements/CodeSnippet',
  component: CodeSnippet
} as ComponentMeta<typeof CodeSnippet>

const Template: ComponentStory<typeof CodeSnippet> = (args) => (
  <CodeSnippet {...args} />
)

const jsonCode = {
  squadName: 'Super hero squad',
  homeTown: 'Metro City',
  formed: 2016,
  secretBase: 'Super tower',
  active: true,
  members: [
    {
      name: 'Molecule Man',
      age: 29,
      secretIdentity: 'Dan Jukes',
      powers: ['Radiation resistance', 'Turning tiny', 'Radiation blast']
    }
  ]
}

export const Default = Template.bind({})
Default.args = {
  code: JSON.stringify(jsonCode, null, 3),
  lang: 'json'
}
