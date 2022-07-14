import { useState, useEffect} from "react";
import axios from "axios";
import { getContent, getAllAnnotations} from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import DatacrateContentFileRow from "../DatacrateContentFileRow/DatacrateContentFileRow";
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileTable.css'
import ProgressBar from 'react-bootstrap/ProgressBar'
//check if this actually does anything?

const DatacrateContentFileTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllAnnotations(datacrate_uuid).then(res => {
      setDatacrateContent(res.data.data);
      console.log(res.data.data);
      setLoading(false);
    }
    ).catch(err => {
      console.log(err);
      setError(true);
      setLoading(false);
    }
    );
  }, [datacrate_uuid]);

  //DatacrateContentFileRow(file, file.file, datacrate_uuid)

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
        {Object.keys(DatacrateContent).map((key) => {
          return DatacrateContentFileRow(key,datacrate_uuid,DatacrateContent[key])
        }
        )}
      </div>
    )
  }
}

export default DatacrateContentFileTable
