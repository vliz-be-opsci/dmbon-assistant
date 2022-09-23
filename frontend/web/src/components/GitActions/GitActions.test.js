import { render } from '@redwoodjs/testing/web'

import GitActions from './GitActions'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('GitActions', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GitActions />)
    }).not.toThrow()
  })
})
