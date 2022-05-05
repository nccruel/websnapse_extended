import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";

const ElementPopUp = ({ showElementPopup, handleCloseElementPopup, handleError, nodeID, nodeType, nodeSRules, nodeFRules, nodeSpikes, nodeBitstring}) => {
    const [rules, setRules] = useState('');
    const [startingSpikes, setStartingSpikes] = useState(0);
    const handleClose = () => {
        //console.log(neuronId, rules, startingSpikes);
        handleCloseElementPopup();
    }


    if (nodeType == "Input"){
        return (
            <Modal show={showElementPopup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Input Node Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Spike train:</b> {nodeBitstring}
                </Modal.Body>
                    
            </Modal>
        )
    }

    else if (nodeType == "Output"){
        return (
            <Modal show={showElementPopup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Output Node Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Spike train:</b> {nodeBitstring}
                </Modal.Body>
            </Modal>
        )
    }

    else{
        return (
            <Modal show={showElementPopup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Node Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Node ID:</b> {nodeID}
                </Modal.Body>
                <Modal.Body>
                    <b>Type:</b> {nodeType} Neuron
                </Modal.Body>
                <Modal.Body>
                    <b>Current number of spikes:</b> {nodeSpikes}
                </Modal.Body>
                <Modal.Body>
                    <b>Spiking Rules:</b> {nodeSRules}
                      
                </Modal.Body>
                <Modal.Body>
                    <b>Forgetting Rules:</b> {nodeFRules}
                </Modal.Body>
                
            </Modal>
        )
    }

  
}
export default ElementPopUp;