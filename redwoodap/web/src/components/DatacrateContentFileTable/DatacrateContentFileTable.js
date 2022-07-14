import { useState, useEffect} from "react";
import { getAllAnnotations} from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import {Modal} from "react-bootstrap";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import DatacrateContentFileRow from "../DatacrateContentFileRow/DatacrateContentFileRow";
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileTable.css'
//check if this actually does anything?

const DatacrateContentFileTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [modalContent, setModalContent] = useState({});

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

  //function that returns the modal
  const MakeModal = () => {
    //check if modalContent contains the keys "info" and "file_name"
    if(modalContent.hasOwnProperty("info") && modalContent.hasOwnProperty("file_name")){
      return(
      <Modal show={showmodal} onHide={() => setShowmodal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.file_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-content-title">File Name</div>
            <div className="modal-content-value">{modalContent.file_name}</div>
            <div className="modal-content-title">File Size</div>
            <div className="modal-content-value">{modalContent.info.summary.green}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowmodal(false)}>Close</button>
        </Modal.Footer>
      </Modal>
      )
    }else{
      return(<></>)
    }
  }

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
      <>
      <div className="component">
        <div className="title">File Content</div>
        {Object.keys(DatacrateContent).map((key) => {
          return DatacrateContentFileRow(key,datacrate_uuid,DatacrateContent[key],setShowmodal,setModalContent);
        }
        )}
      </div>
      <MakeModal />
      </>
    )
  }
}

export default DatacrateContentFileTable
