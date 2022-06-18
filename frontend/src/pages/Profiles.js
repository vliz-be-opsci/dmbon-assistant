import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';

function ProfilesPage() {

//define all constants first

  const [Loading, setLoading] = useState(true); 
  const [profiles, setProfiles] = useState([{}]);

  //useEffect to fetch data from the API
  useEffect(() => {
    setLoading(true);
    axios.get(BASE_URL_SERVER+'apiv1/profiles/')
    .then(res => {
      setProfiles(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
    }
    )
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
            <br />
            <table id="profiles_table" className='table-sort table_vliz'>
                <thead>
                    <tr>
                        <th colSpan={2}>Overview Profiles</th>
                    </tr>
                    <tr>
                        <th>name</th>
                        <th>api url</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map(profile => (
                        <tr key={profile.id}>
                            <td><a href={'/Profiles/' + profile.uuid}>{profile.name}</a></td>
                            <td className='no-overflow'><a href={profile.url_space} target='_blank'>{profile.url_space}</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </>
      )
    }
    
}

export default ProfilesPage