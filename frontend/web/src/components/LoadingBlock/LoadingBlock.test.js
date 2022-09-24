import { render } from '@redwoodjs/testing/web'

import LoadingBlock from './LoadingBlock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LoadingBlock', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoadingBlock />)
    }).not.toThrow()
  })
})
