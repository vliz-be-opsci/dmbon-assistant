import 'bootstrap/dist/css/bootstrap.min.css';
import '.././css/spinner.css';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import React, {useState, useEffect, useRef} from 'react';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import ReactLoading from 'react-loading';

function GitHistory() {
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
    
    useEffect(() => {
        fetchGitDiff();
    },[]);

    if(Loading){
        return(
            <div class="busy">
                <ReactLoading type='bars' color='blue' height={'20vw'} width={'20vw'} />
            </div>
        )
    }else{
        return (
            <div>
                <ReactGhLikeDiff
                    diffString={GitDiff}
                />
    
                Git History component info here
            </div>
        )
    }

    
}

export default GitHistory