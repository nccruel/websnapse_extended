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

const NewOutputNodeForm = ({ showNewOutputModal, handleCloseNewOutputModal, handleNewOutput, handleError }) => {
  const handleClose = () => {
    handleCloseNewOutputModal();
  };
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
    let newId = `${formData.id}-${shortid.generate()}`;
      handleClose();
      setSubmitting(true);

      setTimeout(() => {
        setSubmitting(false);
        setFormData({
          reset: true
        })
      }, 3000);
      const newOutput = {
        id: newId,
        position: { x: 300, y: 300 },
        isOutput: true,
        spikes: 0,
        bitstring: ' '
      }
      handleNewOutput(newOutput);
  }

  return (
    <Modal show={showNewOutputModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Node</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Output Node Name</Form.Label>
            <Form.Control  required name="id" type="text" placeholder="n0" value={formData.id} onChange={handleChange} />
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
export default NewOutputNodeForm;