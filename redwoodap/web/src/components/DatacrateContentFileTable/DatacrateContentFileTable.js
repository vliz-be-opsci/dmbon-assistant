import { useState, useEffect } from "react"
import { getContent, getOpenFile, getOpenFileExplorer } from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import DatacrateContentFileRow from "../DatacrateContentFileRow/DatacrateContentFileRow";
import '../component.css';

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
          DatacrateContentFileRow(datacrate_uuid,file)
        ))}
      </div>
    )
  }
}

export default DatacrateContentFileTable
