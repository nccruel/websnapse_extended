import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useReducer, useState, Text } from 'react';
import { allRulesValid } from "../../utils/helpers";
import { setUseProxies } from 'immer';

const EditSynapseForm = ({ showEditSynapseModal, handleCloseEditSynapseModal, handleEditSynapse, handleError, neurons, isClickedSynapse, srcID, dstID, setWeight, weight_main}) => {
    const handleClose = () => {
        if (isClickedSynapse){
            setWeight(weight_main);
        }

        else{
            setWeight(1)
        }
        
        handleCloseEditSynapseModal();
    };

   
   

    function handleSubmit(event) {        
        event.preventDefault();
       
        if (!isClickedSynapse) {
            handleError("Please click a synapse to edit");
            return;
        }

        else{         
           
            handleClose();
            setTimeout(() => {
            }, 3000);

            handleEditSynapse(srcID, dstID, weight_main);
        }
      
    }

    var currWeight;

    if (isClickedSynapse){
        var weightsDict = {...neurons[srcID].outWeights};
        currWeight = parseInt(weightsDict[dstID]);

    }

    else{
        setWeight(1);
        currWeight = 1;
    }
    
    if (isClickedSynapse){
        return (
            <Modal show={showEditSynapseModal} onHide={handleClose}>
             <Modal.Header closeButton>
                    <Modal.Title>Edit Clicked Synapse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} data-testid="edit-node-form">
                        <Form.Group>       
                                         
                            <Form.Label>Selected Synapse: {srcID}->{dstID}</Form.Label>
                        </Form.Group>
                        <Form.Group>   
                            <Form.Label>Source Node: <b>{srcID}</b></Form.Label>
                        </Form.Group>
                        <Form.Group>   
                            <Form.Label>Destination Node: <b>{dstID}</b></Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="synapse-weight" >Synapse Weight</Form.Label>                        
                            <Form.Control id="synapse-weight" required name="weight" type="number" min="0" placeholder={currWeight} value={weight_main} onChange={(event) => { setWeight(event.target.value) }} />
                            <Form.Text className="text-muted">
                                Enter any <b>nonnegative integer</b>.
                            </Form.Text>
                        </Form.Group>
        
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                </Button> {' '}
                        <Button type="submit" variant="primary" data-testid="edit-node-submit-button">
                            Save Changes
                </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )

    }

    else{
        return (
            <Modal show={showEditSynapseModal} onHide={handleClose}>
             <Modal.Header closeButton>
                    <Modal.Title>Edit Clicked Synapse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} data-testid="edit-node-form">
                        <Form.Group>       
                                         
                            <Form.Label><b>NO SELECTED SYNAPSE! Please click a synapse to edit.</b></Form.Label>
                        </Form.Group>
                    </Form>            
                </Modal.Body>
            </Modal>
        )
    }
}
export default EditSynapseForm;