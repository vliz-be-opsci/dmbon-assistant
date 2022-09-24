import { render } from '@redwoodjs/testing/web'

import SpecificSpacePage from './SpecificSpacePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificSpacePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificSpacePage space_id={'42'} />)
    }).not.toThrow()
  })
})
