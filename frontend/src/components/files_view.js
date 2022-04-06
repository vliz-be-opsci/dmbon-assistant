
import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {Table, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import { FaArrowLeft } from "react-icons/fa";
import PredicateProgressbar from './predicates_progressbar';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import {MdOpenInBrowser} from "react-icons/md";
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';

const Relative_folder = (folder) => {
    const {SpaceId} = useParams();
    try {
        console.log(folder);
        let toreturn = folder.split(SpaceId)[1];
        let returno = toreturn.replace('\\project','');
        returno = returno.replaceAll('\\','/');
        console.log(returno);
        if(returno.length == 0){
            const returnoo = '/'
            return returnoo
        }
        console.log(returno);
        return (returno)
    } catch (error) {
        return('')
    }
}

//get the current url to know the parent
const url = window.location.href;
const parenturl = url.substr(0,url.lastIndexOf('/'))

function FilesView(props) {
    //get the current params from the url
    const {SpaceId} = useParams();
    const [filesselected, setFilesSelected] = useState([]);


    const openFileExternal = async (fileID) => {
        console.log('content: '+ fileID)
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content/file/${fileID}`)
          .then(res => {
            console.log(res)
          }, (error) => {
            console.log(error);
          })
    }

    const popoveropenexternal = (
        <Popover id="popover-open">
            <Popover.Header as="h3">Open external window</Popover.Header>
            <Popover.Body>
            Click this to open the file in its default program on your machine.
            </Popover.Body>
        </Popover>
    );

    

    const setfileinarray = async(filename,bool) => {
        if(bool == false){
            var carray =  filesselected;
            console.log(carray);
            const id = carray.indexOf(filename); // 2
            carray.splice(id,  1);
            setFilesSelected(carray);

        }else{
            var carray = filesselected;
            carray.push(filename);
            setFilesSelected(carray);
            console.log(carray);
        }
    }

    return (
        <div>
            <CheckboxGroup onChange={console.log} id="checkAll">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><AllCheckerCheckbox /></th>
                        <th>A</th>
                        <th className="filetd">File Name</th>
                        <th>Relative storage location</th>
                        <th>Semantic Progress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="5">
                            <a href={parenturl}>./ <FaArrowLeft /></a>
                        </td>
                    </tr>
                    {props.listfiles.map(file =>
                        <tr>
                            <td><Checkbox value={file.file} onChange={(e) => setfileinarray(file.file,e.target.checked)}/></td>
                            <td variant="info">
                                <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popoveropenexternal}>
                                    <Button onClick={() => openFileExternal(file.file)}><MdOpenInBrowser></MdOpenInBrowser></Button>
                                </OverlayTrigger>
                            </td>
                            <td className="filetd">
                            <a href={ '/spaces/'+SpaceId+'/all_files/'+ file.file}>{file.file} </a>
                            </td>
                            <td>
                                <a href={ '/spaces/'+SpaceId+'/files'+ Relative_folder(file.folder)}>{Relative_folder(file.folder)} </a>
                            </td>
                            <td>
                                <PredicateProgressbar key={props.key} filee={file.file}/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>    
            </CheckboxGroup>
        </div>
    )
}

export default FilesView