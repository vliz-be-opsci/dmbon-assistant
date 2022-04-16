import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import ReactLoading from 'react-loading';
import {Alert} from 'react-bootstrap';

function AlertShaclReq(props) {
    //constants
    const {SpaceId} = useParams();
    const [Loading, setLoading] = useState(false) 
    const [Error, setError] = useState(true) 
    const predicate_name = props.predicate_name;
    const severity_error = props.severity_error;
    const shacl_requirements = props.shacl_requirements;

    //functions


    if(Loading){
        return(
            <div>
                <ReactLoading type='bars' color='blue' height={'3vw'} width={'3vw'} />
            </div>
        )
    }else{
        if(severity_error == "Violation"){
            return(
                <>
                    <Alert variant="danger"><h1>{predicate_name}</h1></Alert>
                </>
            )
        }
        if(severity_error == "Warning"){
            return(
                <>
                    <Alert variant="warning"><h1>{predicate_name}</h1></Alert>
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
    }   
}

export default AlertShaclReq