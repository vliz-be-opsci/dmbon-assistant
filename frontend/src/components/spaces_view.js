import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {Table} from 'react-bootstrap';

function SpacesView(props) {
    //define const usestates first 
    const [profilesList, setProfilesList] = useState([{}]) 

    //get the info of the profiles
    const fetchProfiles = async () => {
        axios.get(BASE_URL_SERVER+'apiv1/profiles/')
          .then(res => {
            console.log(res.data)
            setProfilesList(res.data)
          })
      }
    
    useEffect(() => {
    fetchProfiles();
    },[]);
    //link the profiles to the space id
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>space id</th>
                        <th>profile</th>
                        <th>storage-path</th>
                    </tr>
                </thead>
                <tbody>
                {props.listspace.map(space =>
                    <tr>
                        <td><a href={'/spaces/' + space.name }>{space.name}</a></td>
                        <td>{space.RO_profile}</td>
                        <td>{space.storage_path}</td>
                    </tr>
                )}
                </tbody>
            </Table>  
        </div>
    )
}

export default SpacesView