import { render } from '@redwoodjs/testing/web'

import SpecificDatacrateGitPage from './SpecificDatacrateGitPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificDatacrateGitPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificDatacrateGitPage datacrate_id={'42'} />)
    }).not.toThrow()
  })
})
