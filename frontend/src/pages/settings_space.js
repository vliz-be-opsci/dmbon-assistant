import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import {Button, Modal} from 'react-bootstrap';
function SettingsSpacePage() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {SpaceId} = useParams();
    function deletespace(e) {
        e.preventDefault();
        axios.delete(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}`)
        .then(() => window.location.href = `/spaces`);
    }
    //<input directory="" webkitdirectory="" type="file" />
    return (
        <div>
            <hr />
            <Button variant="danger" size="lg" onClick={handleShow}>
                Delete Space
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Space</Modal.Title>
                </Modal.Header>
                <Modal.Body>You are about to delete the space. Do you want to continue?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={deletespace}>
                    Yes, delete space
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
 
}

export default SettingsSpacePage