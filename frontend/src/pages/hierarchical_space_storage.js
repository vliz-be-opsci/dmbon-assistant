import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FilesView from './../components/files_view';
import ReactLoading from 'react-loading';
import {Button, Modal, Tab, Row, Nav, OverlayTrigger, Col, Popover} from 'react-bootstrap';
import {FaTools, FaUpload, FaEdit, FaTrashAlt} from 'react-icons/fa';
import RemoteReferenceTableAdd from '../components/remote_reference_table_modal.js';

function HierarchicalSpacePage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const [Loading, setLoading] = useState(true) 
  const [Message, setMessage] = useState("")
  const url = window.location.href;
  const countRef = useRef(0);
  const {SpaceId} = useParams();
  const folder_get = url.split(SpaceId+"/files")[1]
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [files, setFiles] = useState("");
  console.log(url);
  console.log(folder_get);
  //All the functions here

  const fetchSpaces = async () => {
    axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content${folder_get}`)
      .then(res => {
        console.log("data got from response");
        console.log(res.data)
        if(folder_get == "/"){
          setSpacesList(res.data)
        }else{
          setSpacesList(res.data.Data)
        }
        
        setLoading(false);
      }, (error) => {
        console.log(error);
      }
      )
  }

  useEffect(() => {
    fetchSpaces();
  },[]);

  const OpenBrowserSpace = async () => {
    axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content/openexplorer`)
      .then(res => {
        console.log(res)
      })
  }

  const fixCrate = async () => {
    axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/fixcrate`)
      .then(res => {
        console.log(res.data)
        countRef.current++;
        setLoading(false);
      })
  }

  const popoveropenfilebrowser = (
    <Popover id="popover-open">
        <Popover.Header as="h3">Open File Browser</Popover.Header>
        <Popover.Body>
        Click this to <b>open</b> a file <b>explorer</b> at the path of the <b>datacrate location</b>.
         You can add files/folders here and these will be incorperated in the ROCrate.
         Note that the File <b>explorer</b> will <b>not</b> be <b>focussed</b> on <b>automatically</b>.
        </Popover.Body>
    </Popover>
  );

  const updateMessage = async (message) =>  {
    setMessage(message)
    console.log({Message});
    countRef.current++;
    if(message == "upload"){
      handleClose()
    }  
    if(message == "fixcrate"){
      alert('fixing crate chosen');
      setLoading(true);
      fixCrate();
    }
    if(message == "delete"){
      alert('deleting stuff: TODO');
    }
  }

	if (typeof folder_get !== 'undefined' && folder_get.length > 0) {
    if (Loading){
      return(
        <div class="busy">
          <ReactLoading type='bars' color='blue' height={'20vw'} width={'20vw'} />
        </div>
      )
    }else{
      return (
				<div>
						<h5 className="card text-white bg-dark">Specific Space : {SpaceId}</h5>
            <hr />
            <button onClick={handleShow} id="commit_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-success" ><FaUpload size="1.5em"/></button>
            <button onClick={() => updateMessage("annotate")} id="history_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-primary"><FaEdit size="1.5em"/></button>
            <button onClick={() => updateMessage("fixcrate")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-primary"><FaTools size="1.5em"/></button>
            <button onClick={() => updateMessage("delete")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-danger"><FaTrashAlt size="1.5em"/></button>
						<div>
							<FilesView key={countRef.current} listfiles= {spaceList} />
						</div>
					<div>Number of changes to page: {countRef.current}</div>
          <Modal show={show} size="lg" onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Upload zone </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">add local files</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">add remote reference(s)</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoveropenfilebrowser}>
                      <Button variant="primary" onClick={() => OpenBrowserSpace()} style={{ width: "100%", height: "100px" }}>
                          Open File browser to upload
                      </Button>
                    </OverlayTrigger>
                    <hr/>
                    <Button variant="success" style={{ width: "100%"}} onClick={() => updateMessage("upload")}>
                        Upload files
                    </Button>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <RemoteReferenceTableAdd></RemoteReferenceTableAdd>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            </Modal.Body>
          </Modal>
				</div>
			)
    }
			
	}else{
		window.location.href = `/spaces/${SpaceId}/all_files`;
	}
}

export default HierarchicalSpacePage