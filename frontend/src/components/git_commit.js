import 'bootstrap/dist/css/bootstrap.min.css';
import '.././css/spinner.css';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import ReactLoading from 'react-loading';
import {Accordion} from 'react-bootstrap';

function GitCommit() {
    const [GitDiff, setGitDiff] = useState("") 
    const [Loading, setLoading] = useState(true) 
    const {SpaceId} = useParams();
    //get the info of the profiles
    const fetchGitDiff = async () => {
        axios.get(`http://localhost:6656/apiv1/spaces/${SpaceId}/git/status`)
          .then(res => {
            console.log(res.data.data)
            let arrayLength = res.data.data.length;
            let alldiffstring = "";
            for (let i = 0; i < arrayLength; i++) {
                console.log(res.data.data[i]);
                //Do something
                alldiffstring+= res.data.data[i]['text']
            }
            setGitDiff(alldiffstring);
            setLoading(false);
            console.log(alldiffstring);
            //setGitDiff(res.data.data)
          })
      }
      // if the total diff length text is bigger then 1500 characters, give back a table with expandable items per diff
    
    useEffect(() => {
        fetchGitDiff();
    },[]);

    if(Loading){
        return(
            
            <div class="busy">
                <p>View differences: 
                <ReactLoading type='bars' color='blue' height={'20vw'} width={'20vw'} />
                </p>
            </div>
        )
    }else{
        return (
            <div>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Commit form</Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                        est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Space differences</Accordion.Header>
                        <Accordion.Body>
                            <ReactGhLikeDiff
                                diffString={GitDiff}
                            /> 
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }

    
}

export default GitCommit