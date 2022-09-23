import { render } from '@redwoodjs/testing/web'

import DatacrateContentResourceTable from './DatacrateContentResourceTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateContentResourceTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateContentResourceTable />)
    }).not.toThrow()
  })
})
