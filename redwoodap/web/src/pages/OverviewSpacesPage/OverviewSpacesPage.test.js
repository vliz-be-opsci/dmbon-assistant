import { render } from '@redwoodjs/testing/web'

import OverviewSpacesPage from './OverviewSpacesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OverviewSpacesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OverviewSpacesPage />)
    }).not.toThrow()
  })
})
