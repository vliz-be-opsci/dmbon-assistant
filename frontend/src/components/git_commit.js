import 'bootstrap/dist/css/bootstrap.min.css';
import '.././css/spinner.css';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import React, {useState, useEffect, useRef} from 'react';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import ReactLoading from 'react-loading';
import {Accordion, Form, Button} from 'react-bootstrap';

function GitCommit() {
    const [GitDiff, setGitDiff] = useState("") 
    const [Loading, setLoading] = useState(true) 
    const {SpaceId} = useParams();
    //get the info of the profiles
    const fetchGitDiff = async () => {
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/status/`)
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

    const submitform = event => {
        //prevent reload page
        event.preventDefault();
        //get the form data
        const summary_message = event.target.elements.git_commit_summary.value;
        console.log(event.target.elements.git_commit_summary.value);
        //do axios request to post to submit all the changes to git 
        setLoading(true);
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/commit`,{message: summary_message})
        .then(response => {setLoading(false);window.location.reload();})
        .catch(error => {
        setLoading(false);
        alert('There was an error!', error);
        });
    }

    if(Loading){
        return(
            
            <div class="busy">
                <p>View differences: 
                <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
                </p>
            </div>
        )
    }else{
        return (
            <div>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        
                        <Accordion.Header>Overview of your local unstaged changes</Accordion.Header>
                        <Accordion.Body>
                            <ReactGhLikeDiff
                                diffString={GitDiff}
                            /> 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                    <Accordion.Header>document your unstaged changes </Accordion.Header>
                        <Accordion.Body>
                        <Form onSubmit={submitform}>
                            <Form.Group className="mb-3" controlId="git_commit_summary">
                                <Form.Label>Summary</Form.Label>
                                <Form.Control as="textarea" placeholder="explantion for these changes"/>
                            </Form.Group>
                            <Button variant="success" type="submit" className="large">
                                Submit Commit 
                            </Button>
                        </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }

    
}

export default GitCommit