import { render } from '@redwoodjs/testing/web'

import MakeProfilePage from './MakeProfilePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MakeProfilePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MakeProfilePage />)
    }).not.toThrow()
  })
})
