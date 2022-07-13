import ReactLoading from 'react-loading';
import './LoadingBlock.css';

const LoadingBlock = (action, size="normal") => {

  if(size == "small" || size == "S"){
    return (
      <div className="loader small">
        <h6>{action}</h6>
      </div>
    )
  } else{
    return (
      <div className="loader normal">
        <ReactLoading type="spinningBubbles" color="#116270" height={50} width={50} />
        <h2>{action}</h2>
      </div>
    )
  }


}

export default LoadingBlock
