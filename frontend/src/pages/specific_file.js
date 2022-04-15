import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FileAnnotationView from './../components/file_annotation_view';
import {Alert} from 'react-bootstrap';

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
            <h1>Checking if requirements are met...</h1>
          </div>
        )
      }else{
        console.log(sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"]);
        try{var ammount_violations = sr[0]["http://www.w3.org/ns/shacl#result"].length;}
        catch(error){console.log(error);var ammount_violations = 0;}
        // start manipulating the sr to be able to render more advanced alerts
        var manipulated_array = [];
        for (var i = 0; i < sr.length; i++) {
          var current_node_dict = {};
          console.log(sr[i]);
          console.log(Object.keys(sr[i]));
          if(Object.keys(sr[i]).includes("@type") && Object.keys(sr[i]).includes("http://www.w3.org/ns/shacl#focusNode")){
            //get name of predicate from result path 
            console.log(sr[i]["http://www.w3.org/ns/shacl#resultPath"]);
            var array_name_predicate = sr[i]["http://www.w3.org/ns/shacl#resultPath"][0]["@id"].split("/");
            var predicate_name = array_name_predicate[array_name_predicate.length-1];
            console.log(predicate_name);
            //get more info of error from sourceshape

          }
          manipulated_array.push(current_node_dict);
        }
        if (sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"] === false) {
          return (
            <>
              <Alert variant="danger">
                <Alert.Heading>Requirements not met</Alert.Heading>  
                <p>
                  {ammount_violations} predicates are still required for {FileId} to be compliant to the current project.
                </p>
              </Alert>
            </>
          )
        }else{
          return (
            <>
              <Alert variant="success">
                <Alert.Heading>Requirements met</Alert.Heading>  
                <p>
                  {FileId} is compliant to the current project.
                </p>
              </Alert>
            </>
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
            <p></p>
            <Alertlogs shacl_requirements={shaclRequirements}/>
            <div>
            <FileAnnotationView listannotations={spaceList}/>
            </div>
        </div>
    )
}

export default FileSpecificPage