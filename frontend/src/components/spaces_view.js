import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {BASE_URL_SERVER} from '../App.js';
import {Form, FloatingLabel, Modal, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import {FaPlus,FaFolderOpen, FaGitAlt, FaCog} from 'react-icons/fa';
import {MdOpenInBrowser} from "react-icons/md";
import Datacrate_overview_row from './datacrate_overview_row.js';

axiosRetry(axios, { retries: 3 });

function SpacesView(props) {
    //define const usestates first 
    const [profilesList, setProfilesList] = useState([{}]);
    const [profileList, setProfileseList] = useState([{}]);
    const [spacesListData, setSpacesListData] =  useState([{}]);
    const [show, setShow] = useState(false);
    const [showspacecreation, setShowSpaceCreation] = useState(false);
    const [showprofilecreation, setShowProfileCreation] = useState(false);
    const [Loading, setLoading] = useState(true); 
    const [profileSelected, setProfileSelect] = useState("") ;
    const [storagepathSelected, setStoragepath] = useState("") ;
    const [URLSelected, setURLSelect] = useState("") ;
    const [NameSelected, setNameSelect] = useState("") ;
    const [NameSpace, setNameSpace] = useState("") ;
    const [NameProfile, setNameProfile] = useState("") ;
    const [URLSpaceSelected, setURLSpaceSelect] = useState("") ;
    const [URLProfileSelected, setURLProfileSelect] = useState("") ;
    const [descriptionProfile, setDescriptionProfile] = useState("") ;
    const [descriptionSpace, setDescriptionSpace] = useState("") ;
    const [logoProfile, setLogoProfile] = useState("") ;
    const [logoSpace, setLogoSpace] = useState("") ;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseSpaceCreation = () => setShowSpaceCreation(false);
    const handleshowCreationSpace = () => setShowSpaceCreation(true);
    const handleCloseProfileCreation = () => setShowProfileCreation(false);
    const handleshowCreationProfile = () => setShowProfileCreation(true);
    //get the info of the profiles
    const fetchProfiles = async () => {
        axios.get(BASE_URL_SERVER+'apiv1/profiles/')
          .then(res => {
            let reallist = [];
            for (let index = 0; index < Object.keys(res.data).length; index++) {
              const element = Object.keys(res.data)[index];
              var values = Object.values(res.data)[index];
              reallist.push(<option value={element}>{values.name}</option>)
            }
            setProfileseList(reallist);
            console.log(res.data);
            var profiledata = res.data;
            setProfilesList(res.data);
            axios.get(BASE_URL_SERVER+'apiv1/spaces/')
            .then(res => {
              console.log(res.data)
              spacesList(profiledata, res.data);
            })
          })
      }

    function adddatacrate(e) {
        e.preventDefault();
        // change the profile name to profile uuid
        console.log(profileSelected);
        console.log(profilesList[profileSelected]);
        //put axios request here that will try and make a new space for the user
        const topost = { storage_path: storagepathSelected ,
                            RO_profile: profilesList[profileSelected]["uuid"] ,
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

    //function to post a new profile to the server
    function addprofile(e) {
        e.preventDefault();
        // change the profile name to profile uuid
        console.log(NameProfile);
        //put axios request here that will try and make a new space for the user
        const topost = { name: NameProfile ,
                         logo: logoProfile , 
                         description: descriptionProfile ,
                         url_ro_profile: URLProfileSelected 
                          };
        handleClose();
        setLoading(true);
        axios.post(BASE_URL_SERVER+'apiv1/profiles/', topost)
            .then(response => {setLoading(false);window.location.href = `/Profiles`;})
            .catch(error => {
                setLoading(false);
                alert('There was an error!', error);
        });
      }

    //function to post a new project to the server
    function addspace(e) {
      e.preventDefault();
      // change the profile name to profile uuid
      console.log(NameProfile);
      //put axios request here that will try and make a new space for the user
      const topost = { name: NameSpace ,
                       logo: logoSpace , 
                       description: descriptionSpace ,
                       url_ro_project: URLSpaceSelected
                        };
      handleClose();
      setLoading(true);
      axios.post(BASE_URL_SERVER+'apiv1/projects/', topost)
          .then(response => {setLoading(false);window.location.href = `/Projects`;})
          .catch(error => {
              setLoading(false);
              alert('There was an error!', error);
      });
    }


  
    function handleChange(event) {
      console.log(event.target.name)
      if(event.target.name == "selectprofile"){setProfileSelect(event.target.value);}
      if(event.target.name == "selecturl"){setURLSelect(event.target.value);}
      if(event.target.name == "storagepath"){setStoragepath(event.target.value);}
      if(event.target.name == "selectname"){setNameSelect(event.target.value);}
      if(event.target.name == "namespace"){setNameSpace(event.target.value);}
      if(event.target.name == "profilename"){setNameProfile(event.target.value);}
      if(event.target.name == "urlspace"){setURLSpaceSelect(event.target.value);}
      if(event.target.name == "urlprofile"){setURLProfileSelect(event.target.value);}
      if(event.target.name == "descriptionprofile"){setDescriptionProfile(event.target.value);}
      if(event.target.name == "descriptionspace"){setDescriptionSpace(event.target.value);}
      if(event.target.name == "logoprofile"){setLogoProfile(event.target.value);}
      if(event.target.name == "logospace"){setLogoSpace(event.target.value);}
    }

    //transform spaces info 
    const spacesList = async (profiledata, listspace) => {
        setLoading(true);
        var spacelistmetadata = [];
        console.log(Object.keys(profiledata).length);
        console.log(profiledata);
        console.log(listspace);
        for (let index = 0; index < listspace.length; index++) {
            var spacelistdata = {}
            for (let inde = 0; inde < Object.keys(listspace[index]).length; inde++) {
                const element = Object.keys(listspace[index])[inde];
                var value = Object.values(listspace[index])[inde];
                spacelistdata[element] = value;
            }
            console.log(listspace);
            var space_name_array = listspace[index]["storage_path"];
            space_name_array = space_name_array.replace("\\", "/").split("/");
            var space_name = space_name_array[space_name_array.length-1];
            console.log(space_name);
            spacelistdata["truespacename"] = space_name;
            //get the profile name from the profile data
            for (let ind = 0; ind < Object.keys(profiledata).length; ind++) {
                console.log(Object.values(profiledata)[ind]);
                console.log(Object.keys(Object.values(profiledata)[ind]).length);
                for (let i = 0; i < Object.keys(Object.values(profiledata)[ind]).length; i++) {
                    console.log(Object.values(Object.values(profiledata)[ind])[i]);
                    if(Object.values(Object.values(profiledata)[ind])[i] == listspace[index]["RO_profile"]){
                        console.log( Object.values(profiledata)[ind]["name"]);
                        spacelistdata["trueprofilename"] = Object.values(profiledata)[ind]["name"];
                        spacelistdata["trueprofileuuid"] = Object.values(profiledata)[ind]["uuid"];
                        spacelistdata["parent_space"] = Object.values(profiledata)[ind]["parent_space"];
                    }
                }
            }
            console.log(spacelistdata); 
            spacelistmetadata.push(spacelistdata);
        }
        console.log(spacelistmetadata);
        setSpacesListData(spacelistmetadata);
        /*this timeout was set since the data was not being set in time*/
        setLoading(false);
    }


    const searchTable = async(value_input) => {
        // Declare variables
        var input, filter, table, tr, td, i, y, txtValue;
        input = value_input
        filter = input.toUpperCase();
        table = document.getElementById("spaces_table");
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 1; i < tr.length; i++) {
            var is_visible = false;
            /* if its the last row then isvisible is true*/
            if(i == tr.length-1){
                is_visible = true;
            }
          for (y = 0; y < tr[i].getElementsByTagName("td").length; y++) {
            td = tr[i].getElementsByTagName("td")[y];
            if (td) {
                txtValue = td.textContent || td.innerText;
                /* if input is empty, show all rows */
                if (input.length == 0) {
                    tr[i].style.display = "";
                    is_visible = true;
                }

                /* if input is not empty, show only rows that match the search query */
                else if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    is_visible = true;
                } 
              }
          }   
          if(is_visible){
            tr[i].style.display = "";
          }
          else {
            tr[i].style.display = "none";
          }
        }
      }

    useEffect(() => {
        fetchProfiles();
    },[]);
    //link the profiles to the space id
    if(Loading){
        return(
          <div class="busy">
              <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
          </div>
        )
    }else{
        return (
            <div>
                <input type="text" id="searchtable" onChange={(e) => searchTable(e.target.value)} placeholder="Search in Table.."></input>
                <table id="spaces_table" className='table_vliz'>
                    <thead>
                        <tr>
                            <th>Datacrate name</th>
                            <th>Space</th>
                            <th>Profile</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {spacesListData.map(space =>
                    <>
                        <Datacrate_overview_row spacedata={space}></Datacrate_overview_row>
                    </>
                    )}
                    <tr>
                       <td><button onClick={handleShow} className="button_datacrates margin-right"><FaPlus></FaPlus></button></td> 
                       <td><button onClick={handleshowCreationSpace} className="button_datacrates margin-right"><FaPlus></FaPlus></button></td> 
                       <td><button onClick={handleshowCreationProfile} className="button_datacrates margin-right"><FaPlus></FaPlus></button></td> 
                       <td></td>
                    </tr>
                    </tbody>
                </table> 
                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                  <Modal.Header closeButton>
                  <Modal.Title>Add Datacrate</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form.Group><Form.Label>Name datacrate</Form.Label><Form.Control type="text" placeholder="" name="selectname" onChange={handleChange}/></Form.Group>
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
                  <Button variant="danger" onClick={adddatacrate}>
                      Yes, add Datacrate
                  </Button>
                  </Modal.Footer>
              </Modal> 
              <Modal show={showspacecreation} onHide={handleCloseSpaceCreation} backdrop="static" keyboard={false}>
                  <Modal.Header closeButton>
                  <Modal.Title>Add Space</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form.Group><Form.Label>Name Space</Form.Label><Form.Control type="text" placeholder="" name="namespace" onChange={handleChange}/></Form.Group>
                    <br />
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="github repo url"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="urlspace" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="url thats points to the logo of the space"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="logospace" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="description of the space"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="descriptionspace" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <br />
                  </Modal.Body>
                  <Modal.Footer>
                  <Button variant="danger" onClick={addspace}>
                      Yes, add Space
                  </Button>
                  </Modal.Footer>
              </Modal> 
              <Modal show={showprofilecreation} onHide={handleCloseProfileCreation} backdrop="static" keyboard={false}>
                  <Modal.Header closeButton>
                  <Modal.Title>Add Profile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form.Group><Form.Label>Name Profile</Form.Label><Form.Control type="text" placeholder="" name="nameprofile" onChange={handleChange}/></Form.Group>
                  <br /> 
                  <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="description of the profile"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="descriptionprofile" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="github repo url"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="urlprofile" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                    <br />                 
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="logo profile"
                        className="mb-3"
                      >
                        <Form.Control type="text" placeholder="" name="logoprofile" onChange={handleChange}/>
                      </FloatingLabel>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button variant="danger" onClick={addprofile}>
                      Yes, add Profile
                  </Button>
                  </Modal.Footer>
              </Modal> 
            </div>
        )
    }
}

export default SpacesView