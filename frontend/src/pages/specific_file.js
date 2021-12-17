import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import FileAnnotationView from './../components/file_annotation_view';

function FileSpecificPage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([]) 
  const countRef = useRef(0);
  const {SpaceId} = useParams();
  const {FileId}  = useParams();
  //All the functions here

  const fetchSpaces = async () => {
    axios.get(process.env.REACT_APP_BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/annotation/file/${FileId}`)
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data.data)
        countRef.current++;
      })
  }

  useEffect(() => {
    fetchSpaces();
  },[]);

    return (
        <div>
            <h5 className="card text-white bg-dark">Space : {SpaceId}</h5>
            <h5 className="card text-white bg-info">File : {FileId}</h5>
            <div>
            <FileAnnotationView listannotations={spaceList} />
            </div>
            <div>Number of changes to page: {countRef.current}</div>
        </div>
    )
}

export default FileSpecificPage