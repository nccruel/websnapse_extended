
import CytoscapeComponent from 'react-cytoscapejs';
import stylesheet from '../stylesheet'
import { Button, Container } from 'react-bootstrap';
import useAnimateEdges from './useAnimateEdges';
import { useEffect, useMemo } from 'react';
import { convertElements } from '../../utils/helpers';
import { AlignCenter, Trash, Eye, PencilSquare, XCircle} from 'react-bootstrap-icons';
import "./popper.css";
import Slider from '@mui/material/Slider';


const Snapse = ({ neurons, onEdgeCreate, handleShowDeleteAll, handleChangePosition, setIsClickedSynapse, headless, setNeurons, splitRules, 
  checkIsHover, handleShowEditSynapseModal, handleShowDeleteSynapseModal, time}) => {  

  var isClickedSynapse = false;

  const [cyRef, setCy] = useAnimateEdges()
  const handleShow = () => {
    handleShowDeleteAll();
  };

  function handleCenterGraph() {
    const cy = cyRef.current;
    
    if (cy) {
      
      cy.center();
      cy.fit();
      cy.zoom({
        level: 0.8,
        position: { x: 100, y: 100 }
      });
    }
  }
  const elements = convertElements(neurons);
  
  useEffect(() => {
    if (!headless) {
      const cy = cyRef.current
      if (cy) {     
      
        cy.on('mouseup', '.snapse-node, .snapse-output, .snapse-input', (evt) => {
          console.log("change position", evt.target.id());
          handleChangePosition(evt.position, evt.target.id());
        })

        cy.on('tap', function(event){
          // target holds a reference to the originator
          // of the event (core or element)
          var evtTarget = event.target;
          var srcID = '.';
          var dstID = '.';

          if (evtTarget == cy){
            console.log('tap on background');
            isClickedSynapse = false;
            console.log('EVT', cy);            
            setIsClickedSynapse(isClickedSynapse, srcID, dstID);
  
          }

          else if (evtTarget.isNode()){
            isClickedSynapse = false;
            setIsClickedSynapse(isClickedSynapse, srcID, dstID);
            console.log("Tap on NODE");
          }

          else if (evtTarget.isEdge()){
            console.log("Tap on EDGE");

            // record edge ID
            const edgeID = evtTarget.id();
            console.log("Edge ID:", edgeID);
            var temp_edgeArr = edgeID.split("->");         

            srcID = temp_edgeArr[0];
            dstID = temp_edgeArr[1];            

            isClickedSynapse = true;

            setIsClickedSynapse(isClickedSynapse, srcID, dstID);
            console.log("ISCLICK", isClickedSynapse, srcID, dstID);
            }
          
        });
      

        cy.elements().unbind("mouseover");
        cy.elements().bind("mouseover", (event) => {

          var checker = Boolean(checkIsHover());
          console.log("checker", checker);

          if (event.target.isNode() && checker) {
            console.log("Hovering here", checker);
            event.target.popperRefObj = event.target.popper({
              content: () => {
                let content = document.createElement("div");
          
                content.classList.add("popper-div");

                setNeurons(draft => {      
                  let node = draft[event.target.id()];

                  let node_type;									

                  if (node.isInput || node.isOutput) {
                    if (node.isInput) {
											node_type = "Input neuron";
										}
										else {
											node_type = "Output neuron";
										}										
										var bitstring = "<i>None </i>";

										if ((node.bitstring).length > 1){
											bitstring = node.bitstring;
										}										

                    content.innerHTML = "<b>Node ID: </b>" + node.id + "<br />" + "<br />" +
                                        "<b>Node Type: </b>" + node_type + "<br />" + "<br />" +
                                        "<b>Spike train: </b>" + bitstring + "<br />";
                  }        
                  else {
                    node_type = "Regular neuron";
										var [spkRules, frgRules] = splitRules(node.rules);
										var strSpkRules, strFrgRules;

										if (spkRules.length == 0) {
											strSpkRules = "<i> None </i>";
										}
										else {
											strSpkRules = spkRules.join("<br> ");
										}

										if (frgRules.length == 0) {
											strFrgRules = "<i> None </i>";
										}
										else {
											strFrgRules = frgRules.join("<br> ");
										}
									
                    content.innerHTML = "<b>Node ID: </b>" + node.id + "<br />" + "<br />" +
                                        "<b>Node Type: </b>" + node_type + "<br />" + "<br />" +
                                        "<b>Current number of spikes: </b>" + node.spikes + "<br />" + "<br />" +
																				"<b>Spiking rule/s: </b> <br>" + strSpkRules + "<br />" + "<br />" +
																				"<b>Forgetting rule/s: </b> <br>" + strFrgRules + "<br />";
                  }

                })
          
               
                document.body.appendChild(content);
               
                return content;
              },
            });
          }
          else if (event.target.isEdge() && checker) {
            console.log("HOVERING EDGE");
            event.target.popperRefObj = event.target.popper({
              content: () => {
                let content = document.createElement("div");
          
                content.classList.add("popper-div");

                const edgeID = event.target.id();
                console.log(edgeID);
                var edge_ID_arr = edgeID.split("->");
                var src = edge_ID_arr[0];
                var dst = edge_ID_arr[1];

                setNeurons(draft => {
                  var weightsDict = {...draft[src].outWeights};
                  var synapse_weight = parseInt(weightsDict[dst]);
    
                  content.innerHTML = "<b>Synapse ID: </b>" + edgeID + "<br />" + "<br />" +
                                      "<b>Source Node: </b>" + src + "<br />" + "<br />" +
                                      "<b>Destination Node: </b>" + dst + "<br />" + "<br />" +
                                      "<b>Synapse Weight: </b>" + synapse_weight + "<br />";
                })
          
                
                document.body.appendChild(content);
                
                return content;
              },
            });

          }
        });
        
        cy.elements().unbind("mouseout");
        cy.elements().bind("mouseout", (event) => {
          var checker = Boolean(checkIsHover());
          if ((event.target.isNode() || event.target.isEdge()) && checker) {
            if (event.target.popper) {
              event.target.popperRefObj.state.elements.popper.remove();
              event.target.popperRefObj.destroy();
            }
          }
        });

        
        cy.gridGuide({
          guidelinesStyle: {
            strokeStyle: "black",
            horizontalDistColor: "#ff0000",
            verticalDistColor: "green",
            initPosAlignmentColor: "#0000ff",
          }
        });
        cy.edgehandles({
          handleNodes: '.snapse-node, .snapse-node__closed, .snapse-input',
          preview: false,
          loopAllowed: () => false,
          edgeType: function (sourceNode, targetNode) {
            return 'flat'
            //return sourceNode.edgesTo(targetNode).empty() ? 'flat' : undefined
          },
          complete: onEdgeCreate
        });
        
      }
    }
    
  }, [cyRef, headless]);
  return headless ? (<div id="cyHeadless"></div>) : (
    <div style={{
      width: "100%",
      height: "100%"
    }}>
      <Button className="center-graph-button" variant="secondary" onClick={handleCenterGraph}><AlignCenter />{' '}Center Graph</Button>{" "}     
      <Button variant="success" size="md" id="edit-syn-btn" className="node-actions" onClick={handleShowEditSynapseModal} style={{ textAlign: "center", marginRight: "0.3em" }} disabled={time > 0 ? true : false}><PencilSquare />{' '}Edit Synapse</Button>
      <Button variant="warning" size="md" id="del-syn-btn" className="node-actions" onClick={handleShowDeleteSynapseModal} style={{ textAlign: "center", marginRight: "0.3em" }} disabled={time > 0 ? true : false}><XCircle />{' '}Delete Synapse</Button>
      <Button id="clear-all-btn" style={{float: 'right'}} variant="danger" onClick={handleShow}><Trash />{' '}Clear All</Button>
      <CytoscapeComponent
        cy={setCy}
        wheelSensitivity={0.3}
        elements={CytoscapeComponent.normalizeElements(elements)}
        style={{
          width: "100%",
          height: "100%"
        }}
        stylesheet={stylesheet} />
    </div>
  )
};

export default Snapse;