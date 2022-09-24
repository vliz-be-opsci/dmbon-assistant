import { render } from '@redwoodjs/testing/web'

import OverviewDatacratesPage from './OverviewDatacratesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OverviewDatacratesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OverviewDatacratesPage />)
    }).not.toThrow()
  })
})
