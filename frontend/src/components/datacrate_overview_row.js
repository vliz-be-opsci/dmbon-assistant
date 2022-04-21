//import some css here
import React, {useState, useEffect} from 'react';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';
import {Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {FaFolderOpen, FaGitAlt, FaCog} from 'react-icons/fa';
import {MdOpenInBrowser} from "react-icons/md";

function Datacrate_overview_row(props) {
    //constants 
    const spacedata = props.spacedata;
    const [todisplaydata, setTodisplaydata] = useState({});
    const [Loadingrow, setLoadingRow] = useState(true); 
    console.log(spacedata);
    //functions 
    const popoveropenfilebrowser = (
        <Popover id="popover-open">
            <Popover.Header as="h3">Open File Browser</Popover.Header>
            <Popover.Body>
            Click this to <b>open</b> a file <b>explorer</b> at the path of the <b>datacrate location</b>.
             You can add files/folders here and these will be incorperated in the ROCrate.
             Note that the File <b>explorer</b> will <b>not</b> be <b>focussed</b> on <b>automatically</b>.
            </Popover.Body>
        </Popover>
    );

    //function to get shacl data from the spacedata name
    const getShaclData = (spacedata) => {
        var tosetasdisplaydata = spacedata;
        axios.get(BASE_URL_SERVER + 'apiv1/spaces/' + spacedata['name'] + '/annotation/shacl_report')
        .then(function (res) {
            console.log(res.data);
            var shacl_requirements = res.data.shacl_requirements;
            console.log(shacl_requirements);

            //get the number of shacl errors that are in shacl_requirements
            try{
                var ammount_violations = shacl_requirements[0]["http://www.w3.org/ns/shacl#result"].length;
                console.log(ammount_violations);
                tosetasdisplaydata['shacl_violations'] = ammount_violations;
            }
            catch(error){
                console.log(error);
                var ammount_violations = 0;
                tosetasdisplaydata['shacl_violations'] = ammount_violations;
            }
            console.log(tosetasdisplaydata);
            setTodisplaydata(tosetasdisplaydata);
            setLoadingRow(false);
        })
    }

    const BadgeFolder = (props) => {
        var ShaclErrors = props.ShaclErrors;
        if(ShaclErrors > 0){
            return(
                <Badge color="error" badgeContent={ShaclErrors}>
                    <FaFolderOpen size="2em"/>
                </Badge>
            )
        }else{
            return(
                <Badge color="success" variant="dot">
                    <FaFolderOpen size="2em"/>
                </Badge>
            )
        }
    }

    const OpenBrowserSpace = async (spaceid) => {
        var spaceid = spaceid;
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${spaceid}/content/openexplorer`)
          .then(res => {
            console.log(res)
          })
    }

    

    //useEffect 
    useEffect(() => {
        getShaclData(spacedata);
    },[]);

    //return section
    if(Loadingrow){
        return(
            <></>
        )
    }else{
        return ( 
        <>
            <tr>
                <td><a href={'/spaces/' + todisplaydata.name }><button className='project_name'>{todisplaydata.truespacename}</button></a></td>
                <td>{todisplaydata.trueprofilename}</td>
                <td>
                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoveropenfilebrowser}>
                    <button onClick={() => OpenBrowserSpace(todisplaydata.name)}>
                        <MdOpenInBrowser></MdOpenInBrowser>
                    </button>
                </OverlayTrigger>
                <a href={'/spaces/' + todisplaydata.name + '/all_files'}>
                    <button>
                        <BadgeFolder ShaclErrors={todisplaydata.shacl_violations}/>
                    </button>
                </a>
                <a href={'/spaces/' + todisplaydata.name + '/git'}>
                    <button>
                    <FaGitAlt></FaGitAlt>
                    </button>
                </a>
                <a href={'/spaces/' + todisplaydata.name + '/settings'}>
                    <button>
                    <FaCog></FaCog>
                    </button>
                </a>
                </td>
            </tr>
        </> 
        )
    }
    
}

export default Datacrate_overview_row