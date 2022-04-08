import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FilesView from './../components/files_view';
import RemoteReferenceTable from '../components/remote_reference_table.js';
import ReactLoading from 'react-loading';
import {Button, Modal, Popover, OverlayTrigger, Tab, Row, Col, Nav} from 'react-bootstrap';
import {FaTools, FaUpload, FaEdit, FaTrashAlt} from 'react-icons/fa';

import $ from 'jquery';

function SpaceSpecificPage() {

  //define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const countRef = useRef(0);
  const [files, setFiles] = useState("");
  const {SpaceId} = useParams();
  const [Message, setMessage] = useState("");
  const [Loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // axios function to delete specifix file from rocrate space
  const deleteFileRocrate = async (todelete) => {
    console.log('todelete content: '+ todelete)
    axios.delete(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content/`,{
      data:{"content": todelete}
    })
      .then(res => {
        console.log(res.data)

      }, (error) => {
        console.log(error);
      })
  }

    //jquery functions
  $(document).ready(function() {
    $('#delete_btn').click(function () {   
        console.log('delete clicked'); 
        var array = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

        for (var i = 0; i < checkboxes.length; i++) {
          if(checkboxes[i].value != 'ro-crate-metadata.json' && checkboxes[i].value != 'on'){
            array.push(checkboxes[i].value)
          }
        }
        console.log(array);
        deleteFileRocrate(array);
        window.location.href = `/spaces/${SpaceId}/all_files`;
    });
  });

  const fetchSpaces = async () => {
    axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data)
        countRef.current++;
        setLoading(false);
      })
  }

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

  const popoverfixcrate = (
    <Popover id="popover-open">
        <Popover.Header as="h3">Fix Crate</Popover.Header>
        <Popover.Body>
        Click this to <b>fix metadata</b> issues from <b>files</b> that have been added to the crate from the <b>explorer</b>.
        </Popover.Body>
    </Popover>
  );

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

  useEffect(() => {
    fetchSpaces();
  },[Message]);

  const updateMessage = async (message) =>  {
    setMessage(message)
    if(message == "upload"){
      handleClose()
    }  
    if(message == "fixcrate"){
      setLoading(true);
      fixCrate();
    }
  }

  if (Loading){
    return (
      <div class="busy">
        <ReactLoading type='bars' color='#666' height={'20vw'} width={'20vw'} />
      </div>
    )
  }else{
    return (
      <div>
          <h5 className="card text-white bg-dark">Specific Space : {SpaceId}</h5>
          <h5 className="card text-black bg-warning">location space: {spaceList[0].folder}</h5>
          <hr/>
            <button onClick={handleShow} id="commit_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-success" ><FaUpload size="1.5em"/></button>
            <button onClick={() => updateMessage("annotate")} id="annotate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-primary"><FaEdit size="1.5em"/></button>
            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverfixcrate}>
              <button onClick={() => updateMessage("fixcrate")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-primary"><FaTools size="1.5em"/></button>
            </OverlayTrigger>
            <button onClick={() => updateMessage("delete")} id="delete_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-danger"><FaTrashAlt size="1.5em"/></button>
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
                      <Button variant="info" onClick={() => OpenBrowserSpace()} style={{ width: "100%", height: "100px" }}>
                          Open File browser to upload
                      </Button>
                    </OverlayTrigger>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <RemoteReferenceTable></RemoteReferenceTable>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" style={{ width: "100%"}} onClick={() => updateMessage("upload")}>
                  Upload files
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    )
  }  
}

export default SpaceSpecificPage