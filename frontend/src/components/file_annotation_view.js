import {Table, Button, Modal} from 'react-bootstrap';
import { FaTrashAlt, FaPencilAlt  } from 'react-icons/fa';
import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
function FileAnnotationView(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {SpaceId} = useParams();
    function deletespace(e) {
        e.preventDefault();
    }
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Predicate</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listannotations.map(annotation =>
                        <tr>
                            <td>
                                <Button variant="info" style={{margin: "1%", float:"left"} } onClick={handleShow}><FaPencilAlt color="white"></FaPencilAlt></Button>
                                <Button variant="danger" style={{margin: "1%", float:"left"}} id= {annotation.predicate}><FaTrashAlt></FaTrashAlt></Button>
                                {annotation.predicate}
                                
                            </td>
                            <td>
                                {annotation.value}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>   
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Editing Annotation</Modal.Title>
                </Modal.Header>
                <Modal.Body>inputfield here</Modal.Body>
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