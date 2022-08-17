import { render } from '@redwoodjs/testing/web'

import DatacrateContentResourceRow from './DatacrateContentResourceRow'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateContentResourceRow', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateContentResourceRow />)
    }).not.toThrow()
  })
})
