
import React, { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";


// Tour steps
const TOUR_STEPS = [
  {
    target: ".websnapse-title",
    title:"Welcome to WebSnapse!",
    content: "This is a visual simulator to aid in the creation and simulation of SN P systems.",
    placement:'center',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  /*{
      target: "#dropdown-basic",
      title: "Node Actions",
      content: "Here we can find several actions you can do to create your SN P system.",
      placement: 'right',
      offset: 30,
      disableBeacon: true,
      disableOverlayClose: true,
      floaterProps: {
        disableAnimation: true,
      }
  },*/
  {
    target:"#new-node-btn",
    title: "New Node",
    content: "You can create a new neuron here. You will then be prompted to give it a label name, rules and the number of spikes the neuron should initially contain.",
    placement: 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  ///(a+)(\+*\**)\/(a+)->(a+);([0-9]+)/
  {
    target:"#new-node-btn",
    title:"Creating Rules",
    content:"When writing rules, it should follow the format E/c->p;d, where E follows the regular expression (a+)(\+*\**), c is (a+) with length equal to the number of spikes consumed, p is (a+) with length equal to the number of spikes produced and d equal to the delay.",
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#new-output-btn",
    title: "New Output Node",
    content: "You can also create output neurons to receive the output of your system in the form of a bitstring, with the bits representing whether the output neuron  receives a spike or not at the given time.",
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  }, 
  {
    target:"#edit-node-btn",
    title: "Edit Node",
    content:"You can edit a neuron by choosing the neuron ID of the neuron you would like to edit. The neurons are ordered from oldest to last added. You can edit the rules and spikes of the neuron. You can choose to cancel or save the changes you made, which will be seen right after.",
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#del-node-btn",
    title: "Delete Node",
    content:"You can delete a neuron by choosing the neuron ID of the neuron you would like to delete. The neurons are ordered from oldest to last added. Deleting a neuron will also delete the synapses connected to the neuron. You can choose to cancel or save the changes you made, which will be seen right after.",
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:".__________cytoscape_container",
    title: "The Workspace",
    content:"After adding a neuron, you will be able to see a visual representation here.  Inside each neuron, you will find the number of spikes the neuron has at the top, and its rules at the center. Below the neuron, you will find the current delay timer before the neuron spikes. By default, this is set to 0 and a neuron is set to spike at -1. ",
    placement:'bottom-start',
    offset:-400,
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:".__________cytoscape_container",
    title:"Creating Edges",
    content:"To create s or edges,  hover over the source node or neuron then a grey circle will appear and you can drag that to see a directed arrow that you can connect to your desired next node or neuron. ",
    placement:'bottom-start',
    offset:-400,
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }

  },
  {
    target:".snapse-controls",
    title:"Starting the Simulation",
    content:"Now it's time for simulations! You can simulate the system one step at a time by using the forward button. You can use the backward button to revert the system to the previous timestep.",
    placement:'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:".snapse-controls",
    title:"Starting the Simulation",
    content:"You can also simulate the system continuously by clicking the play button. It will then proceed to go step-by-step at 3 second intervals until the simulation is paused or the system halts.",
    placement:'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#formGridCheckbox",
    title:"Pseudorandom or Guided Mode",
    content:"If your system contains points of non-determinism, or rather, if a neuron can execute more than one rule at a time, you can choose to set the simulation to pseudorandom or guided mode. When using guided mode, you will be prompted to choose which rule the neuron should follow for that timestep. ",
    placement:'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  }, 
  {
    target:"#react-burger-menu-btn",
    title:"Menu Actions",
    content:"In this menu, you will find other actions such as saving/loading files, viewing the choice history and some sample systems.",
    placement:'right',
    offset: 390,
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#custom-file",
    title: "Loading Files",
    content:"You can open pre-made or saved SNP Systems files in XML format.",
    offset: 45,
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  }, 
  {
    target:"#save-btn",
    title: "Saving Systems",
    content:"You can also save the current system you are working on. It will create an XML file.",
    offset: 160,
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#choice-history-btn",
    title:"Choice History",
    content:"Here you can view a table containing the rules each neuron applied per timestep.",
    offset: 90,
    placement: 'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target:"#file-dropdown",
    title:"Download Samples",
    content:"Lastly, you can download some of the sample SN P systems prepared here to start you off!",
    offset: 65,
    placement:'right',
    disableBeacon: true,
    disableOverlayClose: true,
    floaterProps: {
      disableAnimation: true,
    }
  },
  {
    target: ".websnapse-title",
    title:"Get Started",
    content:"And that's the end of the tutorial! Enjoy creating and simulating your own SN P systems!",
    placement:'center',
    disableBeacon: true,
    disableBeacon:true,
    floaterProps: {
      disableAnimation: true,
    }
  }
];

// Initial state for the tour component
const INITIAL_STATE = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true, // Show next button
  loading: false,
  stepIndex: 0, // Make the component controlled
  steps: TOUR_STEPS
};


// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // start the tour
    case "START":
      return { ...state, run: true };
    // Reset to 0th step
    case "RESET":
      return { ...state, stepIndex: 0 };
    // Stop the tour
    case "STOP":
      return { ...state, run: false };
    // Update the steps for next / back button click
    case "NEXT_OR_PREV":
      return { ...state, ...action.payload };
    // Restart the tour - reset go to 1st step, restart create new tour
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date()
      };
    default:
      return state;
  } 
};
// styles

const styles ={
  beaconInner: {
    backgroundColor: '#786fa6'
  },
  tooltip:{
    backgroundColor: '#fff',
    textColor: '#333',
    fontSize: 14
  },
  tooltipContainer: {
    textAlign: "center"
  },
  tooltipTitle: {
    fontSize: 17,
    margin: '0 0 0 0'
  },
  buttonNext: {
    backgroundColor: '#786fa6'
  },
  buttonBack: {
    color: '#786fa6'
  },
  buttonSkip:{
    color:'#786fa6'
  },
  overlay:{
    backgroundColor: 'rgba(0,0,0, 0.7)',
    mixBlendMode: 'multiply'
  },
  spotlightLegacy:{
    boxShadow: `0 0 10 5 rgba(0,0,0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3)`
  },
  floater: {
    arrow: {
      color: '#fff',
    },
    tooltip: {
      zIndex: 100,
    },
  }
}

// Tour component
const Tour = ({handleShowDropdownBasic, handleCloseDropdownBasic, handleShowSideBarMenu, handleCloseSideBarMenu, restartTutorial, handleFalseRestartTutorial}) => {
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    if (!localStorage.getItem("tour")) {
      dispatch({ type: "START" });
    }
  }, []);

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    localStorage.setItem("tour", "1");
  };

  const callback = data => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) }
      });
    } else if (index === 0){
      handleCloseSideBarMenu();
    }else if (index === 1) {
      handleShowDropdownBasic();
      handleFalseRestartTutorial();
    } else if (index === 1 && action === ACTIONS.PREV){
      handleCloseDropdownBasic();
    } else if (index === 7){
      handleCloseDropdownBasic();
    } else if (index === 12){
      handleShowSideBarMenu();
    } else if (index === 17){
      handleCloseSideBarMenu();
      setTourViewed();
    }
  };

  const startTour = () => {
    // Start the tour manually
    dispatch({ type: "RESTART" });
  };

  useEffect(() => {
    if(restartTutorial == true){
      startTour();
    }
  }, [restartTutorial]);

  return (
    <>
      <JoyRide 
      {...tourState}
      // Callback will pass all the actions
      callback={callback}
      scrollToFirstStep={true}
      showSkipButton={true} 
      hideBackButton={false} 
      showProgress={true}
      continuous={true}
      styles={styles}
      locale={{
        last: "End tour",
        skip: "Skip tour"
      }} />
    </>
  );
};

export default Tour;