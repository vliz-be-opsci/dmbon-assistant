import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Table} from 'react-bootstrap';

function SpacesView(props) {
    //define const usestates first 
    const [profilesList, setProfilesList] = useState([{}]) 

    //get the info of the profiles
    const fetchProfiles = async () => {
        axios.get(process.env.REACT_APP_BASE_URL_SERVER+'apiv1/profiles/')
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
            {props.listspace.map(space =>
                <ul>
                    <a href={'/spaces/' + space.name }>
                        <button className="bg-info">
                            <div >
                                <h5>
                                    space id : {space.name}
                                </h5>
                                <h6>
                                    profile : {space.RO_profile}
                                </h6>
                                <h6>
                                    storage-path : {space.storage_path}
                                </h6>
                            </div>
                        </button>
                    </a>
                </ul>
            )}
        </div>
    )

    return (
        <div>
            {props.listspace.map(space =>
                <ul>
                    <a href={'/spaces/' + space.name }>
                        <button className="bg-info">
                            <div >
                                <h5>
                                    space id : {space.name}
                                </h5>
                                <h6>
                                    profile : {space.RO_profile}
                                </h6>
                                <h6>
                                    storage-path : {space.storage_path}
                                </h6>
                            </div>
                        </button>
                    </a>
                </ul>
            )}
        </div>
    )
}

export default SpacesView