import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import FilesView from './../components/files_view';

function HierarchicalSpacePage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([{}]) 
  const url = window.location.href;
  const countRef = useRef(0);
  const {SpaceId} = useParams();
  const folder_get = url.split(SpaceId+"/files/project")[1]
  console.log(folder_get);
  //All the functions here

  const fetchSpaces = async () => {
    axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/content${folder_get}`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data.Data)
        countRef.current++;
      })
  }

  useEffect(() => {
    fetchSpaces();
  },[]);

	if (typeof folder_get !== 'undefined' && folder_get.length > 0) {
			return (
				<div>
						<h5 className="card text-white bg-dark">Specific Space : {SpaceId}</h5>
						<div>
							<FilesView listfiles= {spaceList} />
						</div>
					<div>Number of changes to page: {countRef.current}</div>
				</div>
			)
	}else{
		window.location.href = `/spaces/${SpaceId}/all_files`;
	}
    

    
}

export default HierarchicalSpacePage