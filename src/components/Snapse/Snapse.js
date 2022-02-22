
import CytoscapeComponent from 'react-cytoscapejs';
import stylesheet from '../stylesheet'
import { Button, Container } from 'react-bootstrap';
import useAnimateEdges from './useAnimateEdges';
import { useEffect, useMemo } from 'react';
import { convertElements } from '../../utils/helpers';
import { AlignCenter } from 'react-bootstrap-icons';
import { XSquareFill } from 'react-bootstrap-icons';

const Snapse = ({ neurons, onEdgeCreate, handleChangePosition, headless }) => {
  const [cyRef, setCy] = useAnimateEdges()
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
        cy.on('mouseup', 'edge', (eve) => {
          
          const edgeID = eve.target.id();
          console.log("Edge ID:", edgeID);
          var temp_edgeArr = edgeID.split("-");         

          var srcID = temp_edgeArr[0] + "-"+ temp_edgeArr[1];
          var dstID = temp_edgeArr[2] + "-"+ temp_edgeArr[3];
          
          const edgeArr = [srcID, dstID];
          console.log("Source & dest:", edgeArr);
          // record edge ID
          // if DEL/BSPACE key is pressed, pass edge ID to the delete edge handler
        }) 
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
      <Button className="center-graph-button" variant="secondary" onClick={handleCenterGraph}><AlignCenter />{' '}Center Graph</Button>
      <Button className="clear-nodes-button" style={{float: 'right'}} variant="danger" onClick={handleCenterGraph}><XSquareFill />{' '}Clear All</Button>
      <CytoscapeComponent
        cy={setCy}
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