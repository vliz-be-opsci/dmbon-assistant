import { BsTrashFill , BsUpload} from "react-icons/bs";
import { FaRegEdit, FaBookMedical } from "react-icons/fa";
import {Modal} from "react-bootstrap";
//inport util functions for opening explorer and fixcrate
import { fixDatacrate , getOpenFileExplorer, deleteContent} from "src/utils/AxiosRequestsHandlers";

const FileActions = (ActionPerformingEx, datacrate_uuid, uploadmodal, setuploadmodal, ShowDeleteModal, setShowDeleteModal, ShowAnnotationModal, setShowAnnotationModal, ActionPerforming, setActionPerforming ,listcurrentfiles, checkboxselectedfiles, normalselectedfiles, setNormalselectedfiles) => {

  // when upload clicked open file explorer and a popup with a message to place files in the folder
  const upload = () => {
    getOpenFileExplorer(datacrate_uuid).then((res) => {
      setuploadmodal(true);
    });
    console.log("upload clicked");
  };

  const fix = () => {
    setuploadmodal(false);
    ActionPerformingEx(true);
    fixDatacrate(datacrate_uuid).then((res) => {
      console.log(res);
      ActionPerformingEx(false);
    });
    console.log("fix clicked");
  };

  //function that will run the axios delete request to delete the Todeletefiles
  const deleteFiles = () => {
    console.log("delete clicked");
  }

  return (
    <>
    <div className='row_navigation' >
      <button className='action_button' onClick={() => upload()}>
          <div><BsUpload></BsUpload></div>
      </button>
      <button className='action_button' onClick={() => setShowDeleteModal(true)}>
          <div><BsTrashFill></BsTrashFill></div>
      </button>
      <button className='action_button' onClick={() => setShowAnnotationModal(true)}>
          <div><FaRegEdit></FaRegEdit></div>
      </button>
      <button className='action_button' onClick={() => fix()}>
          <div><FaBookMedical></FaBookMedical></div>
      </button>
    </div>
    <Modal show={uploadmodal}>
      <Modal.Body>
        <h3>when u are done with placing files in the file explorer , click on the done button below</h3>
        <button onClick={() => setuploadmodal(false)}> Cancel </button>
        <button onClick={() => fix()}> Done </button>
      </Modal.Body>
    </Modal>
    <Modal show={ShowDeleteModal}>
      <Modal.Body>
        <h3>Placeholder modal for deleting files here, the backend functionality was removed and must be added back in </h3>
        <button onClick={() => deleteFiles()}> Delete </button>
        <button onClick={() => setShowDeleteModal(false)}> Cancel </button>
      </Modal.Body>
    </Modal>
    <Modal show={ShowAnnotationModal}>
      <Modal.Body>
        <h3>Annotate files</h3>
        <table className="table_vliz">
          <thead>
          <tr>
            <th>File Name</th>
          </tr>
          </thead>
          <tbody>
          {normalselectedfiles.map((file) => {
            return (
              <tr>
                <td>{file}</td>
              </tr>
            );
          })}
          </tbody>
        </table>

      </Modal.Body>
      <Modal.Footer><button onClick={() => setShowAnnotationModal(false)}> Done </button></Modal.Footer>
    </Modal>
    </>
  )
}

export default FileActions
