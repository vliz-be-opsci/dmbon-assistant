import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import { useState, useEffect } from "react"
import { getAnnotationsFile } from 'src/utils/AxiosRequestsHandlers';
import './DatacrateContentFileRow.css'


const DatacrateContentFileRow = (datacrate_uuid ,file) => {

  const [DatacrateContentAnnotation, setDatacrateContentAnnotation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAnnotationsFile(datacrate_uuid, file).then(res => {
      setDatacrateContentAnnotation(res.data);
      console.log(res.data);
      setLoading(false);
    }
    ).catch(err => {
      console.log(err);
      setError(true);
      setLoading(false);
    }
    );
  }, [file.uuid]);

  //return renders
  if (loading) {
    return LoadingBlock("Fetching Datacrate Content");
  }
  if (error) {
    return <AxiosError errorMessage={errorMessage} />;
  }
  else{
    return (
      <div key={file.folder+"/"+file.file} className="content_item">
        <div className="actions">
          <button onClick={() => getOpenFile(datacrate_uuid, file_name)}><VscVmRunning></VscVmRunning></button>
          <button onClick={() => getOpenFileExplorer(datacrate_uuid,file.file)}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
        </div>
        <div className="file-content">
          <div className="file-name">{file.file}</div>
          <div className="file-storage">{file.folder}</div>
        </div>
      </div>
    )
  }
}

export default DatacrateContentFileRow
