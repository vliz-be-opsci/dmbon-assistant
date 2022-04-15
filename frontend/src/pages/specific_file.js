import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FileAnnotationView from './../components/file_annotation_view';

function FileSpecificPage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([]) 
  const {SpaceId} = useParams();
  const {FileId}  = useParams();
  const [shaclRequirements, setShaclRequirements] = useState([]);
  //All the functions here

  const fetchSpaces = async () => {
    axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/annotation/file/${FileId}`)
      .then(res => {
        console.log(res.data);
        setSpacesList(res.data.data);
        console.log(res.data.shacl_requirements);
        setShaclRequirements(res.data.shacl_requirements);
      })
  }

  //have custom component Alertlogs here that displayers alert when red.data.sjacl_requirements[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"] == false
  function Alertlogs(props) {
    try {
      const sr = props.shacl_requirements;
      console.log(sr);
      //if length sr is 0 return loading message
      if (sr.length === 0) {
        return (
          <div>
            <h1>Loading...</h1>
          </div>
        )
      }else{
        console.log(sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"]);
        if (sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"] === false) {
          return (
            <div>
              <h1>Shacl Requirements not met</h1>
            </div>
          )
        }else{
          return (
            <div>
              <h1>Shacl Requirements met</h1>
            </div>
          )
        }
      }
      
    }
    catch (error) {
      return (<><h5>{error}</h5></>)
    }
  }
  

  useEffect(() => {
    fetchSpaces();
  },[]);

    return (
        <div>
            <h5 className="card text-white bg-dark">Space : {SpaceId}</h5>
            <h5 className="card text-white bg-info">File : {FileId}</h5>
            <Alertlogs shacl_requirements={shaclRequirements}/>
            <div>
            <FileAnnotationView listannotations={spaceList}/>
            </div>
        </div>
    )
}

export default FileSpecificPage