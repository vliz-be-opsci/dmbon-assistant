import { BsTrashFill , BsUpload} from "react-icons/bs";
import { FaRegEdit, FaBookMedical, FaBullseye } from "react-icons/fa";
import {Modal} from "react-bootstrap";

//inport util functions for opening explorer and fixcrate
import { fixDatacrate , getOpenFileExplorer} from "src/utils/AxiosRequestsHandlers";

const FileActions = (ActionPerforming, datacrate_uuid, uploadmodal, setuploadmodal) => {

  // when uplaod clicked open file explorer and a popup with a message to place files in the folder
  const upload = () => {
    getOpenFileExplorer(datacrate_uuid).then((res) => {
      setuploadmodal(true);
    });
    console.log("upload clicked");
  };

  const fix = () => {
    setuploadmodal(false);
    ActionPerforming(true);
    fixDatacrate(datacrate_uuid).then((res) => {
      console.log(res);
      ActionPerforming(false);
    });
    console.log("fix clicked");
  };

  return (
    <>
    <div className='row_navigation' >
      <button className='navigation_button' onClick={() => upload()}>
          <div><BsUpload></BsUpload></div>
      </button>
      <button className='navigation_button' >
          <div><BsTrashFill></BsTrashFill></div>
      </button>
      <button className='navigation_button' >
          <div><FaRegEdit></FaRegEdit></div>
      </button>
      <button className='navigation_button' >
          <div><FaBookMedical></FaBookMedical></div>
      </button>
    </div>
    <Modal show={uploadmodal}>
      <Modal.Body>
        <h3>when u are done with placing files in the file explorer , click on the done button below</h3>
        <button onClick={() => fix()}> Done </button>
      </Modal.Body>
    </Modal>
    </>
    
      
  )
}

export default FileActions
