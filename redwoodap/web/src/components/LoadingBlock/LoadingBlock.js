import '../component.css'
import './LoadingBlock.css'
const LoadingBlock = (action) => {
  return (
    <div className="component loader">
      <h2>Loading {action}</h2>
    </div>
  )
}

export default LoadingBlock
