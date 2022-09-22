import { render } from '@redwoodjs/testing/web'

import DatacrateGitOverview from './DatacrateGitOverview'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateGitOverview', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateGitOverview />)
    }).not.toThrow()
  })
})
