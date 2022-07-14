import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import '../component.css';
import './DatacrateContentFileRow.css';
import { getOpenFile, getOpenFileExplorer } from 'src/utils/AxiosRequestsHandlers';
import ProgressBarContent from '../ProgressBar/ProgressBar';

const DatacrateContentFileRow = (file_to_render, datacrate_uuid, info, setshow, setcontent) => {

  console.log(info);

  // function here that sets show to true and content to info and file_to_render
  const makeModal = () => {
    setshow(true);
    setcontent({"info":info, "file_name":file_to_render});
  }

  return (
    <div className="content_item">
      <div className="actions">
        <button onClick={() => getOpenFile(datacrate_uuid, file_to_render)}><VscVmRunning></VscVmRunning></button>
        <button onClick={() => makeModal()}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
      </div>
      <div className="file-content">
        <div className="file-name">{file_to_render}</div>
        <div className="file-storage">
          <ProgressBarContent content={info.summary} />
        </div>
      </div>
    </div>
  )


}

export default DatacrateContentFileRow
