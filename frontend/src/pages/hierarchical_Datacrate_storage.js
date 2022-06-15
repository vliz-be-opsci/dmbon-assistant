import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FilesView from '../components/files_view';
import ReactLoading from 'react-loading';
import {Button, Modal, Tab, Row, Nav, OverlayTrigger, Col, Popover} from 'react-bootstrap';
import {FaEdit, FaTrashAlt, FaBandAid} from 'react-icons/fa';
import {BsFillPlusSquareFill, BsCloudPlusFill, BsFilePlusFill} from 'react-icons/bs';
import RemoteReferenceTableAdd from '../components/remote_reference_table_modal.js';
import $ from 'jquery';

function HierarchicalDatacratePage() {

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
  console.log(url);
  console.log(folder_get);
  //All the functions here
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
        window.location.href = `/Datacrates/${SpaceId}/all_files`;
    });
  });

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

  const updateMessage = async (message) =>  {
    setMessage(message)
    console.log({Message});
    countRef.current++;
    if(message == "upload"){
      handleClose();
      await fixCrate();
      window.location.href = window.location.href;
    }  
    if(message == "fixcrate"){
      alert('fixing crate chosen');
      setLoading(true);
      await fixCrate();
      window.location.href =window.location.href;
    }
  }

	if (typeof folder_get !== 'undefined' && folder_get.length > 0) {
    if (Loading){
      return(
        <div class="busy">
          <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
        </div>
      )
    }else{
      return (
				<div>
            <hr />
            <button onClick={handleShow} id="commit_btn" type="button" style={{width:"23%",margin:"1%"}} class="button_vliz" ><BsFillPlusSquareFill size="1.5em"/></button>
            <button onClick={() => updateMessage("annotate")} id="history_btn" type="button" style={{width:"23%",margin:"1%"}} class="button_vliz"><FaEdit size="1.5em"/></button>
            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverfixcrate}>
              <button onClick={() => updateMessage("fixcrate")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="button_vliz"><FaBandAid size="1.5em"/></button>
            </OverlayTrigger>
            <button onClick={() => updateMessage("delete")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="button_vliz"><FaTrashAlt size="1.5em"/></button>
						<div>
							<FilesView key={countRef.current} listfiles= {spaceList} />
						</div>
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
                      <Nav.Link eventKey="first" variant="dark"><BsFilePlusFill size="1.5em"/></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second" variant="dark"><BsCloudPlusFill size="1.5em"/></Nav.Link>
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
		window.location.href = `/Datacrates/${SpaceId}/all_files`;
	}
}

export default HierarchicalDatacratePage