import { render } from '@redwoodjs/testing/web'

import DatacrateContentFileTable from './DatacrateContentFileTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateContentFileTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateContentFileTable />)
    }).not.toThrow()
  })
})
