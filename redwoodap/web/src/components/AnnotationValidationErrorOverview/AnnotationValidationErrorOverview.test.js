import { render } from '@redwoodjs/testing/web'

import AnnotationValidationErrorOverview from './AnnotationValidationErrorOverview'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnnotationValidationErrorOverview', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnnotationValidationErrorOverview />)
    }).not.toThrow()
  })
})
