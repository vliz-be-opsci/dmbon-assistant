import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';
import {AiOutlineLink} from 'react-icons/ai';

function SpecificSpace() {
    //define all constants first
    //All the functions here
    const {SpaceId} = useParams();
    const [Loading, setLoading] = useState(false); 
    const [spaceData, setSpacesData] = useState({});
    const [profileData, setProfilesData] = useState([{}]);

    //function to perform axios request to get the profile
    const fetchSpace = () => {
        setLoading(true);
        console.log(SpaceId);
        axios.get(BASE_URL_SERVER+'apiv1/projects/'+ SpaceId)
        .then(res => {
            console.log(res.data);
            setSpacesData(res.data);
        }
        )
        .catch(error => {
            console.log(error);
        }
        );
    }

    //function that will fetch all profiles
    const fetchProfiles = () => {
        setLoading(true);
        axios.get(BASE_URL_SERVER+'apiv1/profiles/')
        .then(res => {
            console.log(res.data);
            //loop over the res.data and sort out the items if they use this profile
            var spaces_array = [];
            for (var i = 0; i < res.data.length; i++) {
                try {
                    console.log(res.data[i]);
                    console.log(res.data[i].parent_space);
                    console.log(spaceData["name"]);
                    if (res.data[i].parent_space == spaceData.name) {
                        spaces_array.push(res.data[i]);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            setProfilesData(spaces_array);
            setLoading(false);
        }
        )
        .catch(error => {
            console.log(error);
        }
        );
    }

    //child component that will check if the valie of the profiledata[key] is a url => if url then display hyperlink else just display text 
    const displaySpaceData = (props) => {
        var key= props.key;
        if (spaceData[key] != null && spaceData[key].includes("http")) {
            return (<><a href={spaceData[key]} target="_blank"><AiOutlineLink></AiOutlineLink>: {spaceData[key]}</a></>)
        } else {
            return spaceData[key];
        }
    }

    useEffect(() => {
        fetchSpace();
        fetchProfiles();
    }, []);

    if(Loading){
        return(
            <div class="busy">
                <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
            </div>
        )
    }else{
        return (
            <>
                <br></br>
                <table id="spaces_table" className='table-sort table_vliz'>
                    <thead>
                        <tr>
                            <th colSpan={2}>Main info space</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(spaceData).map((key, index) => {
                            return (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td>{displaySpaceData({key:key})}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>  
                <br></br>
                <table id="spaces_table" className='table-sort table_vliz'>
                    <thead>
                        <tr>
                            <th colSpan={2}>Local Profiles that use this space</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profileData.map((space, index) => {
                            var url_link = window.location.origin + '/Profiles/'+space.uuid;
                            return(
                                <>
                                <tr key={index}>
                                    <td><a href={url_link}>{space.name}</a></td>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </>
        )
    }
}

export default SpecificSpace;