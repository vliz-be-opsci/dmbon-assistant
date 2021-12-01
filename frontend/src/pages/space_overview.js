import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
function SpaceOverviewPage() {

    //define all constants first
    //All the functions here
    const {SpaceId} = useParams();

    return (
        <div>
            <h1>TODO: overviewpage </h1>
            <a href={`/spaces/${SpaceId}/all_files`}>see all files</a>
        </div>
    )
}

export default SpaceOverviewPage