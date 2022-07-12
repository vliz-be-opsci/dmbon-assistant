import ReactLoading from 'react-loading';
import '../component.css';
import './LoadingBlock.css';

const LoadingBlock = (action) => {
  return (
    <div className="component loader">
      <ReactLoading type="spinningBubbles" color="#116270" height={50} width={50} />
      <h2>Loading {action}</h2>
    </div>
  )
}

export default LoadingBlock
