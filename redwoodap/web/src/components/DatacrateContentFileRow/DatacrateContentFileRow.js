import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileRow.css'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const DatacrateContentFileRow = (all_files, file_to_render) => {

  //LoadingBlock(`Fetching File Annotation ${file_to_render}`, "S")
  if(!all_files){
    return(
      <SkeletonTheme color="#f5f5f5" highlightColor="#f5f5f5">
        <div className="content_item">
          <div className="actions">
              <Skeleton width={50} height={50} />
              <Skeleton width={50} height={50} />
          </div>
          <div className="file-content">
            <div className="file-name"><Skeleton width={200}></Skeleton></div>
            <div className="file-storage"><Skeleton width={20}></Skeleton></div>
          </div>
        </div>
      </SkeletonTheme>
    )
  }else{
    let annotation_data = all_files;
    console.log(annotation_data);
    //check if annotation_data has key error
    if(annotation_data.error){
      return(
        <div key={file_to_render} className="content_item">
          <div className="actions">
            <button onClick={() => getOpenFile(datacrate_uuid, file_to_render)}><VscVmRunning></VscVmRunning></button>
            <button onClick={() => getOpenFileExplorer(datacrate_uuid,file_to_render)}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
          </div>
          <div className="file-content">
            <div className="file-name">{file_to_render}</div>
            <div className="file-storage">{"File is not present in the rocrate-metadata.json file."}</div>
          </div>
        </div>
      )
    }
    else{
      return (
        <div key={file_to_render} className="content_item">
          <div className="actions">
            <button onClick={() => getOpenFile(datacrate_uuid, file_to_render)}><VscVmRunning></VscVmRunning></button>
            <button onClick={() => getOpenFileExplorer(datacrate_uuid,file_to_render)}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
          </div>
          <div className="file-content">
            <div className="file-name">{file_to_render}</div>
            <div className="file-storage">{annotation_data.summary.green}</div>
          </div>
        </div>
      )
    }
  }
}

export default DatacrateContentFileRow
