import { render } from '@redwoodjs/testing/web'

import OverviewProfilesPage from './OverviewProfilesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OverviewProfilesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OverviewProfilesPage />)
    }).not.toThrow()
  })
})
