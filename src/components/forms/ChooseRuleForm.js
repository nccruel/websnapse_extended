import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useImmer } from 'use-immer';

const ChooseRuleForm = ({showChooseRuleModal, handleCloseChooseRuleModal,rules, handleChosenRules}) => {
    const [values, setValues] = useImmer({});
    useEffect(()=>{
        setValues(currentValues =>{
            for (var k in rules){
                currentValues[k] = rules[k][0];
            }
        })
    },[rules])
    function onSubmit(e){
        e.preventDefault();
        handleChosenRules(values);
    }
    function handleSelectChange(event,neuronId){
        setValues(currentValues =>{
            for (var k in currentValues){
                if(k == neuronId){
                    currentValues[k] = event.target.value;
                }
              
            }
        })
    }
    const GroupRules = (label,options) =>{
        let neuronOptions = options.map((neuron)=>(
            <option value={neuron} key={neuron}>{neuron}</option>)
        )   
        return(
            <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control as="select" value={values[label]} onChange={(event)=>handleSelectChange(event, label)}>
                    {neuronOptions}
                </Form.Control>
            </Form.Group>
            
        )
    }
    var ruleList = Object.keys(rules);
    var form = [];
    for (var i=0; i<ruleList.length; i++){
        console.log(i);
        form.push(GroupRules(ruleList[i], rules[ruleList[i]], handleSelectChange));
    }
    return (
        <Modal show={showChooseRuleModal} onHide={handleCloseChooseRuleModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Choose Rule Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={onSubmit}>
                    {form}
                <Button type="submit">Submit</Button>
            </Form>

        </Modal.Body>
        </Modal>
    )
}

export default ChooseRuleForm;