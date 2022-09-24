import { render } from '@redwoodjs/testing/web'

import Taskbox from './Taskbox'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Taskbox', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Taskbox 
        Task={{
          type: 'success',
          name: 'Task 1',
          description: 'This is a task'
        }}
      />)
    })
    expect(document.querySelector('h2')).toBeInTheDocument()
    expect(document.querySelector('p')).toBeInTheDocument()
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('This is a task')).toBeInTheDocument()
  })
})
