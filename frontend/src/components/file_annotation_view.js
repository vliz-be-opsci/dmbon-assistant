import {Button, Modal} from 'react-bootstrap';
import { FaTrashAlt, FaPencilAlt,   } from 'react-icons/fa';
import { FiEdit} from 'react-icons/fi';
import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ShaclForm from './form_shacl';
import {BsPlusLg} from 'react-icons/bs';
function FileAnnotationView(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {SpaceId} = useParams();
    const {FileId}  = useParams();
    function deletespace(e) {
        e.preventDefault();
    }

    const deletepredicate_api = async (predicate) => {
        axios.delete(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/annotation/file/${FileId}/${predicate}`)
          .then(res => {
            console.log(res.data);
          })
      }
    const deletepredicate = async (item) => {
        if (item == '@id' || item =='@type'){
            alert('not allowed to delete predicate: ' + item);
        }else{
            console.log('deleting predicate of not type @id or @type');
            deletepredicate_api(item)
            document.location.reload(true);
        }
    };
    return (
        <div>
            <Button variant="info" style={{width: '100%', float:"left", marginBottom: '1%'} } onClick={handleShow}><FaPencilAlt color="white"></FaPencilAlt></Button>
            <table className='table_vliz'>
                <thead>
                    <tr>
                        <th style={{minWidth: '100px', width:'150px'} }>Actions</th>
                        <th>Predicate</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listannotations.map(annotation =>
                        <tr>
                            <td>
                                <button style={{marginRight: '3%'} } ><FiEdit></FiEdit></button>
                                <button style={{marginLeft: '3%'} } onClick= {() => deletepredicate(annotation.predicate)} id= {annotation.predicate}><FaTrashAlt></FaTrashAlt></button>
                            </td>
                            <td>
                                {annotation.predicate}
                            </td>
                            <td>
                                {annotation.value}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colspan = "3">
                            <Button variant="success" style={{width:"100%"}}><BsPlusLg></BsPlusLg></Button>
                        </td>
                    </tr>
                </tbody>
            </table>   
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Editing Annotation</Modal.Title>
                </Modal.Header>
                <Modal.Body><ShaclForm/></Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    close
                </Button>
                </Modal.Footer>
            </Modal> 
        </div>
    )
}

export default FileAnnotationView