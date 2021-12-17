import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import {useParams} from 'react-router-dom';
import FilesView from './../components/files_view';
import ReactLoading from 'react-loading';
import {Button, Modal} from 'react-bootstrap';
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
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

  // axios function to delete specifix file from rocrate space
  const deleteFileRocrate = async (todelete) => {
    console.log('todelete content: '+ todelete)
    axios.delete(process.env.REACT_APP_BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content/`,{
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


  //All the functions here

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>) 
    ));
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      console.log(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })},[])
  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop})

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const fetchSpaces = async () => {
    axios.get(process.env.REACT_APP_BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data)
        countRef.current++;
        setLoading(false);
      })
  }

  const fixCrate = async () => {
    axios.get(process.env.REACT_APP_BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/fixcrate`)
      .then(res => {
        console.log(res.data)
        countRef.current++;
        setLoading(false);
      })
  }

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
            <button onClick={() => updateMessage("fixcrate")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-primary"><FaTools size="1.5em"/></button>
            <button onClick={() => updateMessage("delete")} id="delete_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-danger"><FaTrashAlt size="1.5em"/></button>
          <div>
          <FilesView key={countRef.current} listfiles= {spaceList} />
          </div>
          <div>Number of changes to page: {countRef.current}</div>
          <Modal show={show} size="lg" onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Upload zone</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div {...getRootProps({style})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
              <p>TODO do something with the arraybuffers</p>
              <hr />
              <ul>{files}</ul>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={() => updateMessage("upload")}>
                  Upload files
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    )
  }

    
}

export default SpaceSpecificPage