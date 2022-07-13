import { render } from '@redwoodjs/testing/web'

import DatacrateContentFileRow from './DatacrateContentFileRow'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateContentFileRow', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateContentFileRow />)
    }).not.toThrow()
  })
})
