import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {useParams} from 'react-router-dom';
import FileAnnotationView from './../components/file_annotation_view';
import {Alert, Button} from 'react-bootstrap';
import AlertShaclReq from './../components/alert_shacl_requirement';

function FileSpecificPage() {

//define all constants first
  const [spaceList, setSpacesList] = useState([]) 
  const {SpaceId} = useParams();
  const {FileId}  = useParams();
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
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

  function ButtonShow() {
    if(show){
      return (
        <Button  style={{width: '100%'}} variant="danger" onClick={() => setShow(false)}>
          Hide errors
        </Button>
      )
    }
    else{
      return (
        <Button style={{width: '100%'}} variant="danger" onClick={() => setShow(true)}>
          Show errors
        </Button>
      )
    }

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
            current_node_dict["predicate_name"] = predicate_name;
            //get more info of severity error from shacl
            var severity_error_array = sr[i]["http://www.w3.org/ns/shacl#resultSeverity"][0]["@id"].split("#");
            var severity_error = severity_error_array[severity_error_array.length-1];
            console.log(severity_error);
            current_node_dict["severity_error"] = severity_error;
            //get the resultMessage from the shacl file 
            var resultMessage= sr[i]["http://www.w3.org/ns/shacl#resultMessage"][0]["@value"];
            console.log(resultMessage);
            current_node_dict["resultMessage"] = resultMessage;
            //get sourceShape node id from the shacl file
            var sourceShape_node = sr[i]["http://www.w3.org/ns/shacl#sourceShape"][0]["@id"];
            console.log(sourceShape_node);
            // loop over all nodes in shacl file and find the node that matches the sourceShape node id
            var constraint_props = []
            for (var j = 0; j < sr.length; j++) {
              if(sr[j]["@id"] == sourceShape_node){
                var toappend_constraint_prop = {}
                //for all other keys in the node dict that are not @id , split the key string with #and take the last element of the resulting array 
                for (var k = 0; k < Object.keys(sr[j]).length; k++) {
                  if(Object.keys(sr[j])[k] != "@id"){
                    var array_name_constraint_property = Object.keys(sr[j])[k].split("#");
                    var constraint_property = array_name_constraint_property[array_name_constraint_property.length-1];
                    //also get all the values of the keys that are not @id
                    var value_constraint_property = sr[j][Object.keys(sr[j])[k]];
                    toappend_constraint_prop[constraint_property] = value_constraint_property;
                    constraint_props.push(toappend_constraint_prop);
                  }
                }
              }
            }
            current_node_dict["constraint_props"] = constraint_props;
          }
          if(Object.keys(current_node_dict).length > 0){
            manipulated_array.push(current_node_dict);
          }
        }
        console.log(manipulated_array);
        if(showAlert){
          if (sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"] === false) {
            return (
              <>
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                  <Alert.Heading>Requirements not met</Alert.Heading>  
                  <p>
                    <b>{ammount_violations} errors  have to be fixed for {FileId} to be compliant to the current project. </b>
                  </p>
                  {ButtonShow()}
                </Alert>
                {manipulated_array.map(violation =>
                    <>
                      <AlertShaclReq 
                        constraint_props={violation.constraint_props}
                        severity_error={violation.severity_error}
                        predicate_name={violation.predicate_name}
                        result_message={violation.resultMessage}
                        show_alert={show}
                        FileId={FileId}
                      />
                    </>
                )}
              </>
            )
          }else{
            return (
              <>
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible >
                  <Alert.Heading>Requirements met</Alert.Heading>  
                  <p>
                    {FileId} is compliant to the current project.
                  </p>
                </Alert>
              </>
            )
          }
        }else{
          return(<></>)
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
            <br/>
        </div>
    )
}

export default FileSpecificPage