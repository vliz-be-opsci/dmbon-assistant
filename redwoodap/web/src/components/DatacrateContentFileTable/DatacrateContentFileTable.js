import { useState, useEffect } from "react"
import { getContent, getAnnotationsFile } from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import DatacrateContentFileRow from "../DatacrateContentFileRow/DatacrateContentFileRow";
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileTable.css'
import ProgressBar from 'react-bootstrap/ProgressBar'
//check if this actually does anything?


const DatacrateContentFileTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [LoadedFinal, setLoadedFinal] = useState(0);

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

  //ffunction that will run a request and only stops when res.status_code is 200
  const getContentAnnotation = (datacrate_uuid, file) => {
    getAnnotationsFile(datacrate_uuid, file.file).then(res => {
      file.annotations = res.data;
      setDatacrateContent([...DatacrateContent]);

      //get the number of files that have annotation in the key
      let LoadedFinal = 0;
      for (let i = 0; i < DatacrateContent.length; i++) {
        if (DatacrateContent[i].annotations.length > 0) {
          LoadedFinal++;
        }
      }
      setLoadedFinal(Math.round(((LoadedFinal )/ DatacrateContent.length) * 100));

    }
    ).catch(err => {
      console.log(err);
      file.annotations = {"error":err};
      setDatacrateContent([...DatacrateContent]);
      setProgress(progress + 1);
      setLoadedFinal(Math.round(((LoadedFinal) / DatacrateContent.length) * 100));
      //getContentAnnotation(datacrate_uuid, file);
    }
    );
  }

  //have useEffect that gets triggered when DatacrateContent changes that will loop over each file.file and gets the annotation data
  useEffect(() => {
    if(Object.keys(DatacrateContent).length > 0){
      for(let file of DatacrateContent){
        getContentAnnotation(datacrate_uuid, file);
      }
    }
  }, [loading]);

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
        <ProgressBar>
          <ProgressBar striped variant="primary" now={LoadedFinal} key={1} />
        </ProgressBar>
        {DatacrateContent.map(file => (
          DatacrateContentFileRow(file.annotations, file.file)
        ))}
      </div>
    )
  }
}

export default DatacrateContentFileTable
