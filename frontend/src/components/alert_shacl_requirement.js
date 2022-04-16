import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import ReactLoading from 'react-loading';
import {Alert} from 'react-bootstrap';

function AlertShaclReq(props) {
    //constants
    const {SpaceId} = useParams();
    const [Loading, setLoading] = useState(false) 
    const [Error, setError] = useState(true) 
    const [show, setShow] = useState(true);
    const predicate_name = props.predicate_name;
    const severity_error = props.severity_error;
    const constraint_props = props.constraint_props;
    const result_message = props.result_message;
    //functions

    function Alertlogsprops(props) {
        var shacl_requirements = props.shacl_requirements;
        console.log(shacl_requirements);
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
        //make javascript function that check for the ammount of rows in the table and return the number of rows

        if(in_value){return(<>{in_value_value}</>)}
        return(<>{minCount}</>)
    }


    if(Loading){
        return(
            <div>
                <ReactLoading type='bars' color='blue' height={'3vw'} width={'3vw'} />
            </div>
        )
    }else{
        if (show) {
            if(severity_error == "Violation"){
                return(
                    <>
                        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>{predicate_name}</Alert.Heading>
                            <p>{result_message}</p>
                            <Alertlogsprops shacl_requirements={constraint_props}></Alertlogsprops>
                        </Alert>
                    </>
                )
            }
            if(severity_error == "Warning"){
                return(
                    <>
                        <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>{predicate_name}</Alert.Heading>
                            <p>{result_message}</p>
                            <Alertlogsprops shacl_requirements={constraint_props}></Alertlogsprops>
                        </Alert>
                    </>
                )
            }
            else{
                return(
                    <>
                        <Alert variant="info"><h1>{predicate_name}</h1></Alert>
                    </>
                )
            }
        } else {
            return(<></>);
        }
    }   
}

export default AlertShaclReq