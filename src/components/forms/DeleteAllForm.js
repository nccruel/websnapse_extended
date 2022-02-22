import { Button, Form, Modal } from 'react-bootstrap';
import { useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";

const DeleteNodeForm = ({ showDeleteAllModal, handleCloseDeleteAllModal, handleDeleteAll, handleError,}) => {
    const [neuronId, setNeuronId] = useState('');
    const handleClose = () => {
        handleCloseDeleteAllModal();
    };

    function handleSubmit(event) {
        event.preventDefault();
        handleClose();
        setTimeout(() => {
            setNeuronId('');
        }, 3000);
        
        handleDeleteAll();
    }
    

    return (
        <Modal show={showDeleteAllModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Clear All</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>                   
                    <Form.Group>
                        <Form.Label>Are you sure you want to delete all elements?</Form.Label>
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
export default DeleteNodeForm;