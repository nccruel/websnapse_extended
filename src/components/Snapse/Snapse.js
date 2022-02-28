
import CytoscapeComponent from 'react-cytoscapejs';
import stylesheet from '../stylesheet'
import { Button, Container } from 'react-bootstrap';
import useAnimateEdges from './useAnimateEdges';
import { useEffect, useMemo } from 'react';
import { convertElements } from '../../utils/helpers';
import { AlignCenter, Trash } from 'react-bootstrap-icons';
import Slider from '@mui/material/Slider';


const Snapse = ({ neurons, onEdgeCreate, handleShowDeleteAll, handleChangePosition, setIsClickedSynapse, headless }) => {

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
        // if DEL/BSPACE key is pressed, pass edge ID to the delete edge handler
        cy.on('click', 'edge', (eve) => {
          // record edge ID
          const edgeID = eve.target.id();
          console.log("Edge ID:", edgeID);
          var temp_edgeArr = edgeID.split("->");         

          var srcID = temp_edgeArr[0];
          var dstID = temp_edgeArr[1];
          
          const edgeArr = [srcID, dstID];
          // console.log("Source & dest:", edgeArr);

          isClickedSynapse = true;

          //handleDeleteSynapse(srcID, dstID, edgeArr);
          //var input = document.getElementById('user_inp');

          setIsClickedSynapse(isClickedSynapse, srcID, dstID);
          console.log("ISCLICK", isClickedSynapse, srcID, dstID);
          
        }) 

        cy.on('mouseover', '.snapse-node, .snapse-output, .snapse-input, edge', (ev) => {
          // console.log("Hover", ev.target.id());

        })
        cy.on('click', function(event){
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
          else{
            var evtTargetID = event.target.id();
            if(elements.edgeIDs.has(evtTargetID)){
              console.log('tap on edge');
            }
            else {
              console.log('tap on some element');
              isClickedSynapse = false;
              setIsClickedSynapse(isClickedSynapse, srcID, dstID);
              
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
        })
        
        // cy.elements().unbind('mouseover');
        // cy.elements().bind('mouseover', (event) => event.target.id.show());

        // cy.elements().unbind('mouseout');
        // cy.elements().bind('mouseout', (event) => event.target.id.hide());
        // ;
      }
    }
    
  }, [cyRef, headless]);
  return headless ? (<div id="cyHeadless"></div>) : (
    <div style={{
      width: "100%",
      height: "100%"
    }}>
      <Button className="center-graph-button" variant="secondary" onClick={handleCenterGraph}><AlignCenter />{' '}Center Graph</Button>
      <Button className="clear-nodes-button" style={{float: 'right'}} variant="danger" onClick={handleShow}><Trash />{' '}Clear All</Button>
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