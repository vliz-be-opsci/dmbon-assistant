import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';

function SettingsSpacePage() {

//define all constants first
  const url = window.location.href;
  const countRef = useRef(0);
  const {SpaceId} = useParams();


    return (
        <div>
            TODO settings
        </div>
    )
 
}

export default SettingsSpacePage