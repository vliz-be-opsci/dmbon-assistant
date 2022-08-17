import {Alert, Button} from 'react-bootstrap';
import AnnotationValidationErrorRow from '../AnnotationValidationErrorRow/AnnotationValidationErrorRow';
import './AnnotationValidationErrorOverview.css';
function ButtonShow(showerror,setshowerror) {
  if(showerror){
    return (
      <Button  style={{width: '100%'}} variant="danger" onClick={() => setshowerror(false)}>
        Hide errors
      </Button>
    )
  }
  else{
    return (
      <Button style={{width: '100%'}} variant="danger" onClick={() => setshowerror(true)}>
        Show errors
      </Button>
    )
  }

}

const AnnotationValidationErrorOverview = (shacl_requirements,showerror, setshowerror,spaceList,datacrate_uuid,file_name,postAnnotationFile,setAddingAnnotation,postBlanknodeFile) => {

  const sr = shacl_requirements;

  try {
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
      if (sr[0]["http://www.w3.org/ns/shacl#conforms"][0]["@value"] == false) {
        return (
          <>
            <Alert className="annotation_alart" variant="danger" >
              <Alert.Heading>Requirements not met</Alert.Heading>
              <p>
                <b>{ammount_violations} errors have to be fixed to be compliant to the current project. </b>
              </p>
              {ButtonShow(showerror,setshowerror)}
            </Alert>
            {showerror ? (
              <>
                {manipulated_array.map(violation =>
                    <>
                      {AnnotationValidationErrorRow(
                        violation.predicate_name,
                        violation.severity_error,
                        violation.constraint_props,
                        violation.resultMessage,
                        spaceList,
                        datacrate_uuid,
                        file_name,
                        postAnnotationFile,
                        setAddingAnnotation,
                        postBlanknodeFile
                      )}
                    </>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      }else{
        return (
          <>
            <Alert className="annotation_alart" variant="success" onClose={() => setShowAlert(false)} >
              <Alert.Heading>Requirements met</Alert.Heading>
              <p>
                File is compliant to the current project.
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

export default AnnotationValidationErrorOverview
