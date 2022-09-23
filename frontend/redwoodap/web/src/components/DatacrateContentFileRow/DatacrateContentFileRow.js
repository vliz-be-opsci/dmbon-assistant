import {VscVmRunning} from 'react-icons/vsc';
import {MdScreenSearchDesktop} from 'react-icons/md';
import '../component.css';
import './DatacrateContentFileRow.css';
import { getOpenFile, getOpenFileExplorer } from 'src/utils/AxiosRequestsHandlers';
import ProgressPie from '../ProgressPie/ProgressPie';
import $ from 'jquery';

const DatacrateContentFileRow = (file_to_render, datacrate_uuid, info, setshow, setcontent, setdatacrateContent, checkboxSelectedFiles, setCheckboxSelectedFiles,normalselectedfiles, setNormalselectedfiles) => {

  // function here that sets show to true and content to info and file_to_render
  const makeModal = () => {
    setdatacrateContent({});
    setshow(true);
    setcontent({"info":info, "file_name":file_to_render});
  }

  // const file_to_render_compressed = file_to_render.replace(/ /g, "_");
  let file_to_render_compressed = file_to_render.replace(/ /g, "_");
  // replace . by _ to avoid problems with jquery
  file_to_render_compressed = file_to_render_compressed.replace(/\./g, "_");
  // replace / by _ to avoid problems with jquery
  file_to_render_compressed = file_to_render_compressed.replace(/\//g, "_");

  //loop over checkboxselected files and check if the file_to_render is in it , if so then have a let return true else false
  const ischecked = () => {
    for (let i = 0; i < checkboxSelectedFiles.length; i++) {
      if (checkboxSelectedFiles[i] == file_to_render_compressed) {
        //change the state of the checkbox with name file to render to true with jquery
        try {
          $(`#${file_to_render_compressed}`).prop('checked', true);
          console.log("true");
          console.log(checkboxSelectedFiles);
          console.log(file_to_render_compressed);
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  }

  ischecked();

  return (
    <div className="content_item">

      <div className="actions">
        <button onClick={() => makeModal()}><MdScreenSearchDesktop></MdScreenSearchDesktop></button>
        <button onClick={() => getOpenFile(datacrate_uuid, file_to_render)}><VscVmRunning></VscVmRunning></button>
      </div>
      <div className="file-storage">
        <ProgressPie content={info.summary} />
      </div>
      <div className="file-content">
        <div className="file-name">
            <input type="checkbox" id={file_to_render_compressed} onClick={(e) => {
              if (e.target.checked) {
                setNormalselectedfiles([...normalselectedfiles, file_to_render]);
                checkboxSelectedFiles.push(file_to_render_compressed);
                console.log(checkboxSelectedFiles);
                setCheckboxSelectedFiles(checkboxSelectedFiles);
              } else {
                //delete the file_to_render from the checkboxselectedfiles
                for (let i = 0; i < normalselectedfiles.length; i++) {
                  if (normalselectedfiles[i] == file_to_render) {
                    normalselectedfiles.splice(i, 1);
                    break;
                  }
                }
                for (let i = 0; i < checkboxSelectedFiles.length; i++) {
                  if (checkboxSelectedFiles[i] === file_to_render_compressed) {
                    checkboxSelectedFiles.splice(i, 1);
                  }
                }
                console.log(checkboxSelectedFiles);
                setNormalselectedfiles(normalselectedfiles);
                setCheckboxSelectedFiles(checkboxSelectedFiles);
              }
            }}/>
          {file_to_render}
        </div>
      </div>

    </div>
  )
}

export default DatacrateContentFileRow
