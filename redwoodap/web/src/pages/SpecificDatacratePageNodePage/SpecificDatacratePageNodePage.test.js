import { render } from '@redwoodjs/testing/web'

import SpecificDatacratePageNodePage from './SpecificDatacratePageNodePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificDatacratePageNodePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificDatacratePageNodePage datacrate_id={'42'} />)
    }).not.toThrow()
  })
})
