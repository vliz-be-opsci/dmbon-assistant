import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import FilesView from './../components/files_view';

function SpaceSpecificPage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const countRef = useRef(0);
  const {SpaceId} = useParams();
  //All the functions here

  const fetchSpaces = async () => {
    axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/content`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data)
        countRef.current++;
      })
  }

  useEffect(() => {
    fetchSpaces();
  },[]);

    return (
        <div>
            <h5 className="card text-white bg-dark">Specific Space : {SpaceId}</h5>
            <div>
            <FilesView listfiles= {spaceList} />
            </div>
            <div>Number of changes to page: {countRef.current}</div>
        </div>
    )
}

export default SpaceSpecificPage