import React, {useState, useEffect, useRef} from 'react';
import {Button, Modal} from 'react-bootstrap';
import { FaPlus} from 'react-icons/fa';

export default class modal_add_space extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          show: false
        };
        this.updateShow= this.updateShow.bind(this);
        this.addspace = this.addspace.bind(this);
      }

      updateShow(newstate) {
        console.log()
        this.setState({
          show: newstate
        });
      }
    
      addspace(e) {
        e.preventDefault();
        console.log("space added");
        alert("added space");
        this.updateShow(false);
      }
    

    render(){
        return (
            <div>
                <Button variant="danger" onClick={this.updateShow(true)} style={{width: '100%', marginBottom:'1%'}}><FaPlus></FaPlus> Add Space <FaPlus></FaPlus></Button>
                <Modal show={this.state.show} onHide={this.updateShow(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Space</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Add form body for adding space here</Modal.Body>
                    <Modal.Footer>
                    <Button variant="danger" onClick={this.addspace}>
                        Yes, add space
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            )
    }
}