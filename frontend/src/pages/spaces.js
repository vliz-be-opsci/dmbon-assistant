import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import SpacesView from './../components/spaces_view.js'
import {Button, Modal, Form, FloatingLabel} from 'react-bootstrap';
import { FaPlus} from 'react-icons/fa';
import ReactLoading from 'react-loading';
import modal_add_space from '../components/adding_modal.js';
function SpacePage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const [profileList, setProfilesList] = useState([{}]) 
  const [profileSelected, setProfileSelect] = useState("") 
  const [storagepathSelected, setStoragepath] = useState("") 
  const [URLSelected, setURLSelect] = useState("") 
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(false) 
  const countRef = useRef(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {SpaceId} = useParams();
  //All the functions here
  function addspace(e) {
      e.preventDefault();
      console.log(profileSelected)
      console.log(URLSelected);
      console.log(storagepathSelected);

      //put axios request here that will try and make a new space for the user
      const topost = { storage_path: storagepathSelected ,
                       RO_profile: profileSelected ,
                       remote_url: URLSelected            
                     };
      handleClose();
      setLoading(true);
      axios.post(process.env.REACT_APP_BASE_URL_SERVER+'apiv1/spaces/', topost)
          .then(response => {setLoading(false);window.location.href = `/spaces`;})
          .catch(error => {
              setLoading(false);
              alert('There was an error!', error);
          });
      
  }
  const fetchSpaces = async () => {
    console.log(process.env.REACT_APP_BASE_URL_SERVER);
    axios.get(process.env.REACT_APP_BASE_URL_SERVER+'apiv1/spaces/')
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data)
        countRef.current++;
      })
  }

  const fetchProfiles = async () => {
    console.log(process.env.REACT_APP_BASE_URL_SERVER);
    axios.get(process.env.REACT_APP_BASE_URL_SERVER+'apiv1/profiles/')
      .then(res => {
        console.log(res.data)
        console.log(Object.keys(res.data));
        let reallist = [];
        for (let index = 0; index < Object.keys(res.data).length; index++) {
          const element = Object.keys(res.data)[index];
          reallist.push(<option value={element}>{element}</option>)
        }
        setProfilesList(reallist);
        countRef.current++;
      })
  }

  function handleChange(event) {
    console.log(event.target.name)
    if(event.target.name == "selectprofile"){setProfileSelect(event.target.value);}
    if(event.target.name == "selecturl"){setURLSelect(event.target.value);}
    if(event.target.name == "storagepath"){setStoragepath(event.target.value);}
  }

  useEffect(() => {
    fetchSpaces();
    fetchProfiles();
  },[]);

  if(Loading){
      return(
        <div class="busy">
            <ReactLoading type='bars' color='blue' height={'20vw'} width={'20vw'} />
        </div>
      )
      }else{
        return (
          <div>
              <h5 className="card text-white bg-dark">All spaces</h5>
              <Button variant="danger" onClick={handleShow} style={{width: '100%', marginBottom:'1%'}}><FaPlus></FaPlus> Add Space <FaPlus></FaPlus></Button>
              <div>
              <SpacesView listspace= {spaceList} />
              </div>
              <div>Number of changes to page: {countRef.current}</div>
              <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                  <Modal.Title>Add Space</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group><Form.Label>Profile</Form.Label><Form.Select required aria-label="Default select example" name="selectprofile" onClick={handleChange}>
                                      {profileList}
                    </Form.Select></Form.Group>
                    <br />
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="github repo url, leave empty if none is available"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="selecturl" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Storage path where to store the the new space"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="C:/Users/username/" name="storagepath" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button variant="danger" onClick={addspace}>
                      Yes, add space
                  </Button>
                  </Modal.Footer>
              </Modal>
          </div>
      )
    }
    
}

export default SpacePage