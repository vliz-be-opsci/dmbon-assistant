import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';
import {AiOutlineLink} from 'react-icons/ai';

function SpecificProfile() {
    //define all constants first
    //All the functions here
    const {ProfileId} = useParams();
    const [Loading, setLoading] = useState(true); 
    const [profileData, setProfilesData] = useState({});
    const [spaceData, setSpacesData] = useState([{}]);

    //function to perform axios request to get the profile
    const fetchProfile = async () => {
        setLoading(true);
        axios.get(BASE_URL_SERVER+'apiv1/profiles/'+ProfileId)
        .then(res => {
            console.log(res.data);
            setProfilesData(res.data);
        }
        )
        .catch(error => {
            console.log(error);
            alert('There was an error!', error);
        }
        );
    }

    //function that gets all the spaces and then goes over each one of them to get all the spaces that use this profile
    const fetchSpaces = async () => {
        setLoading(true);
        axios.get(BASE_URL_SERVER+'apiv1/spaces/')
        .then(res => {
            console.log(res.data);
            console.log(ProfileId);
            //loop over the res.data and sort out the items if they use this profile
            var spaces_array = [];
            for (var i = 0; i < res.data.length; i++) {
                console.log(res.data[i].RO_profile);
                if (res.data[i].RO_profile == ProfileId) {
                    spaces_array.push(res.data[i]);
                }
            }
            setSpacesData(spaces_array);
            setLoading(false);
        }
        )
        .catch(error => {
            console.log(error);
            setLoading(false);
            alert('There was an error!', error);
        }
        );
    }

    useEffect(() => {
        fetchProfile();
        fetchSpaces();
    }, []);

    //child component that will check if the valie of the profiledata[key] is a url => if url then display hyperlink else just display text 
    const displayProfileData = (props) => {
        var key= props.key;
        if (profileData[key] != null && profileData[key].includes("http")) {
            return (<><a href={profileData[key]} target="_blank"><AiOutlineLink></AiOutlineLink>: {profileData[key]}</a></>)
        } else {
            return profileData[key];
        }
    }

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
                <table id="profiles_table" className='table-sort table_vliz'>
                    <thead>
                        <tr>
                            <th colSpan={2}>Main info profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(profileData).map((key, index) => {
                            return (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td className='no-overflow'>{displayProfileData({key:key})}</td>
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
                            <th colSpan={2}>Local Datacrates that use this profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spaceData.map((space, index) => {
                            var datacrate_name = space.storage_path.split("/")[space.storage_path.split("/").length-1];
                            datacrate_name = datacrate_name.split("\\")[datacrate_name.split("\\").length-1];
                            var url_link = window.location.origin + '/Datacrates/'+space.name;
                            return(
                                <>
                                <tr key={index}>
                                    <td><a href={url_link}>{datacrate_name}</a></td>
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

export default SpecificProfile;