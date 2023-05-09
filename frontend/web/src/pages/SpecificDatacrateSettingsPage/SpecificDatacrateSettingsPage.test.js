import { render } from '@redwoodjs/testing/web'

import SpecificDatacrateSettingsPage from './SpecificDatacrateSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificDatacrateSettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificDatacrateSettingsPage datacrate_id={'42'} />)
    }).not.toThrow()
  })
})
