import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import SpacesView from '../components/spaces_view.js'
import {Button, Modal, Form, FloatingLabel} from 'react-bootstrap';
import ReferencesView from '../components/references_view';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';

function DatecratePage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const [referenceList, setReferencesList] = useState([{}]) 
  const [NameSelected, setNameSelect] = useState("") 
  const [profileList, setProfilesList] = useState([{}]) 
  const [profileSelected, setProfileSelect] = useState("") 
  const [storagepathSelected, setStoragepath] = useState("") 
  const [URLSelected, setURLSelect] = useState("") 
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(true); 
  const countRef = useRef(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {SpaceId} = useParams();
  //All the functions here
  function addspace(e) {
      e.preventDefault();
      // change the profile name to profile uuid
      console.log(profileSelected);
      //put axios request here that will try and make a new space for the user
      const topost = { storage_path: storagepathSelected ,
                       RO_profile: profileSelected ,
                       remote_url: URLSelected,
                       name: NameSelected           
                     };
      handleClose();
      setLoading(true);
      axios.post(BASE_URL_SERVER+'apiv1/spaces/', topost)
          .then(response => {setLoading(false);window.location.href = `/Datacrates`;})
          .catch(error => {
              setLoading(false);
              alert('There was an error!', error);
          });
  }
  
  const fetchSpaces = async () => {
    console.log(BASE_URL_SERVER);
    axios.get(BASE_URL_SERVER+'apiv1/spaces/')
      .then(res => {
        console.log(res.data)
        var file_array = [];
        var reference_array = [];
        //loop over the res.data and sort out the items by type => if type == file then add it to the filearray => if not add it to the reference_array 
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == "file") {
            file_array.push(res.data[i]);
          } else {
            reference_array.push(res.data[i]);
          }
        }
        setSpacesList(file_array);
        setReferencesList(reference_array);
        countRef.current++;
      })
  }

  const fetchProfiles = async () => {
    console.log(BASE_URL_SERVER);
    axios.get(BASE_URL_SERVER+'apiv1/profiles/')
      .then(res => {
        console.log(res.data)
        console.log(Object.keys(res.data));
        let reallist = [];
        for (let index = 0; index < Object.keys(res.data).length; index++) {
          const element = Object.keys(res.data)[index];
          var values = Object.values(res.data)[index];
          reallist.push(<option value={element}>{values.name}</option>)
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
    if(event.target.name == "selectname"){setNameSelect(event.target.value);}
  }

  useEffect(() => {
    fetchSpaces();
    fetchProfiles();
  },[]);

  useEffect(() => {
    setLoading(false);
  },[spaceList]);

  if(Loading){
      return(
        <div class="busy">
            <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
        </div>
      )
      }else{
        return (
          <div>
              <p></p>
              <div>
              <SpacesView listspace= {spaceList} />
              </div>
          </div>
      )
    }
    
}

export default DatecratePage