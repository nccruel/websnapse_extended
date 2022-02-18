import { Button, Form, Modal, OverlayTrigger, Tooltip, Row, Col} from 'react-bootstrap';
import {QuestionCircle} from 'react-bootstrap-icons';
import { useReducer, useState } from 'react';
import { allRulesValid } from "../../utils/helpers";
import shortid from "shortid";

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" style={{'width': '300px'}}{...props}>
    <p><b>Expression</b>: a<sup>i</sup>(a<sup>j</sup>)<sup>*</sup>, where i and j cannot both be 0.<br/>
      <b>Invalid Input</b>:<br/>a/a-&gt;1;1, a^2/a-&gt;a;1,<br/> (a)a/a-&gt;a;1 <br/>
      <b>Valid Input</b>:<br/>a/a-&gt;a;1, aa/a-&gt;a;1,<br/> a(a)/a-&gt;a;1
    </p>
  </Tooltip>
);

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      id:'',
      startingSpikes: 0,
      rules: '',
    }
  }
  return {
    ...state,
    [event.name]: event.value
  }
}

const initialFormState = {id:"", rules:"", startingSpikes:0}; 

const NewNodeForm = ({ showNewNodeModal, handleCloseModal, handleNewNode, handleError }) => {
  const handleClose = () => {
    handleCloseModal();
  };
  const [formData, setFormData] = useReducer(formReducer, initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };
  function handleSubmit(event) {
    event.preventDefault();
    let newId = `${formData.id}-${shortid.generate()}`;

    // Add function that changes i and j to rules

    if (allRulesValid(formData.rules)) {
      console.log("All rules valid");
      handleClose();
      setSubmitting(true);

      setTimeout(() => {
        setSubmitting(false);
        setFormData({
          reset: true
        })
      }, 3000);
      const newNeuron = {
        id: newId,
        position: { x: 100, y: 100 },
        rules: formData.rules,
        startingSpikes: parseInt(formData.startingSpikes),
        delay: 0,
        spikes: parseInt(formData.startingSpikes),
        isOutput: false,
        out: [],
        outWeights: {}
      }
      handleNewNode(newNeuron);
    } else {
      console.log("One or more of the rules is invalid");
      handleError("One or more of the rules is invalid");
      handleClose();
    };
  }

  return (
    <Modal show={showNewNodeModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Node</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} data-testid="new-node-form">
        <Form.Group>
            <Form.Label htmlFor="node-name">Node Name</Form.Label>
            <Form.Control required id="node-name" name="id" type="text" placeholder="n0" value={formData.id} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
                <Form.Label htmlFor="node-rules">Node Rules</Form.Label>
                    <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                    >
                    <QuestionCircle style={{'padding-left':'5px'}}/>
                    </OverlayTrigger>
            <Form.Control id="node-rules" required name="rules" type="text" placeholder="a/a->a;0 aa/a->a;1" value={formData.rules} onChange={handleChange} />
                <Form.Text className="text-muted">
                  Enter valid rules only. Separate each rule with a space.
                </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="starting-spikes">Starting Spike Number</Form.Label>
            <Form.Control id="starting-spikes" required name="startingSpikes" type="number" min="0" value={formData.startingSpikes} onChange={handleChange} />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Close
            </Button> {' '}
          <Button type="submit" variant="primary" data-testid="new-node-submit-button">
            Save Changes
            </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
export default NewNodeForm;