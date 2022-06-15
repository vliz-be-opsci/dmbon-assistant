
import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import { FaArrowLeft } from "react-icons/fa";
import PredicateProgressbar from './predicates_progressbar';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import {MdOpenInBrowser} from "react-icons/md";
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';

//get the current url to know the parent
const url = window.location.href;
const parenturl = url.substr(0,url.lastIndexOf('/'))

function ReferencesView(props) {
    //get the current params from the url
    const {SpaceId} = useParams();
    const [filesselected, setFilesSelected] = useState([]);
    const [SpaceName, setSpaceName] = useState("");

    const Relative_folder = (folder) => {
        try {
            console.log(folder);
            console.log(SpaceName);
            let toreturn = folder.split(SpaceName);
            console.log(toreturn);
            var rest_folder = toreturn[toreturn.length-1];
            rest_folder = rest_folder.replaceAll('\\','/');
            console.log(rest_folder);
            if(rest_folder.length == 0){
                const returnoo = '/'
                return returnoo
            }
            console.log(rest_folder);
            return (rest_folder)
        } catch (error) {
            return('')
        }
    }

    const searchTable = async(value_input) => {
        // Declare variables
        var input, filter, table, tr, td, i, y, txtValue;
        input = value_input
        filter = input.toUpperCase();
        table = document.getElementById("files_table");
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 2; i < tr.length; i++) {
          var is_visible = false;
          for (y = 0; y < tr[i].getElementsByTagName("td").length; y++) {
            td = tr[i].getElementsByTagName("td")[y];
            if (td) {
                txtValue = td.textContent || td.innerText;
                /* if input is empty, show all rows */
                if (input.length == 0) {
                    tr[i].style.display = "";
                    is_visible = true;
                }

                /* if input is not empty, show only rows that match the search query */
                else if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    is_visible = true;
                } 
              }
          }   
          if(is_visible){
            tr[i].style.display = "";
          }
          else {
            tr[i].style.display = "none";
          }
        }
      }

    const fetchSpaceName = async() => {
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}`)
        .then(res => {
            console.log(res)
            var space_name_array = res.data.storage_path.replace('\\','/').split('/');
            var space_name = space_name_array[space_name_array.length-1];
            console.log(space_name);
            setSpaceName(space_name);
        })
    } 

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

    useEffect(() => {
        fetchSpaceName();
    },[]);

    return (
        <div className='container'>
            <input type="text" id="searchtable" onChange={(e) => searchTable(e.target.value)} placeholder="Search in Table.."></input>
            <CheckboxGroup onChange={console.log} id="checkAll">
            <table id="files_table" className='table-sort table_vliz'>
                <thead>
                    <tr>
                        <th><AllCheckerCheckbox /></th>
                        <th className="filetd">Reference Name</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listreferences.map(reference =>
                        <tr>
                            <td><Checkbox value={file.file} onChange={(e) => setfileinarray(file.file,e.target.checked)}/></td>
                            <td variant="info">
                                <OpenInExternal file={file}></OpenInExternal>
                            </td>
                            <td className="filetd">
                            <a href={ '/Datacrates/'+SpaceId+'/all_files/'+ file.file}>{file.file} </a>
                            </td>
                            <td>
                                <a href={ '/Datacrates/'+SpaceId+'/files'+ Relative_folder(file.folder)}>{Relative_folder(file.folder)} </a>
                            </td>
                            <td>
                                <PredicateProgressbar key={props.key} filee={file.file}/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>    
            </CheckboxGroup>
            <br></br>
        </div>
    )
}

export default ReferencesView