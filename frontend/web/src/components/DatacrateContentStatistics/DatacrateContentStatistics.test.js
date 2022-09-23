import { render } from '@redwoodjs/testing/web'

import DatacrateContentStatistics from './DatacrateContentStatistics'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateContentStatistics', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateContentStatistics />)
    }).not.toThrow()
  })
})
