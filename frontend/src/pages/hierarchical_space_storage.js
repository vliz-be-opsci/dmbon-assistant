import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import {useParams} from 'react-router-dom';
import FilesView from './../components/files_view';
import ReactLoading from 'react-loading';
import {Button, Modal} from 'react-bootstrap';
import {FaTools, FaUpload, FaEdit, FaTrashAlt} from 'react-icons/fa';

function HierarchicalSpacePage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const [Loading, setLoading] = useState(true) 
  const [Message, setMessage] = useState("")
  const url = window.location.href;
  const countRef = useRef(0);
  const {SpaceId} = useParams();
  const folder_get = url.split(SpaceId+"/files/project")[1]
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [files, setFiles] = useState("");
  console.log(folder_get);
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
  //All the functions here
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>) 
    ));
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

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
    axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/content${folder_get}`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data.Data)
        setLoading(false);
      })
  }

  useEffect(() => {
    fetchSpaces();
  },[]);

  const fixCrate = async () => {
    axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/fixcrate`)
      .then(res => {
        console.log(res.data)
        countRef.current++;
        setLoading(false);
      })
  }

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
            <button onClick={() => updateMessage("fixcrate")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-info text-white"><FaTools size="1.5em"/></button>
            <button onClick={() => updateMessage("delete")} id="fixcrate_btn" type="button" style={{width:"23%",margin:"1%"}} class="btn btn-danger"><FaTrashAlt size="1.5em"/></button>
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
              <hr />
              <ul>{files}</ul>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                  No
              </Button>
              <Button variant="success" onClick={() => updateMessage("upload")}>
                  Upload files
              </Button>
            </Modal.Footer>
          </Modal>
				</div>
			)
    }
			
	}else{
		window.location.href = `/spaces/${SpaceId}/all_files`;
	}
    

    
}

export default HierarchicalSpacePage