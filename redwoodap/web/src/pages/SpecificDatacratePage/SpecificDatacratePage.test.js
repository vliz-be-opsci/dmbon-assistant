import { render } from '@redwoodjs/testing/web'

import SpecificDatacratePage from './SpecificDatacratePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SpecificDatacratePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SpecificDatacratePage datacrate_id={'42'} />)
    }).not.toThrow()
  })
})
