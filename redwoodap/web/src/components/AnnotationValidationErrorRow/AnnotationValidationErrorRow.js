import { Link, routes } from '@redwoodjs/router'
import {GoDiffAdded} from 'react-icons/go';
import {Alert, Form, Button} from 'react-bootstrap';
import './AnnotationValidationErrorRow.css'

const AnnotationValidationErrorRow = (predicate_name,severity_error, constraint_props, result_message, spacelist_data,datacrate_uuid,file_name,postAnnotationFile,setAddingAnnotation,postBlanknodeFile) => {
let predicate_value = ""
//function that changes the value of the input
const handleChange = (event) => {
  predicate_value = event.target.value;
}

//function that perform a axios post request to add predicate to the file
const addPredicate = async () => {
  console.log("adding predicate");
  console.log(datacrate_uuid);
  console.log(file_name);
  console.log(predicate_name);
  console.log(predicate_value);

  //format the filename to be uri compliant
  let formatted_filename = encodeURIComponent(file_name);
  //make the payload according to following standards: {"Annotations": [{"URI_predicate_name": "string","value": "string"}]}
  let payload = {
    "Annotations": [
      {
        "URI_predicate_name": predicate_name,
        "value": predicate_value
      }
    ]
  }
  setAddingAnnotation(true);
  //check if predicate and value length is more then 0 and if so post the annotation
  if(predicate_value.length > 0){
    postAnnotationFile(datacrate_uuid, formatted_filename, payload).then(res => {
      setAddingAnnotation(false);
    }).catch(err => {
      setAddingAnnotation(false);
    }
    );
  }
}

//function that perform an axios post request to add a blank node to the metadata file
const addBlankNode = async (e) => {
  //change the frist letter of uri_predicate to uppercase
  console.log("adding blank node");
  console.log(predicate_name);
  let formatted_filename = encodeURIComponent(file_name);
  let payload = {
    "URI_predicate_name": predicate_name,
    "node_type": predicate_name
  }
  setAddingAnnotation(true);
  postBlanknodeFile(datacrate_uuid, formatted_filename, payload).then(res => {
    console.log(res);
    setAddingAnnotation(false);
  }
  ).catch(err => {
    console.log(err);
    setAddingAnnotation(false);
  }
  );

}

function Alertlogsprops(props) {
    var shacl_requirements = props.shacl_requirements;
    console.log(shacl_requirements);
    //check if any key in the array shacl_requirements is node
    var isnode = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("node")){
            isnode = true;
            try {
                var node_value_array = shacl_requirements[i]["node"][0]["@id"].split("/");
                var node_value_shape_array = node_value_array[node_value_array.length-1].split("Shape");
                var node_value = node_value_shape_array[0];
                console.log(node_value);
            } catch (error) {
                console.log(error);
            }
        }
    }

    //check fi the result_message contains "Value does not conform to Shape "
    var node_in_graph = false;
    if(result_message.includes("Value does not conform to Shape ")){
        node_in_graph = true;
        console.log(spacelist_data);
        //loop through spacelist_data to find predicate that equals the predicate_name and return the value of the node
        for (var i = 0; i < spacelist_data.length; i++) {
            if(spacelist_data[i]["predicate"] === predicate_name){
                console.log(spacelist_data[i]["value"]);
                var button_node_value = spacelist_data[i]["value"];
                var href_button_node_value = spacelist_data[i]["value"].split("nodeshape: ")[1];
            }
        }
    }

    //check if any key in the array shacl_requirements is minCount
    var minCount = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("minCount")){
            minCount = true;
            var minCount_value = shacl_requirements[i]["minCount"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is maxCount
    var maxCount = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("maxCount")){
            maxCount = true;
            var maxCount_value = shacl_requirements[i]["maxCount"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is minExclusive
    var minExclusive = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("minExclusive")){
            minExclusive = true;
            var minExclusive_value = shacl_requirements[i]["minExclusive"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is maxExclusive
    var maxExclusive = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("maxExclusive")){
            maxExclusive = true;
            var maxExclusive_value = shacl_requirements[i]["maxExclusive"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is minInclusive
    var minInclusive = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("minInclusive")){
            minInclusive = true;
            var minInclusive_value = shacl_requirements[i]["minInclusive"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is maxInclusive
    var maxInclusive = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("maxInclusive")){
            maxInclusive = true;
            var maxInclusive_value = shacl_requirements[i]["maxInclusive"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is minLength
    var minLength = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("minLength")){
            minLength = true;
            var minLength_value = shacl_requirements[i]["minLength"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is maxLength
    var maxLength = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("maxLength")){
            maxLength = true;
            var maxLength_value = shacl_requirements[i]["maxLength"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is pattern
    //im not sure about this one , need to figure out what it means #TODO
    var pattern = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("pattern")){
            pattern = true;
            var pattern_value = shacl_requirements[i]["pattern"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is datatype
    var datatype = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("datatype")){
            datatype = true;
            var datatype_value = shacl_requirements[i]["datatype"][0]["@value"];
        }
    }
    //check if any key in the array shacl_requirements is in
    var in_value = false;
    for (var i = 0; i < shacl_requirements.length; i++) {
        if(Object.keys(shacl_requirements[i]).includes("in")){
            in_value = true;
            var in_value_value = [];
            for (var j = 0; j < shacl_requirements[i]["in"][0]["@list"].length; j++) {
                in_value_value.push(shacl_requirements[i]["in"][0]["@list"][j]["@value"]);
            }
        }
    }

    //make submitbutton based on the violation type (warning/violation)
    const SubmitButton = (component) => {
        console.log(component);
        if(component.severity == "Warning"){
            return (
                <Button variant="warning" className='severitybutton' onClick={(e) => addPredicate(e)}>
                    <GoDiffAdded/>
                </Button>
            );
        }
        if(component.severity == "Violation"){
            return (
                <Button variant="danger" className='severitybutton' onClick={(e) => addPredicate(e)}>
                    <GoDiffAdded/>
                </Button>
            );
        }
        return (
            <Button variant="info" className='severitybutton' onClick={(e) => addPredicate(e)}>
                <GoDiffAdded/>
            </Button>
        );
    }

    //make const that determines if there will be a free input text or a selected list
    if(in_value){
        return(
            <>
                <Form>
                    <table>
                        <tr>
                            <td style={{"width":"15%"}}><b>{predicate_name}:</b></td>
                            <td style={{"width":"100%"}}>
                            <Form.Group><Form.Select onChange={(e) => handleChange(e)} aria-label="Default select example">
                                <option>Select option</option>
                                {in_value_value.map(in_value_option =>
                                    <option>{in_value_option}</option>
                                )}
                            </Form.Select></Form.Group>
                            </td>
                            <td style={{"width":"6%"}}><SubmitButton severity={severity_error} onClick={(e) => addPredicate(e)}></SubmitButton></td>
                        </tr>
                    </table>
                </Form>
            </>
        )
    }else{
        // determine here if the the node value to add is a node or not
        if(isnode){
            if(node_in_graph){
                return(
                    <>
                        <Form>
                            <table>
                                <tr>
                                    <td style={{"width":"15%"}}><b>{predicate_name}:</b></td>

                                    <td colSpan="2" style={{"width":"100%"}}>
                                      <Link to={routes.specificDatacratePageNode({ datacrate_id: datacrate_uuid , node_id: href_button_node_value})}>
                                      {button_node_value}
                                      </Link>
                                      </td>
                                </tr>
                            </table>
                        </Form>
                    </>
                )
            }else{
                return(
                    <>
                      <button onClick={(e) => addBlankNode(e)} className="button_vliz space_button">add {predicate_name} node</button>
                    </>
                )
            }
        }else{
            return(
                <>
                    <Form>
                        <table>
                            <tr>
                                <td style={{"width":"15%"}}><b>{predicate_name}:</b></td>
                                <td style={{"width":"100%"}}><Form.Group><Form.Control type="text" onChange={(e) => handleChange(e)} placeholder="Enter value" aria-label="Default select example"/></Form.Group></td>
                                <td style={{"width":"6%"}}><SubmitButton severity={severity_error} onClick={(e) => addPredicate(e)}></SubmitButton></td>
                            </tr>
                        </table>
                    </Form>
                </>
            )
        }

    }

    //make javascript function that check for the ammount of rows in the table and return the number of rows
  }

  //make function that will show result message when clicked
  const ResultMessage = () => {
      return(
        <>
            <p>{result_message}</p>
        </>
      )
  }

  //make const that will show a button that toggles the showViolationDescription
  const ToggleButton = (props) => {
    let severity = "";
    if(props.severity == "Warning"){
        severity = "warning";
    }
    if(props.severity == "Violation"){
        severity = "danger";
    }
    if(props.severity != "Warning" && props.severity != "Violation"){
        severity = "info";
    }
  }


  if(severity_error == "Violation"){
      return(
          <>
              <Alert className='annotation_alart' variant="danger">
                  {Alertlogsprops({shacl_requirements: constraint_props})}
                  {ResultMessage()}
              </Alert>
          </>
      )
  }
  if(severity_error == "Warning"){
      return(
          <>
              <Alert className='annotation_alart' variant="warning">
                  {Alertlogsprops({shacl_requirements: constraint_props})}
                  {ResultMessage()}
              </Alert>
          </>
      )
  }
  else{
      return(
          <>
              <Alert className='annotation_alart' variant="info">
                  {Alertlogsprops({shacl_requirements: constraint_props})}
                  {ResultMessage()}
              </Alert>
          </>
      )
  }
}

export default AnnotationValidationErrorRow
