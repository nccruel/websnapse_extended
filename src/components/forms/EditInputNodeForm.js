import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useReducer, useState, Text } from 'react';
import { allRulesValid } from "../../utils/helpers";
import { setUseProxies } from 'immer';

const EditInputNodeForm = ({ showEditInputModal, handleCloseEditInputModal, handleEditInputNode, handleError, neurons }) => {

    const [neuronId, setNeuronId] = useState('');
    const [spikeTrain, setSpikeTrain] = useState('');

    const handleClose = () => {
        setSpikeTrain(null);
        setNeuronId(null);
        //console.log(neuronId, rules, startingSpikes);
        handleCloseEditInputModal();
    };
    useEffect(() => {
        firstUpdate();
    }, []);
    function firstUpdate() {
        var filteredObject = Object.keys(neurons).reduce(function (r, e) {
            if (neurons[e].isInput) r[e] = neurons[e];
            return r;
        }, {});
        
    }
    var filteredObject = Object.keys(neurons).reduce(function (r, e) {
        if (neurons[e].isInput) r[e] = neurons[e];
        
        return r;
    }, {});
    let neuronOptions = Object.keys(filteredObject).map((neuron) => (
        <option value={neuron} key={neuron}>{neuron}</option>)
    )

    
    function handleSelectChange(event) {
        let id = event.target.value;        
        setNeuronId(id);
        setSpikeTrain(neurons[id].bitstring);
    }
    function handleSubmit(event) {
        
        event.preventDefault();
       
        if (!neuronId || neuronId == '-1') {
            handleError("Please select a node to edit!");
            return;
        }
        else {
           
                handleClose();
                handleEditInputNode(neuronId, spikeTrain);
        }
    }


    return (
        <Modal show={showEditInputModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Input Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} data-testid="edit-node-form">
                    <Form.Group>
                        <Form.Label>Node</Form.Label>
                        <Form.Control required data-testid="select-option" as="select" defaultValue={-1} onChange={handleSelectChange}>
                            <option disabled value={-1} key={-1}>Select an input node</option>
                            {neuronOptions}
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label>Bitstring/Spike Train</Form.Label>
                        <Form.Control id="spikeTrain" required name="spikeTrain" type="text" placeholder="1,0,1" value={spikeTrain} onChange={(event) => { setSpikeTrain(event.target.value) }} />
                        <Form.Text className="text-muted">
                            Enter spike train. Separate spikes with <b>commas</b> with <b>NO space in between</b> (e. g. <b>1,0,1,1</b>).
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
export default EditInputNodeForm;