//import some css here
import React, {useState, useEffect} from 'react';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {Button, OverlayTrigger, Popover, Spinner} from 'react-bootstrap';
import {FaFolderOpen, FaGitAlt, FaCog} from 'react-icons/fa';
import {MdOpenInBrowser} from "react-icons/md";

function Datacrate_overview_row(props) {
    //constants 
    const spacedata = props.spacedata;
    const [todisplaydata, setTodisplaydata] = useState({});
    const [profiledata, setProfiledata] = useState([{}]);
    const [Loadingrow, setLoadingRow] = useState(true); 
    const [repo_dirty, SetRepoDirty] = useState(false);
    const [ahead, SetAhead] = useState(0);
    const [behind, SetBehind] = useState(0);
    const [noerror, SetNoError] = useState(true);
    //console.log(spacedata);
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

    //function to get all the spaces data
    const fetchprojects = () => {
        axios.get(BASE_URL_SERVER+`apiv1/projects`)
            .then(function(res){
                console.log(res);
                console.log(res.data);
                setProfiledata(res.data);
                setLoadingRow(false);
            }
            ).catch(err => {
                console.log(err);
            }
            )
    }


    //function to get shacl data from the spacedata name
    const getShaclData = (spacedata) => {
        setLoadingRow(true);
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
                SetNoError(false);
                console.log(error);
                var ammount_violations = 0;
                tosetasdisplaydata['shacl_violations'] = ammount_violations;
            }
            console.log(tosetasdisplaydata);
            setTodisplaydata(tosetasdisplaydata);
        }).catch(function (error) {SetNoError(false);})

        //do axios request to get the git status /git/status
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${spacedata['name']}/git/status/`)
        .then(res => {
            console.log(res)
            var git_status = res.data;
            console.log(git_status);
            SetRepoDirty(git_status.dirty);
            SetAhead(git_status.ahead);
            SetBehind(git_status.behind);
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

    const BadgeGit = () => {
        if(repo_dirty){
            if(behind > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} variant="dot">
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="warning" variant='dot'>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(ahead > 0){
            if(behind > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} badgeContent={ahead}>
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="warning" badgeContent={ahead}>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(behind > 0){
            if(ahead > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} badgeContent={ahead}>
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(ahead == 0 && behind == 0 && repo_dirty != true){
            return(
                <Badge color="success" variant="dot">
                    <FaGitAlt size="2em"></FaGitAlt>
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

    const LoadingSpaceRow = () => {
        if(noerror){
            return(
                <tr>
                    <td colSpan="4">
                        <Spinner animation="border" variant="primary" />
                    </td>
                </tr>
            )
        }else{
            return(<></>)
        }
    }

    //child component to display the space id of a datacrate => if value is not undefined then display a butten , else display value null 
    const SpaceIdbutton = (props) => {
        var spaceidvalue = props.spaceidvalue;
        var profiledata = props.profiledata;
        if(spaceidvalue != undefined){
            //check in the profiledata if the spaceid == profile.name and then use the uuid 
            for(var i = 0; i < profiledata.length; i++){
                console.log(profiledata[i]['name']);
                if(spaceidvalue == profiledata[i]['name']){
                    return(
                        <a href={'/Spaces/' + profiledata[i]['uuid'] }><button className='button_datacrates'>{spaceidvalue}</button></a>
                    )
                }
            }
        }else{
            return(
                <>NULL</>
            )
        }
    }

    //useEffect 
    useEffect(() => {
        getShaclData(spacedata);
        fetchprojects();
    },[]);

    //return section
    if(Loadingrow){
        return(
            <>
            {LoadingSpaceRow()}
            </>
        )
    }else{
        return ( 
        <>
            <tr>
                <td><a href={'/Datacrates/' + todisplaydata.name }><button className='button_datacrates'>{todisplaydata.truespacename}</button></a></td>
                <td><SpaceIdbutton spaceidvalue={todisplaydata.parent_space} profiledata={profiledata}></SpaceIdbutton></td>
                <td><a href={'/Profiles/' + todisplaydata.trueprofileuuid }><button className='button_datacrates'>{todisplaydata.trueprofilename}</button></a></td>
                <td>
                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoveropenfilebrowser}>
                    <button onClick={() => OpenBrowserSpace(todisplaydata.name)} className='action_button'>
                        <MdOpenInBrowser></MdOpenInBrowser>
                    </button>
                </OverlayTrigger>
                <a href={'/Datacrates/' + todisplaydata.name + '/all_files'}>
                    <button className='action_button'>
                        <BadgeFolder ShaclErrors={todisplaydata.shacl_violations}/>
                    </button>
                </a>
                <a href={'/Datacrates/' + todisplaydata.name + '/git'}>
                    <button className='action_button'>
                        <BadgeGit/>
                    </button>
                </a>
                <a href={'/Datacrates/' + todisplaydata.name + '/settings'}>
                    <button className='action_button'>
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