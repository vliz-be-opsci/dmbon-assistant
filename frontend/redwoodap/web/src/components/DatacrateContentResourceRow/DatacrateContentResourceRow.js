import {MdScreenSearchDesktop} from 'react-icons/md';
import '../component.css';
import './DatacrateContentResourceRow.css';
import ProgressPie from '../ProgressPie/ProgressPie';


const DatacrateContentResourceRow = (file_to_render, datacrate_uuid, info, setshow, setcontent, setdatacrateContent, checkboxSelectedFiles, setCheckboxSelectedFiles) => {
  // function here that sets show to true and content to info and file_to_render
  const makeModal = () => {
    setdatacrateContent({});
    setshow(true);
    setcontent({"info":info, "file_name":file_to_render});
  }

  //loop over checkboxselected files and check if the file_to_render is in it , if so then have a let return true else false
  let checked = false;
  for (let i = 0; i < checkboxSelectedFiles.length; i++) {
    if (checkboxSelectedFiles[i] === file_to_render) {
      checked = true;
      break;
    }
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
      <div className="checkbox_file_row">
        <input type="checkbox" checked={checked} onChange={() => {
          if (checked) {
            if (!file_to_render in checkboxSelectedFiles){
              checkboxSelectedFiles.push(file_to_render);
            }
            console.log(checkboxSelectedFiles);
            setCheckboxSelectedFiles(checkboxSelectedFiles);
          } else {
            //delete the file_to_render from the checkboxselectedfiles
            for (let i = 0; i < checkboxSelectedFiles.length; i++) {
              if (checkboxSelectedFiles[i] === file_to_render) {
                checkboxSelectedFiles.splice(i, 1);
              }
            }
            console.log(checkboxSelectedFiles);
            setCheckboxSelectedFiles(checkboxSelectedFiles);
          }
        }}/>
      </div>
    </div>
  )
}

export default DatacrateContentResourceRow
