import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';
import GitCommit from '../components/git_commit.js';
import GitHistory from '../components/git_history.js';

function NewGitPage() {

    //define all constants first
    const [Loading, setLoading] = useState(false); 
    const {SpaceId} = useParams();
    const [message, setMessage] = useState("commit");
    //All the functions here

    //function that will send axios request to server to push git commit
    const sendPush = () => {
        console.log('pushing to git repo');
        setLoading(true);
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/push`,{})
            .then(response => {setLoading(false);window.location.reload();})
            .catch(error => {
            setLoading(false);
            alert(error);
        });
    }

    //function that will send axios request to server to pull git commit
    const getPull = () => {
        console.log('pulling from git repo');
        setLoading(true);
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/pull`,{})
            .then(response => {this.setLoading(false);window.location.href = `/spaces/${SpaceId}/all_files`;})
            .catch(error => {
            setLoading(false);
            console.log(error);
            alert(error);
        });
    }

    //component to determine whether to display the history or the commit component
    const Displaygit = () => {
        if(message == "commit"){
            return <GitCommit />;
        }
        if(message == "history"){
            return <GitHistory />;
        }
    }


    if(Loading){
      return(
        <div class="busy">
            <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
        </div>
      )
    }else{
        return (
          <>
            <button onClick={() => getPull()} id="pull_btn" type="button" style={{width:"23%",margin:"10px"}} class="button_vliz">Pull</button>
            <button onClick={() => setMessage("commit")} id="commit_btn" type="button" style={{width:"23%",margin:"10px"}} class="button_vliz" >Commit</button>
            <button onClick={() => sendPush()} id="push_btn" type="button" style={{width:"23%",margin:"10px"}} class="button_vliz">Push</button>
            <button onClick={() => setMessage("history")} id="history_btn" type="button" style={{width:"23%",margin:"10px"}} class="button_vliz">History</button>
            <hr></hr>
            <Displaygit />
          </>
      )
    }
}

export default NewGitPage