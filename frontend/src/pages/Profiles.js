import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import SpacesView from '../components/spaces_view.js'
import {Button, Modal, Form, FloatingLabel} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';

function ProfilesPage() {

//define all constants first

  const [Loading, setLoading] = useState(true); 
 
  if(Loading){
      return(
        <div class="busy">
            <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
        </div>
      )
      }else{
        return (
          <>
            <p>profiles overview here</p>
          </>
      )
    }
    
}

export default ProfilesPage