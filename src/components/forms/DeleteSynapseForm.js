import { Button, Form, Modal } from 'react-bootstrap';
import { useReducer, useState } from 'react';
import { SynapseRulesValid } from "../../utils/helpers";

const DeleteSynapseForm = ({ showDeleteSynapseModal, handleCloseDeleteSynapseModal, handleDeleteSynapse, handleError, setNeurons}) => {
    const [neuronId, setNeuronId] = useState('');
    const handleClose = () => {
        handleCloseDeleteSynapseModal();
    };

    function handleSubmit(event) {
        event.preventDefault();
        handleClose();
        setTimeout(() => {
            setNeuronId('');
        }, 3000);

        setNeurons(draft => {            
              var weightsDict = {...draft[src_id].outWeights};
              weightsDict[dst_id] = 1;
              draft[src_id].outWeights = weightsDict;
              handleDeleteSynapse(src_id, dst_id);
      
          });
      
    }
    

    return (
        <Modal show={showDeleteSynapseModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Synapse</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>                   
                    <Form.Group>
                        <Form.Label>Are you sure you want to delete this synapse?</Form.Label>
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
export default DeleteSynapseForm;