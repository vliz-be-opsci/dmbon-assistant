import { render } from '@redwoodjs/testing/web'

import AnnotationValidationErrorRow from './AnnotationValidationErrorRow'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnnotationValidationErrorRow', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnnotationValidationErrorRow />)
    }).not.toThrow()
  })
})
