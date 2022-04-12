import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {Table} from 'react-bootstrap';
import ReactLoading from 'react-loading';

function SpacesView(props) {
    //define const usestates first 
    const [profilesList, setProfilesList] = useState([{}]);
    const [spacesListData, setSpacesListData] =  useState([{}]);
    const [Loading, setLoading] = useState(true); 
    //get the info of the profiles
    const fetchProfiles = async () => {
        axios.get(BASE_URL_SERVER+'apiv1/profiles/')
          .then(res => {
            console.log(res.data);
            setProfilesList(res.data);
            spacesList(res.data);
          })
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
        setLoading(false);
    }
    useEffect(() => {
        fetchProfiles();
    },[]);
    //link the profiles to the space id
    if(Loading){
        return(
          <div class="busy">
              <ReactLoading type='bars' color='grey' height={'20vw'} width={'20vw'} />
          </div>
        )
    }else{
        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>space name</th>
                            <th>profile</th>
                            <th>storage-path</th>
                        </tr>
                    </thead>
                    <tbody>
                    {spacesListData.map(space =>
                        <tr>
                            <td><a href={'/spaces/' + space.name }>{space.truespacename}</a></td>
                            <td>{space.trueprofilename}</td>
                            <td>{space.storage_path}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>  
            </div>
        )
    }
}

export default SpacesView