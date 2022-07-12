import { useState, useEffect } from "react"
import { getContent, getOpenFile, getOpenFileExplorer } from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileTable.css'

const DatacrateContentFileTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getContent(datacrate_uuid).then(res => {
      setDatacrateContent(res.data);
      console.log(res.data);
      setLoading(false);
    }
    ).catch(err => {
      console.log(err);
      setError(true);
      setLoading(false);
    }
    );
  }, [datacrate_uuid]);

  //return renders
  if (loading) {
    return LoadingBlock("Fetching Datacrate Content");
  }
  if (error) {
    return <AxiosError errorMessage={errorMessage} />;
  }
  else{
    return (
      <div className="component">
        <div className="title">File Content</div>
        {DatacrateContent.map(file => (
          <div key={file.folder+"/"+file.file} className="content_item">
          <div className="actions">
            <button onClick={() => getOpenFile(datacrate_uuid, file_name)}><VscVmRunning></VscVmRunning></button>
            <button onClick={() => getOpenFileExplorer(datacrate_uuid,file.file)}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
          </div>
          <div className="file-content">
            <div className="file-name">{file.file || <Skeleton />}</div>
            <div className="file-name">{file.file}</div>
            <div className="file-storage">{file.folder}</div>
          </div>
        </div>
        ))}
      </div>
    )
  }
}

export default DatacrateContentFileTable
