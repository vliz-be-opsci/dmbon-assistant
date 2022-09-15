import { BsTrashFill , BsUpload} from "react-icons/bs";
import { FaRegEdit, FaBookMedical, FaBullseye } from "react-icons/fa";
import {Modal} from "react-bootstrap";
import $ from "jquery";

//inport util functions for opening explorer and fixcrate
import { fixDatacrate , getOpenFileExplorer, deleteContent} from "src/utils/AxiosRequestsHandlers";

const FileActions = (ActionPerformingEx, datacrate_uuid, uploadmodal, setuploadmodal, ShowDeleteModal, setShowDeleteModal, ShowAnnotationModal, setShowAnnotationModal, ActionPerforming, setActionPerforming ,listcurrentfiles, ToDeletefiles, setToDeletefiles) => {

  // when uplaod clicked open file explorer and a popup with a message to place files in the folder
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
    console.log(ToDeletefiles);
  }

  return (
    <>
    <div className='row_navigation' >
      <button className='navigation_button' onClick={() => upload()}>
          <div><BsUpload></BsUpload></div>
      </button>
      <button className='navigation_button' onClick={() => setShowDeleteModal(true)}>
          <div><BsTrashFill></BsTrashFill></div>
      </button>
      <button className='navigation_button' onClick={() => setShowAnnotationModal(true)}>
          <div><FaRegEdit></FaRegEdit></div>
      </button>
      <button className='navigation_button' onClick={() => fix()}>
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
        <table>
          <tr>
            <th>
              <input type="checkbox" id="selectall" name="selectall" onChange={(e) => {
                // if select all is checked then check all the checkboxes via jquery
                console.log("select all clicked");
                if (e.target.checked) {
                  console.log("select all checked");
                  $("input:checkbox").prop("checked", true);
                  setToDeletefiles(listcurrentfiles);
                } else {
                  console.log("select all unchecked");
                  $("input:checkbox").prop("checked", false);
                  setToDeletefiles([]);
                }
              }}></input>
            </th>
            <th>File Name</th>
          </tr>
          {listcurrentfiles.map((file) => (
            <tr>
              <td>
                <input
                  type="checkbox"
                  checked={ToDeletefiles.includes(file)}
                  name="checkboxinput"
                  onChange={() => {
                    console.log("checkbox clicked");
                    if (ToDeletefiles.includes(file)) {
                      setToDeletefiles(
                        ToDeletefiles.filter((f) => f !== file)
                      );
                    } else {
                      setToDeletefiles([...ToDeletefiles, file]);
                    }
                    console.log(ToDeletefiles);
                  }}
                />
              </td>
              <td>{file}</td>
            </tr>
          ))}
        </table>
        <button onClick={() => deleteFiles()}> Delete </button>
        <button onClick={() => setShowDeleteModal(false)}> Cancel </button>
      </Modal.Body>
    </Modal>
    <Modal show={ShowAnnotationModal}>
      <Modal.Body>
        <h3>placeholder modal for annotating files here</h3>
        <button onClick={() => setShowAnnotationModal(false)}> Done </button>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default FileActions
