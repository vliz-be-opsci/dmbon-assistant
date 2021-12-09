import ProgressBar from 'react-bootstrap/ProgressBar'
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import ReactLoading from 'react-loading';

function PredicateProgressbar(props) {

    const filename = props.filee;
    // get space from url
    const {SpaceId} = useParams();
    const [Loading, setLoading] = useState(true) 
    const [Error, setError] = useState(true) 

    // fetch the desired info about the file
    //define const usestates first 
    const [FileSummary, setFileSummary] = useState([{}]) 

    //get the info of the profiles
    const fetchFileSummary = async () => {
        axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/annotation/file/${filename}`)
          .then(res => {
            console.log(res.data.summary)
            setFileSummary(res.data.summary)
            setError(false);
            setLoading(false);
          }).catch(error => {
            setLoading(false);
            console.log(error);
          });
    }
    
    useEffect(() => {
        fetchFileSummary();
    },[]);


    if(Loading){
        return(
            <div>
                <ReactLoading type='bars' color='blue' height={'3vw'} width={'3vw'} />
            </div>
        )
    }else{
        if (Error){
            return(
                <div>
                File not found in ro-crate-metadata.json
                </div>
            )
        }else{
            return (
                <div>
                    <ProgressBar>
                        <ProgressBar animated striped variant="success" now={FileSummary["green"]} key={1} />
                        <ProgressBar animated striped variant="warning" now={FileSummary["orange"]} key={2} />
                        <ProgressBar animated striped variant="danger" now={FileSummary["red"]} key={3} />
                    </ProgressBar>
                </div>
            )
        }
        
    }   
}

export default PredicateProgressbar