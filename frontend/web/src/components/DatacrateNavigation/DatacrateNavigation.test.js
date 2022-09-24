import { render } from '@redwoodjs/testing/web'

import DatacrateNavigation from './DatacrateNavigation'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateNavigation', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateNavigation />)
    }).not.toThrow()
  })
})
