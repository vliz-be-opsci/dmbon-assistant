import { render } from '@redwoodjs/testing/web'

import AxiosError from './AxiosError'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AxiosError', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AxiosError />)
    }).not.toThrow()
  })
})
