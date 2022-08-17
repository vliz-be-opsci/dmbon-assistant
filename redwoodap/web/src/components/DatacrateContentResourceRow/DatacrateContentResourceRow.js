import {MdScreenSearchDesktop} from 'react-icons/md';
import '../component.css';
import './DatacrateContentResourceRow.css';
import ProgressPie from '../ProgressPie/ProgressPie';


const DatacrateContentResourceRow = (file_to_render, datacrate_uuid, info, setshow, setcontent, setdatacrateContent) => {
  // function here that sets show to true and content to info and file_to_render
  const makeModal = () => {
    setdatacrateContent({});
    setshow(true);
    setcontent({"info":info, "file_name":file_to_render});
  }

  return (
    <div className="content_item">
      <div className="actions">
        <button onClick={() => makeModal()}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
      </div>
      <div className="file-storage">
        <ProgressPie content={info.summary} />
      </div>
      <div className="file-content">
        <div className="file-name"><a href={file_to_render}>{file_to_render}</a></div>
      </div>

    </div>
  )
}

export default DatacrateContentResourceRow
