import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';

function SpecificSpace() {
    //define all constants first
    //All the functions here
    const {SpaceId} = useParams();
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
                <p>Specific space {SpaceId} here </p>
            </>
        )
    }
}

export default SpecificSpace;