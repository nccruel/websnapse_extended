import { Button, Form, Modal } from 'react-bootstrap';
import { useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";

const DeleteNodeForm = ({ showDeleteModal, handleCloseDeleteModal, handleDeleteNode, handleError, neurons }) => {
    const [neuronId, setNeuronId] = useState('');
    const handleClose = () => {
        handleCloseDeleteModal();
    };
    let neuronOptions = Object.keys(neurons).map((neuron)=>(
        <option value={neuron} key={neuron}>{neuron}</option>)
    )

    let defaultNeuron = Object.keys(neurons)[0];
    function handleSelectChange(event){
        setNeuronId(event.target.value);
    }
    function handleSubmit(event) {
        event.preventDefault();
        if(neuronId!==''){            
            handleClose();
            handleDeleteNode(neuronId);
        }else{
            handleClose();
            handleDeleteNode(defaultNeuron);
        }
    }

    return (
        <Modal show={showDeleteModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Select node to delete</Form.Label>
                        <Form.Control as="select" defaultValue={-1} onChange={handleSelectChange}>
                            <option disabled value={-1} key={-1}>Select a node</option>
                            {neuronOptions}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
            </Button> {' '}
                    <Button type="submit" variant="danger">
                        Delete neuron
            </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
export default DeleteNodeForm;