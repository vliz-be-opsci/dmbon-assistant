import { render } from '@redwoodjs/testing/web'

import Taskbox from './Taskbox'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Taskbox', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Taskbox />)
    }).not.toThrow()
  })
})
