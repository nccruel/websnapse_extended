import './scss/custom.scss';
import './App.css';
import { slide as Menu } from 'react-burger-menu'
import { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { Button, Container, Alert, Row, Col, Form, OverlayTrigger, Tooltip, Dropdown, DropdownButton } from 'react-bootstrap';
import { PlayFill, PauseFill, SkipForwardFill, SkipBackwardFill, QuestionCircle, ClockFill, ClockHistory, PlusSquare, Save2, WindowSidebar } from 'react-bootstrap-icons';
import styled, { css, keyframes } from 'styled-components'
import Snapse from "./components/Snapse/Snapse";
import shortid from 'shortid';
import { step, backStep, parseRule } from "./utils/automata";
import ChooseRuleForm from './components/forms/ChooseRuleForm';
import NewNodeForm from './components/forms/NewNodeForm';
import AddSynapseWeightForm from './components/forms/AddSynapseWeightForm';
import NewOutputNodeForm from './components/forms/NewOutputNodeForm';
import NewInputNodeForm from './components/forms/NewInputNodeForm';
import EditNodeForm from './components/forms/EditNodeForm';
import DeleteNodeForm from './components/forms/DeleteNodeForm';
import DeleteAllForm from './components/forms/DeleteAllForm';
import ChoiceHistory from './components/ChoiceHistory/ChoiceHistory';
import convert from 'xml-js';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { saveAs } from 'file-saver';
import useUnsavedChanges from './components/useUnsavedChanges/useUnsavedChanges';
import { original } from 'immer';
import Tour from './components/Tour/Tour';
var options = { compact: true, ignoreComment: true, spaces: 4, sanitize: false };

function useKey(key, cb) {
  const isFocus = useRef(false);
  const callbackRef = useRef(cb);

  const inputs = document.getElementsByTagName('input');

  // if user is typing in input elements, isFocus = true, and keybinds should not work
  useEffect(() => {
    for (let input of inputs) {
      input.addEventListener('focusin', () => { isFocus.current = true; console.log("fOCUS ON ME"); });
      input.addEventListener('input', () => { isFocus.current = true; console.log("fOCUS ON ME 2"); });
      input.addEventListener('focus', () => { isFocus.current = true; console.log("fOCUS ON ME 3"); }, true);
      input.addEventListener('focusout', () => { isFocus.current = false });
    }
  })

  useEffect(() => {
    callbackRef.current = cb;
  });
  useEffect(() => {
    function debounced(delay, fn) {
      let timerId;
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
        }, delay);
      }
    }

    function handleKeyDown(event) {
      console.log(`isFocus ${isFocus.current}`);
      if (event.code === key && isFocus.current == false) {
        console.log(`handleKeyDown isFocus: ${isFocus.current}`)
        //event.preventDefault();
        console.log("Key pressed: " + event.code);
        callbackRef.current(event);
      }
    }

    document.addEventListener("keydown", (event) => { if (event.code === "Space" && isFocus == false) { event.preventDefault(); } });
    document.addEventListener("keydown", (debounced(300, handleKeyDown)));
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key]);
}

function App() {
  const [neurons, setNeurons] = useImmer((window.localStorage.getItem('originalNeurons') != null) ? JSON.parse(window.localStorage.getItem('originalNeurons')) : {
    n1: {
      id: "n1",
      position: { x: 50, y: 50 },
      rules: 'a+/a->a;2',
      startingSpikes: 1,
      delay: 0,
      spikes: 1,
      isOutput: false,
      out: ['n2'],
      outWeights: {'n2': 1}
    },
    n2: {
      id: "n2",
      position: { x: 200, y: 50 },
      rules: 'a/a->a;1',
      startingSpikes: 0,
      delay: 0,
      spikes: 0,
      isOutput: false,
      out: ['n3'],
      outWeights: {'n3': 1}
    },
    n3: {
      id: "n3",
      position: { x: 400, y: 50 },
      rules: 'a/a->a;0',
      startingSpikes: 1,
      delay: 0,
      spikes: 1,
      isOutput: false,
      out: ["n4"],
      outWeights: {'n4': 1}
    },
    n4: {
      id: "n4",
      position: { x: 400, y: 200 },
      isOutput: true,
      spikes: 0,
      bitstring: ' '
    }
  });

  const [srce, setSrce] = useState('');
  const [dest, setDest] = useState('');
  const [time, setTime] = useState(0);
  const [isRandom, setIsRandom] = useState(true);
  const [fileName, setFileName] = useState('');
  const [Prompt, setDirty, setPristine] = useUnsavedChanges();
  // Modal Booleans
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showNewNodeModal, setShowNewNodeModal] = useState(false);
  const [showNewOutputModal, setShowNewOutputModal] = useState(false);
  const [showNewInputModal, setShowNewInputModal] = useState(false);
  const [showChooseRuleModal, setShowChooseRuleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChoiceHistoryModal, setShowChoiceHistoryModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Menu Booleans 
  const [showDropdownBasic, setShowDropdownBasic] = useState(false);
  const [showSideBarMenu, setShowSideBarMenu] = useState(false);
  // Simulation Booleans
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [error, setError] = useState("");
  const [pBar, setPBar] = useState(0);
  const headless = process.env.NODE_ENV === 'test'
  const handleClose = () => setShowNewNodeModal(false)
  const handleShow = () => setShowNewNodeModal(true)
  const handleCloseAddWeightModal = () => setShowAddWeightModal(false);
  const handleShowAddWeightModal = () => setShowAddWeightModal(true);  
  const handleCloseNewOutputModal = () => setShowNewOutputModal(false);
  const handleShowNewOutputModal = () => setShowNewOutputModal(true);
  const handleCloseNewInputModal = () => setShowNewInputModal(false);
  const handleShowNewInputModal = () => setShowNewInputModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseDeleteAllModal = () => setShowDeleteAllModal(false);
  const handleShowDeleteAllModal = () => setShowDeleteAllModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseChooseRuleModal = () => setShowChooseRuleModal(false);
  // Menu Handles
  const handleShowDropdownBasic = () => setShowDropdownBasic(true);
  const handleCloseDropdownBasic = () => setShowDropdownBasic(false);
  const handleDropDownBasic = () => {setShowDropdownBasic(showDropdownBasic ? false:true)};
  const handleShowSideBarMenu = () => setShowSideBarMenu(true);
  const handleCloseSideBarMenu = () => setShowSideBarMenu(false);
  const handleSideBarMenu = () => {setShowSideBarMenu(showSideBarMenu ? false:true)};

  const [restartTutorial, setRestartTutorial] = useState(false);
  const handleTrueRestartTutorial = () => setRestartTutorial(true);
  const handleFalseRestartTutorial = () => setRestartTutorial(false);

  const handleShowChoiceHistoryModal = () => {setShowChoiceHistoryModal(true); setShowSideBarMenu(false);}
  const handleCloseHoiceHistoryModal = () => setShowChoiceHistoryModal(false);

  const handleSimulationEnd = () => {
    setHasEnded(true);
    setIsPlaying(false);
    console.log("alert from simulationEnd");
    alert("Simulation has ended.");
  }

  const showError = (text) => {
    setError(text);
    setTimeout(() => {
      setError("");
    }, 3000);
  }
  const handleSave = () => {
    //Convert JSON Array to string.
    var wrapper = { content: neurons };
    //console.log(neurons);
    var result = convert.json2xml(wrapper, options);
    //console.log(wrapper);
    var blob = new Blob([result], { type: "text/xml;charset=utf-8", });
    saveAs(blob, Date().toString() + "-Neurons.xmp");
    setPristine();
  }
  const handleLoad = (input) => {
    let file = input.files[0];
    setHasEnded(false);

    if (file.type && file.type.indexOf('text/xml') === -1) {

      showError("File is not a xml file");
      return;
    }
    const reader = new FileReader();
    function nativeType(value) {
      var nValue = Number(value);
      if (!isNaN(nValue)) {
        return nValue;
      }
      var bValue = value.toLowerCase();
      if (bValue === 'true') {
        return true;
      } else if (bValue === 'false') {
        return false;
      }
      return value;
    }
    var removeJsonTextAttribute = async function (value, parentElement) {
      try {
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
          const arr = arrOfKey;
          const arrIndex = arrOfKey.length - 1;
          arr[arrIndex] = value;
        } else if (keyName == "out") {
          parentElement._parent[keyName] = [value];
        } else if (keyName == "bitstring") {
          console.log("bitstring");
          parentElement._parent[keyName] = "";
        }
        else {
          parentElement._parent[keyName] = nativeType(value);
        }

      } catch (e) { }
    }
    reader.addEventListener('load', async (event) => {
      var options = {
        compact: true,
        trim: true,
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreAttributes: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
        textFn: removeJsonTextAttribute
      };
      var result = await convert.xml2js(event.target.result, options);
      await setNeurons(draft => draft = result.content);
      await setNeurons(draft => {
        for (var k in draft) {
          if (draft[k].bitstring) {
            console.log(draft[k].bitstring);
            draft[k].bitstring = " ";
          }
          if(!draft[k].isOutput && !draft[k].out){
            draft[k].out = [];
          }
        }
      })
      window.localStorage.setItem('originalNeurons', JSON.stringify(result.content));
      setFileName(file.name);
    });
    reader.readAsText(file);
    setTime(0);
  }
 
  /// add weight argument
  /// make array of objects (neuron ID, weight)
  const onEdgeCreate = async (src, dst) => {
    setSrce(src); // srce = src
    setDest(dst); // dest = dst
    console.log("newEdge", src, dst);
    await setNeurons(draft => {
      var outCopy = [...draft[src].out];
      var weightsDict = {...draft[src].outWeights};
      var currWeight = weightsDict[dst];

      if (outCopy.includes(dst)){
        handleAddWeight(src, dst, currWeight + 1);
      }
      
      else{
        handleShowAddWeightModal();
        outCopy.push(dst)
        console.log(outCopy);
        draft[src].out = outCopy;
      } 

     
    })  
  }

  async function handleAddWeight(src, dst, weight) {
    await setNeurons(draft => {
      var weightsDict = {...draft[src].outWeights};
      weightsDict[dst] = weight;
      draft[src].outWeights = weightsDict;
      console.log("WEIGHTS", weightsDict);

    });
    setSrce('');
    setDest('');
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }

  const handleNewPosition = async (position, id) => {
    setNeurons(draft => {
      draft[id].position = position;
    });
    setDirty(true);

  }
  async function handleNewNode(newNeuron) {
    await setNeurons(draft => {
      draft[newNeuron.id] = newNeuron;
    })
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));

  }
  async function handleNewOutput(newOutput) {
    await setNeurons(draft => {
      draft[newOutput.id] = newOutput;
    });
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }

  async function handleNewInput(newInput) {
    await setNeurons(draft => {
      draft[newInput.id] = newInput;
    });
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }

  async function handleShowDeleteAll() {
    handleShowDeleteAllModal()
  }

  async function handleEditNode(id, rules, spikes) {
    //console.log("handleEditNode")
    await setNeurons(draft => {
      draft[id].startingSpikes = spikes;
      draft[id].spikes = spikes;
      draft[id].rules = rules;
    });
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }
  /// list all neurons connected to a neuron (delete ID to delete connected synapse)
  async function handleDeleteNode(neuronId) {
    console.log("handleDeleteNode", neuronId);
    await setNeurons(draft => {
      
      for (var k in draft) {
        //first delete edges connected to neuron
        var neuron = draft[k];
        if (!neuron.isOutput && neuron.out) {
          //const neuronOutKeys = neuron.out;
          let arr = neuron.out.filter(function (item) {
            return item !== neuronId
          });
          draft[k].out = arr;
        }
      }
      //delete neuron
      delete draft[neuronId];
    })
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }

  async function handleDeleteAll() {
    console.log("Delete All");
    await setNeurons(draft => {
      for (var k in draft) {
        delete draft[k];
      };
    });
    setDirty(true);
    window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
  }


  function handlePlay() {
    if (!hasEnded) {
      console.log(`isPlaying before ${isPlaying}`);
      setIsPlaying(p => !p);
      console.log(`isPlaying after ${isPlaying}`);
    } else {
      alert("Simulation has ended.");
    }
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Pseudorandom will allow the system to decide which rule will be executed. Unchecking it will let you decide.
    </Tooltip>
  );
  const handleReset = () => {
    if(time != 0){
      setNeurons(draft => draft = JSON.parse(window.localStorage.getItem('originalNeurons')));
      setTime(0);
      setIsPlaying(false);
      setHasEnded(false);
      var tempNeurons = window.localStorage.getItem('originalNeurons');
      window.localStorage.clear();
      window.localStorage.setItem('originalNeurons', tempNeurons);
    }
  }

  const [guidedRules, setGuidedRules] = useState({});
  const handleStartGuidedMode = async (rules) => {
    await setGuidedRules(rules);
    setShowChooseRuleModal(true);
    if (setShowChooseRuleModal) {
      setIsPlaying(false); //pauses the graph playing while choosing rule
    }
  }
  const handleChosenRules = (data) => {
    handleCloseChooseRuleModal();
    setNeurons((draft) => {
      for (var j in draft) {
        for (var k in data) {
          if (j == k) {
            var [requires, grouped, symbol, consumes, produces, delay] = parseRule(data[k]);
            draft[j].delay = delay
            //console.log(data[k]);
            draft[j].currentRule = data[k];
            draft[j].chosenRule = data[k];
          }
        }
      }
    });
    //setIsPlaying(true); // continue playing after choosing rule
  }
  const onForward = async () => {
    if (time == 0) {
      //copy
      console.log("Time is: " + time);
      window.localStorage.setItem('originalNeurons', JSON.stringify(JSON.parse(JSON.stringify(neurons))));
      window.localStorage.setItem('shouldTimeStep', "1");
      console.log("Original neurons on time = 1 ", window.localStorage.getItem('originalNeurons'));
    }
    if (!hasEnded) {
      console.log("Time is: " + time);
      await setNeurons(neurons => step(neurons, time, isRandom, handleStartGuidedMode, handleSimulationEnd));
      if(window.localStorage.getItem('shouldTimeStep') == "1"){
        setTime(time => time + 1);
      }
      console.log(`Local storage space used: ${JSON.stringify(localStorage).length * 2}`);
    } else {
      alert("Simulation has ended.");
    }
  }
  const onBackward = async () => {
    if (time > 1) {
      var tempTime = time.valueOf();
      setHasEnded(false);
      await setNeurons(neurons => backStep(tempTime - 2));
      await setTime(time => time - 1);

    }
    else if (time == 1) {
      handleReset();
    }

  }
  const neuronsRef = useRef(neurons)
  neuronsRef.current = neurons
  const onIntervalStepRef = useRef(onForward)
  onIntervalStepRef.current = () => {
    onForward();
    setPBar(p => p + 1);
  }
  useEffect(() => {
    if (isPlaying) {
      var interval = setInterval(() => {
        onIntervalStepRef.current()
      }, 3000) /// simulation speed
    }
    return () => clearInterval(interval);
  }, [isPlaying, onIntervalStepRef])

  useEffect(() => {
    if (showChooseRuleModal) {
      console.log("showChooseRuleModal is true");
    }
  }, [])

  // Key Bindings 
  function handleSpace() {
    console.log("Space Pressed");
    setIsPlaying(p => !p);
  }

  function handleRightKey() {
    console.log("Right Key Pressed");
    if (!hasEnded) {
      onIntervalStepRef.current();
    }
  }

  function handleLeftKey() {
    console.log("Left Key Pressed");
    onBackward();
  }

  useKey("Space", handleSpace);
  useKey("ArrowLeft", handleLeftKey);
  useKey("ArrowRight", handleRightKey);
  /// handle backspace key for deleting neurons/synapses

 


  return (
    <Router>
      <Tour handleShowDropdownBasic={handleShowDropdownBasic} handleCloseDropdownBasic={handleCloseDropdownBasic} handleShowSideBarMenu={handleShowSideBarMenu} handleCloseSideBarMenu={handleCloseSideBarMenu} restartTutorial={restartTutorial} handleFalseRestartTutorial={handleFalseRestartTutorial}/> 
      <Switch>
        <Route path="/">
          <Container>
            {error && <Alert variant="danger">
              {error}
            </Alert>}
            <Menu id="side-bar-menu" isOpen={showSideBarMenu} onClick={handleSideBarMenu} disableCloseOnEsc disableOverlayClick noOverlay>

              <Form>
                <Form.File
                  id="custom-file"
                  label={fileName ? fileName : "Load file..."}
                  custom
                  onChange={(e) => { handleLoad(e.target) }}
                />
              </Form>
              <div>
                <Button id="save-btn" variant="primary" disabled={time > 0 ? true : false} onClick={handleSave}><Save2 />{' '}Save</Button>
              </div>
              <div>
                <Button id="choice-history-btn" variant="primary" onClick={handleShowChoiceHistoryModal}><ClockHistory />{' '}Choice History</Button>
              </div>
              <div>
                <DropdownButton id="file-dropdown" title="Download samples">
                  <Dropdown.Item href="./samples/3k+3 spiker.xmp" download>3k+3 Spiker</Dropdown.Item>
                  <Dropdown.Item href="./samples/bitadder.xmp" download>Bitadder</Dropdown.Item>
                  <Dropdown.Item href="./samples/increasing comparator.xmp" download>Increasing Comparator</Dropdown.Item>
                  <Dropdown.Item href="./samples/naturally even.xmp" download>Naturally Even</Dropdown.Item>
                  <Dropdown.Item href="./samples/naturally greater one.xmp" download>Naturally Greater One</Dropdown.Item>
                </DropdownButton>
              </div>
              <div>
                <Button id="restart-tour" variant="primary" onClick={handleTrueRestartTutorial}>Restart Tutorial</Button>
              </div>
            </Menu>
            <div>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontWeight: "700" }} className="websnapse-title">WebSnapse</h1>
              </div>
              <Row>
                <Col>
                  <div>

                    <Form>
                      <Form.Group id="formGridCheckbox">
                        <Row>
                          <Col sm={8}>
                            <Form.Check type="checkbox"
                              label="Pseudorandom Mode"
                              defaultChecked={isRandom}
                              onChange={() => {
                                setIsRandom(!isRandom)
                              }} />
                          </Col>

                          <Col sm={1} style={{ textAlign: "left" }}>
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 250, hide: 400 }}
                              overlay={renderTooltip}
                            >
                              <QuestionCircle />
                            </OverlayTrigger>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Form>
                    {time == 0 ? <div></div> :
                      <div style={{ backgroundColor: "#778beb", color: "white", borderRadius: "10px", padding: "0.5em" }}>
                        <ClockFill color="white" size={30} /> <strong>Time:</strong> {time == 0 ? "Start playing!" : time}
                      </div>
                    }

                  </div>
                </Col>
                <Col>
                  <div className="snapse-controls" style={{ textAlign: "center", marginBottom: "0.8em" }}>
                    <Button variant="link" onClick={onBackward}><SkipBackwardFill /></Button>{' '}
                    <div style={{ display: 'inline-block' }}>
                      <ProgressBar key={pBar} isPlaying={isPlaying} />
                      <Button size="lg" className="snapse-controls-play" onClick={handlePlay}>{isPlaying ? <PauseFill /> : <PlayFill />}</Button>
                    </div> {' '}
                    <Button variant="link" onClick={() => onForward()}><SkipForwardFill /></Button>{' '}

                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Dropdown show={showDropdownBasic} onClick={handleDropDownBasic}>
                      <Dropdown.Toggle id="dropdown-basic">
                        <PlusSquare />{' '}Node Actions
                    </Dropdown.Toggle> {/* Handle row of buttons (convert text to icons) */}
                      <Dropdown.Menu>
                        <Dropdown.Item id="new-node-btn"><Button variant="link" size="sm" className="node-actions text-primary" onClick={handleShow} disabled={time > 0 ? true : false}>New Node</Button></Dropdown.Item>
                        <Dropdown.Item id="new-input-btn"><Button variant="link" size="sm" className="node-actions text-primary" onClick={handleShowNewInputModal} disabled={time > 0 ? true : false}>New Input Node</Button></Dropdown.Item>
                        <Dropdown.Item id="new-output-btn"><Button variant="link" size="sm" className="node-actions text-primary" onClick={handleShowNewOutputModal} disabled={time > 0 ? true : false}>New Output Node</Button></Dropdown.Item>
                        <Dropdown.Item id="edit-node-btn"><Button variant="link" size="sm" className="node-actions text-info" onClick={handleShowEditModal} disabled={time > 0 ? true : false}>Edit</Button></Dropdown.Item>
                        <Dropdown.Item id="del-node-btn"><Button variant="link" size="sm" className="node-actions text-danger" onClick={handleShowDeleteModal} disabled={time > 0 ? true : false}>Delete</Button></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
                <Col style={{ textAlign: "right" }}><Button variant="danger" onClick={handleReset}>Restart Simulation</Button>{' '}</Col>
              </Row>
            </div>
            <hr />
            <Snapse
              neurons={neurons}
              onEdgeCreate={(src, dst, addedEles) => {
                onEdgeCreate(src.id(), dst.id())
                addedEles.remove();
              }}
              handleChangePosition={handleNewPosition}
              handleShowDeleteAll = {handleShowDeleteAll}
              headless={headless} />
            <ChoiceHistory time={time}
              showChoiceHistoryModal={showChoiceHistoryModal}
              handleCloseHoiceHistoryModal={handleCloseHoiceHistoryModal}/>\
            <AddSynapseWeightForm showAddWeightModal={showAddWeightModal}
              handleCloseAddWeightModal={handleCloseAddWeightModal}
              handleAddWeight={handleAddWeight}
              handleError={showError} 
              srce = {srce}
              dest = {dest} />              
            <NewNodeForm showNewNodeModal={showNewNodeModal}
              handleCloseModal={handleClose}
              handleNewNode={handleNewNode}
              handleError={showError} />
            <NewOutputNodeForm showNewOutputModal={showNewOutputModal}
              handleCloseNewOutputModal={handleCloseNewOutputModal}
              handleNewOutput={handleNewOutput}
              handleError={showError} />
            <NewInputNodeForm showNewInputModal={showNewInputModal}
              handleCloseNewInputModal={handleCloseNewInputModal}
              handleNewInput={handleNewInput}
              handleError={showError} />
            <EditNodeForm showEditModal={showEditModal}
              handleCloseEditModal={handleCloseEditModal}
              handleEditNode={handleEditNode}
              handleError={showError}
              neurons={neurons} />
            <DeleteAllForm showDeleteAllModal={showDeleteAllModal}
              handleCloseDeleteAllModal={handleCloseDeleteAllModal}
              handleDeleteAll={handleDeleteAll}
              handleError={showError}
            />
            <DeleteNodeForm showDeleteModal={showDeleteModal}
              handleCloseDeleteModal={handleCloseDeleteModal}
              handleDeleteNode={handleDeleteNode}
              handleError={showError}
              neurons={neurons}
            />
            <ChooseRuleForm showChooseRuleModal={showChooseRuleModal}
              handleCloseChooseRuleModal={handleCloseChooseRuleModal}
              rules={guidedRules}
              handleChosenRules={handleChosenRules}
            />
            {Prompt}
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}

const shortening = keyframes`
  from {
    transform: scaleX(100%);
  }

  to {
    transform: scaleX(0%);
  }
`
const ProgressBar = styled.div`
  ${props =>
    props.isPlaying &&
    css`
      animation: ${shortening} 3s linear; 
    `}
  background-color: #c44569;
  height: 4px;
  transform-origin: left center;
  margin-bottom: 2px;
`


export default App;
