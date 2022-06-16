
import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';

//get the current url to know the parent
const url = window.location.href;

function ReferencesView(props) {
    //get the current params from the url
    const {SpaceId} = useParams();
    const [filesselected, setFilesSelected] = useState([]);

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

    //make child component that takes in the reference_file and checks if it is an url => if it is then it returns a hyperlink to set url , if not then it return a link to the node  eg : '/Datacrates/'+SpaceId+'/all_files/'+ reference_file
    const Reference_file_link = (props) => {
        const reference_file = props.reference_file;
        try {
            if(reference_file.includes('http')){
                return(
                    <a href={reference_file} target="_blank">{reference_file}</a>
                )
            }else{
                return(
                    <a href={'/Datacrates/'+SpaceId+'/all_files/'+ reference_file}>{reference_file}</a>
                )
            }
        } catch (error) {
            console.log(error);
            return(
                <>an error occured, please make an issue on github</>
            )
        }
    }

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
                            <td><Checkbox value={reference.file} onChange={(e) => setfileinarray(reference.file,e.target.checked)}/></td>
                            <td className="filetd">
                                <Reference_file_link reference_file={reference.file}/>
                            </td>
                            <td>
                                {reference.type}
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