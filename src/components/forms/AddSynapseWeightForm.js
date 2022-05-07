import { Button, Form, Modal } from 'react-bootstrap';
import { useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";
import shortid from "shortid";

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      id:'',
    }
  }
  return {
    ...state,
    [event.name]: event.value
  }
}

const initialFormState = {id:""}; 

const AddSynapseWeightForm = ({showAddWeightModal, handleCloseAddWeightModal, handleAddWeight, handleError, srce, dest}) => {
  const handleClose = () => {
    handleAddWeight(srce, dest, 1)
    handleCloseAddWeightModal();
  };
  const [neuronId, setNeuronId] = useState(''); //
  const [formData, setFormData] = useReducer(formReducer, initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = event => {
    console.log(event.target.value);
    console.log(event.target.name);
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };
  function handleSubmit(event) {
    event.preventDefault();
    const weight = parseInt(formData.weight);
    console.log("SOURCE", srce);
    console.log("DEST", dest);
    console.log("weight", weight);    
    handleClose();
    // let newId = `${formData.id}-${shortid.generate()}`;
    //   handleClose();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({
        reset: true
      })
    }, 3000);
    //   const newOutput = {
    //     id: newId,
    //     position: { x: 300, y: 300 },
    //     isOutput: true,
    //     spikes: 0,
    //     bitstring: ' '
    //   }
    handleAddWeight(srce, dest, weight, 0);
  }

  return (
    <Modal show={showAddWeightModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Synapse Weight</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Weight of the Synapse between {srce} and {dest}:</Form.Label>
            <Form.Control  required name="weight" type="number" placeholder={1} min={1} value={formData.weight} onChange={handleChange} />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Close
            </Button> {' '}
          <Button type="submit" variant="primary">
            Save Changes
            </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
export default AddSynapseWeightForm;