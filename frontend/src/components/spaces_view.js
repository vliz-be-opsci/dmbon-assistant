import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {BASE_URL_SERVER} from '../App.js';
import {Form, FloatingLabel, Modal, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { FaPlus} from 'react-icons/fa';
import {MdOpenInBrowser} from "react-icons/md";

axiosRetry(axios, { retries: 3 });

function SpacesView(props) {
    //define const usestates first 
    const [profilesList, setProfilesList] = useState([{}]);
    const [profileList, setProfileseList] = useState([{}]);
    const [spacesListData, setSpacesListData] =  useState([{}]);
    const [show, setShow] = useState(false);
    const [Loading, setLoading] = useState(true); 
    const [profileSelected, setProfileSelect] = useState("") ;
    const [storagepathSelected, setStoragepath] = useState("") ;
    const [URLSelected, setURLSelect] = useState("") ;
    const [NameSelected, setNameSelect] = useState("") ;
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
            setProfilesList(res.data);
            setTimeout(() => {  spacesList(res.data); }, 2000);
          })
      }

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
            .then(response => {setLoading(false);window.location.href = `/spaces`;})
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
    }

    //transform spaces info 
    const spacesList = async (profiledata) => {
        setLoading(true);
        var spacelistmetadata = [];
        console.log(Object.keys(profiledata).length);
        console.log(profiledata);
        console.log(props.listspace);
        for (let index = 0; index < props.listspace.length; index++) {
            var spacelistdata = {}
            for (let inde = 0; inde < Object.keys(props.listspace[index]).length; inde++) {
                const element = Object.keys(props.listspace[index])[inde];
                var value = Object.values(props.listspace[index])[inde];
                spacelistdata[element] = value;
            }
            console.log(props.listspace);
            var space_name_array = props.listspace[index]["storage_path"];
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
                    if(Object.values(Object.values(profiledata)[ind])[i] == props.listspace[index]["RO_profile"]){
                        console.log( Object.values(profiledata)[ind]["name"]);
                        spacelistdata["trueprofilename"] = Object.values(profiledata)[ind]["name"];
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

    const OpenBrowserSpace = async (spaceid) => {
        var spaceid = spaceid;
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${spaceid}/content/openexplorer`)
          .then(res => {
            console.log(res)
          })
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
                            <th>datacrate name</th>
                            <th>profile</th>
                            <th>storage-path</th>
                        </tr>
                    </thead>
                    <tbody>
                    {spacesListData.map(space =>
                        <tr>
                            <td><a href={'/spaces/' + space.name }>{space.truespacename}</a></td>
                            <td>{space.trueprofilename}</td>
                            <td>
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoveropenfilebrowser}>
                                <button onClick={() => OpenBrowserSpace(space.name)}>
                                    <MdOpenInBrowser></MdOpenInBrowser>
                                </button>
                            </OverlayTrigger>
                            </td>
                        </tr>
                    )}
                    <tr>
                       <td colSpan="3"><Button variant="danger" onClick={handleShow} style={{width: '100%'}}><FaPlus></FaPlus></Button></td> 
                    </tr>
                    </tbody>
                </table> 
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                  <Modal.Title>Add Space</Modal.Title>
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
                  <Button variant="danger" onClick={addspace}>
                      Yes, add space
                  </Button>
                  </Modal.Footer>
              </Modal> 
            </div>
        )
    }
}

export default SpacesView