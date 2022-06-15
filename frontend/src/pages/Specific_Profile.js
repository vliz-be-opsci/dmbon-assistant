import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';

function SpecificProfile() {
    //define all constants first
    //All the functions here
    const {ProfileId} = useParams();
    const [Loading, setLoading] = useState(false); 

    if(Loading){
        return(
            <div class="busy">
                <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
            </div>
        )
    }else{
        return (
            <>
                <p>Specific profile {ProfileId} here </p>
            </>
        )
    }
}

export default SpecificProfile;