import { render } from '@redwoodjs/testing/web'

import DatacrateGitHistoryGraph from './DatacrateGitHistoryGraph'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateGitHistoryGraph', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateGitHistoryGraph />)
    }).not.toThrow()
  })
})
