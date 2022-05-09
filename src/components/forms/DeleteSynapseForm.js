import { Button, Form, Modal } from 'react-bootstrap';
import { useReducer, useState } from 'react';
import { SynapseRulesValid } from "../../utils/helpers";

const DeleteSynapseForm = ({ showDeleteSynapseModal, handleCloseDeleteSynapseModal, handleDeleteSynapse, handleError, setNeurons, isClickedSynapse,
    srcID, dstID}) => {
    const handleClose = () => {      
        handleCloseDeleteSynapseModal();
    };

    function handleSubmit(event) {
        event.preventDefault();
        handleClose();
        setTimeout(() => {
        }, 3000);

        setNeurons(draft => {
            var weightsDict = {...draft[srcID].outWeights};
            weightsDict[dstID] = 1;
            draft[srcID].outWeights = weightsDict;
            handleDeleteSynapse(srcID, dstID);
            });     
      
    }
    
    if (isClickedSynapse){
        return (
            <Modal show={showDeleteSynapseModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Synapse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>                   
                        <Form.Group>
                            <Form.Label>Are you sure you want to delete this synapse with source <b>{srcID}</b> and destination <b>{dstID}</b>?</Form.Label>
                        </Form.Group>
                        <Button type="submit" variant="danger">
                                YES
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                                NO
                        </Button> {' '}
                
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    else{
        return (
            <Modal show={showDeleteSynapseModal} onHide={handleClose}>
             <Modal.Header closeButton>
                    <Modal.Title>Delete Clicked Synapse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} data-testid="edit-node-form">
                        <Form.Group>       
                                         
                            <Form.Label><b>NO SELECTED SYNAPSE! Please click a synapse to delete.</b></Form.Label>
                        </Form.Group>
                    </Form>            
                </Modal.Body>
            </Modal>
        )
    }
    
}
export default DeleteSynapseForm;