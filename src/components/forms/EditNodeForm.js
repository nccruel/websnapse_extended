import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";

const EditNodeForm = ({ showEditModal, handleCloseEditModal, handleEditNode, handleError, neurons }) => {
    
    const [neuronId, setNeuronId] = useState('');
    const [rules, setRules] = useState('');
    const [startingSpikes, setStartingSpikes] = useState(0);
    const handleClose = () => {
        setNeuronId(null);
        setRules(null);
        setStartingSpikes(null);
        //console.log(neuronId, rules, startingSpikes);
        handleCloseEditModal();
    };
    useEffect(() => {
        firstUpdate();
    }, []);
    function firstUpdate() {
        var filteredObject = Object.keys(neurons).reduce(function (r, e) {
            if (!neurons[e].isOutput && !neurons[e].isInput) r[e] = neurons[e];
            return r;
        }, {});
        //var keys = Object.keys(filteredObject);
        //setNeuronId(keys[0]);
        //setRules(filteredObject[keys[0]].rules);
        //setStartingSpikes(filteredObject[keys[0]].startingSpikes);
    }
    var filteredObject = Object.keys(neurons).reduce(function (r, e) {
        if (!neurons[e].isOutput && !neurons[e].isInput) r[e] = neurons[e];
        
        return r;
    }, {});
    let neuronOptions = Object.keys(filteredObject).map((neuron) => (
        <option value={neuron} key={neuron}>{neuron}</option>)
    )
    
    
    function handleSelectChange(event) {
        let id = event.target.value;
        
        setNeuronId(id);
        setRules(neurons[id].rules);
        setStartingSpikes(neurons[id].startingSpikes);
    }
    function handleSubmit(event) {
        console.log(neuronId, rules, startingSpikes);
        event.preventDefault();
        console.log(neuronId, rules, startingSpikes);
        if (!neuronId || neuronId == '-1') {
            handleError("Please select a node to edit");
            return;
        }
        else {
            if (allRulesValid(rules)) {
                console.log("All rules valid");
                handleClose();
                setTimeout(() => {
                    setNeuronId('');
                    setRules('');
                    setStartingSpikes(0);
                }, 3000);
                handleEditNode(neuronId, rules, startingSpikes);
            } else {
                console.log("One or more of the rules is invalid");
                handleError("One or more of the rules is invalid");
            };
        }
    }

    return (
        <Modal show={showEditModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Regular Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} data-testid="edit-node-form">
                    <Form.Group>
                        <Form.Label>Node</Form.Label>
                        <Form.Control required data-testid="select-option" as="select" defaultValue={-1} onChange={handleSelectChange}>
                            <option disabled value={-1} key={-1}>Select a node</option>
                            {neuronOptions}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="node-rules" >Node Rules</Form.Label>
                        <Form.Control id="node-rules" required name="rules" type="text" placeholder="a/a->a;0 aa/a->a;1" value={rules} onChange={(event) => { setRules(event.target.value) }} />
                        <Form.Text className="text-muted">
                            Enter valid rules only. Separate each rule with a space.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="startingSpikes">Starting Spike Number</Form.Label>
                        <Form.Control id="startingSpikes" required name="startingSpikes" type="number" min="0" placeholder="0" value={startingSpikes} onChange={(event) => setStartingSpikes(event.target.value)} />
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
export default EditNodeForm;