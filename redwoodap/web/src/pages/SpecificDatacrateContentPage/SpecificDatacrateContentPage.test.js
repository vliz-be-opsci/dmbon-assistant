import { render } from '@redwoodjs/testing/web'

import SpecificDatacrateContentPage from './SpecificDatacrateContentPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificDatacrateContentPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificDatacrateContentPage datacrate_id={'42'} />)
    }).not.toThrow()
  })
})
