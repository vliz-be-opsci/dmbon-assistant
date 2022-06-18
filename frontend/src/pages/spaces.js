import React, {useState, useEffect, useRef} from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
function SpacesPage() {

//define all constants first

  const [Loading, setLoading] = useState(false); 
  const [spaces, setSpaces] = useState([{}]);
 

  //useEffect to fetch data from the API
  useEffect(() => {
    setLoading(true);
    axios.get(BASE_URL_SERVER+'apiv1/projects/')
    .then(res => {
      setSpaces(res.data);
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
            <table id="spaces_table" className='table-sort table_vliz'>
                <thead>
                    <tr>
                        <th colSpan={2}>Overview Spaces</th>
                    </tr>
                    <tr>
                        <th>name</th>
                        <th>api url</th>
                    </tr>
                </thead>
                <tbody>
                    {spaces.map(space => (
                        <tr key={space.id}>
                            <td><a href={'/Spaces/' + space.uuid}>{space.name}</a></td>
                            <td className='no-overflow'><a href={space.url_project} target='_blank'>{space.url_project}</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </>
      )
    }
    
}

export default SpacesPage