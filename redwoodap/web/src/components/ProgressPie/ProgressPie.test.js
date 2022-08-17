import { render } from '@redwoodjs/testing/web'

import ProgressPie from './ProgressPie'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProgressPie', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProgressPie />)
    }).not.toThrow()
  })
})
