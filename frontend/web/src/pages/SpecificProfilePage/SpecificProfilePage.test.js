import { render } from '@redwoodjs/testing/web'

import SpecificProfilePage from './SpecificProfilePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificProfilePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificProfilePage profile_id={'42'} />)
    }).not.toThrow()
  })
})
