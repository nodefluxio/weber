import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '../Button/Button'

export default {
  title: 'Components/Elements/Modal',
  component: Modal,
  parameters: {
    docs: {
      page: null,
      inlineStories: false
    }
  }
} as ComponentMeta<typeof Modal>

export const Default: ComponentStory<typeof Modal> = (args) => {
  const [show, setShow] = useState(false)
  return (
    <div id="modal-root">
      <Button onClick={() => setShow(true)}>Show Modal</Button>
      <Modal {...args} show={show} onClose={() => setShow(false)}>
        <div>
          <h1>This is modal content</h1>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            aspernatur quod quo, reiciendis, est maiores iste rerum nesciunt
            neque optio ex esse voluptates, amet eos doloremque nisi magnam
            delectus ratione!
          </p>
        </div>
      </Modal>
    </div>
  )
}
