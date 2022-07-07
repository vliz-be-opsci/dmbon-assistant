import { render } from '@redwoodjs/testing/web'

import DatacrateGitStatus from './DatacrateGitStatus'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DatacrateGitStatus', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DatacrateGitStatus />)
    }).not.toThrow()
  })
})
