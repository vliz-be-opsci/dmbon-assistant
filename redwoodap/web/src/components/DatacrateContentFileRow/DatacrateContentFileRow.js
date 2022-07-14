import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import '../component.css';
import './DatacrateContentFileRow.css';
import { getOpenFile, getOpenFileExplorer } from 'src/utils/AxiosRequestsHandlers';
import ProgressBarContent from '../ProgressBar/ProgressBar';

const DatacrateContentFileRow = (file_to_render, datacrate_uuid, info) => {

  console.log(info);

  return (
    <div className="content_item">
      <div className="actions">
        <button onClick={() => getOpenFile(datacrate_uuid, file_to_render)}><VscVmRunning></VscVmRunning></button>
        <button onClick={() => getOpenFileExplorer(datacrate_uuid,file_to_render)}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
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
