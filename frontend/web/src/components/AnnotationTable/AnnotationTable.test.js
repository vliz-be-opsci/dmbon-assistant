import { render } from '@redwoodjs/testing/web'

import AnnotationTable from './AnnotationTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnnotationTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnnotationTable />)
    }).not.toThrow()
  })
})
