
import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {Table, Button, OverlayTrigger, Popover, Form} from 'react-bootstrap';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import jQuery from 'jquery';
import $ from 'jquery';
import "../css/remote_reference_table_modal.css";

//get the current url to know the parent
const url = window.location.href;

function RemoteReferenceTableAdd() {
    //consts
    const {SpaceId} = useParams();
    //functions
    const addRemoteReferences = async () => {
        var all_input_data = [];
        var inputs = document.getElementsByClassName('input_text');
        for (var i = 0; i < inputs.length; i++) {
            if(inputs[i].value != ''){
                all_input_data.push(inputs[i].value);
            }
        }
        console.log(all_input_data);
        var remoteReferences = all_input_data;
        console.log('toadd content: '+ remoteReferences);
        const toaddreferences = [];
        for (let i = 0; i < remoteReferences.length; i++) {
            toaddreferences.push({"URL": remoteReferences[i]});
        }
        var payload = {"references": toaddreferences};
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/content/reference`,payload)
        .then(res => {
            console.log(res.data)

        }, (error) => {
            console.log(error);
        }) 
    }
    
    const addRowTable = () => {
        $('#referenceTable').append('<tr><td><input type="text" class="input_text" placeholder="reference url" /></td></tr>');
    }
    //return
    return (
        <>
            <Table id="referenceTable">
                <thead>
                    <tr>
                        <th>reference urls to add</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input className="input_text" type="text" placeholder="reference url" />
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="primary" style={{ width: "100%"}} onClick={addRowTable}>Add another reference</Button>
            <hr />
            <Button variant="success" style={{ width: "100%"}} onClick={addRemoteReferences}>Add all references to DataCrate</Button>
        </>
    )
}

export default RemoteReferenceTableAdd