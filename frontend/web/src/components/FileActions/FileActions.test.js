import { render } from '@redwoodjs/testing/web'

import FileActions from './Uploadsection'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Uploadsection', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FileActions />)
    }).not.toThrow()
  })
})
