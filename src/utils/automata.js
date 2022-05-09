import produce from 'immer'
export function parseRule(rule, id) {
    const re = /(a+)(\+*\**)\/(a+)->(a+);([0-9]+)/
    // const forgetRe = /(a+)(\(*a*\)*)(\+*\**)\/(a+)->(0);(0)/
    const forgetRe = /([1-9]*)a\(*([1-9]*)(a*)\)*(\+?|\*?)\/([1-9]*)a->(0);(0)/

    // const testRe = /(a+)\(*(a*)\)*(\+*\**)\/(a+)->(a+);([0-9]+)/
    // const testRe = /([1-9]*)a\(*([1-9]*)a*\)*(\+?|\*?)\/([1-9]*)a->([1-9]*)a;([0-9]+)/
    const testRe = /([1-9]*)a\(*([1-9]*)(a*)\)*(\+?|\*?)\/([1-9]*)a->([1-9]*)a;([0-9]+)/;
    const res = re.exec(rule);
    const testRes = testRe.exec(rule);
    const forgetRes = forgetRe.exec(rule);

    /* if (res) {
      const [, requires, symbol, consumes, produces, delayStr] = res
      const delay = parseInt(delayStr, 10)
      return[requires.length, symbol, consumes.length, produces.length, delay];
    } */
    if (testRes) {
        console.log("Test Res");
        var [, requires, grouped, char, symbol, consumes, produces, delayStr] = testRes
        const delay = parseInt(delayStr, 10)

        if (requires == ""){
            requires = 1;
        }
        if (char != "" && grouped == ""){
            grouped = 1;
        }

        if (consumes == ""){
            consumes = 1;
        }

        if (produces == ""){
            produces = 1;
        }

        console.log({'id': id, 'requires': requires, 'char': char, 'grouped': grouped, 'symbol':symbol, 'consumes': consumes, 'produces': produces, 'delay': parseInt(delayStr)} );

        return [parseInt(requires), parseInt(grouped), symbol, parseInt(consumes), parseInt(produces), delay];
    } else if (forgetRes) {
        var [, requires, grouped, char, symbol, consumes, produces, delayStr] = forgetRes;
        if (requires == ""){
            requires = 1;
        }

        if (char != "" && grouped == ""){
            grouped = 1;
        }

        if (consumes == ""){
            consumes = 1;
        }
        if (produces == ""){
            produces = 1;
        }
        
        console.log({'id': id, 'requires': requires, 'grouped': grouped, 'symbol':symbol, 'consumes': consumes, 'produces': produces, 'delay': parseInt(delayStr)} );
        return [parseInt(requires), parseInt(grouped), symbol, parseInt(consumes), 0, 0];
    }


    return false
}
export function canUseRule(requires, grouped, symbol, spikes, consumes) {
    if (consumes > spikes){
        return false;
    }

    if (symbol == '+') {
        if (grouped > 0) {
            if ((spikes - requires) % grouped == 0 && (spikes - requires) >= grouped) {
                return true;
            }
            return false;
        }
        if (spikes >= requires) {
            return true
        }
    }
    else if (symbol == '*') {
        if (grouped > 0) {
            if ((spikes - requires) % grouped == 0) {
                return true;
            }
            return false;
        }
        if (spikes >= requires - 1) {
            return true
        }
    }
    else if (spikes == requires) {
        return true;
    }
    return false;
}
export function step(neurons, time, isRandom, handleStartGuidedMode, handleSimulationEnd) {
    const newStates = produce(neurons, draft => {
        const spikeAdds = {}
        const outputTracker = [];
        const inputTracker = [];
        var neuronValidRules = {};
        var shouldEnd = true;

        for (var k in draft) {
            var neuron = draft[k];
            //choose rule to follow if not working on a rule currently
            if (!neuron.currentRule && !neuron.isOutput && !neuron.isInput) {
                delete draft[neuron.id].chosenRule;
                delete draft[neuron.id].currentRule;
                //pick a rule
                var rules = neuron.rules.split(' ');
                var validRules = [];
                for (var i = 0; i < rules.length; i++) {
                    var [requires, grouped, symbol, consumes, produces, delay] = parseRule(rules[i], k);
                    if (canUseRule(requires, grouped, symbol, neuron.spikes, consumes)) {
                        console.log("should end1", shouldEnd);
                        validRules.push(rules[i]);
                        shouldEnd = false;
                    }
                }
                console.log("should end2", shouldEnd);
                if (validRules.length == 1) {
                    draft[neuron.id].currentRule = validRules[0];
                    draft[neuron.id].chosenRule = validRules[0];
                    var [requires, grouped, symbol, consumes, produces, delay] = parseRule(validRules[0], k);
                    draft[neuron.id].delay = delay
                } else if (isRandom == true && validRules.length > 1) {
                    var randomIndex = Math.floor(Math.random() * (validRules.length))
                    var [requires, grouped, symbol, consumes, produces, delay] = parseRule(validRules[randomIndex], k);
                    draft[neuron.id].currentRule = validRules[randomIndex];
                    draft[neuron.id].chosenRule = validRules[randomIndex];
                    draft[neuron.id].delay = delay
                } else if (isRandom == false && validRules.length > 1) {
                    neuronValidRules[neuron.id] = validRules;
                }

            }
        }
        if (Object.keys(neuronValidRules).length > 0) {
            //console.log(neuronValidRules);
            window.localStorage.setItem('shouldTimeStep', "0");
            handleStartGuidedMode(neuronValidRules);
            return;
        }
        for (var k in draft) {
            var neuron = draft[k];
            var neuronOutWeights = {...neuron.outWeights};
            //work on the rule
            if (neuron.currentRule) {
                shouldEnd = false;
                if (neuron.delay >= 0) {
                    let newDelay = neuron.delay.valueOf();
                    newDelay--;
                    draft[neuron.id].delay = newDelay;
                }
                
                if (neuron.delay < 0) {
                    //consume spikes
                    var [requires, grouped, symbol, consumes, produces, delay] = parseRule(neuron.currentRule, k);
                   
                    let newSpikes = neuron.spikes.valueOf();
                    newSpikes -= consumes;

                    draft[neuron.id].spikes = newSpikes;
                    
                    //send spikes
                    if (neuron.out) {
                        const neuronOutKeys = neuron.out;
                        for (let k of neuronOutKeys) {
                            
                            spikeAdds[k] =
                                k in spikeAdds ? spikeAdds[k] + produces : produces
                            
                            spikeAdds[k] = spikeAdds[k]*neuronOutWeights[k];    // Multiply # of spikes by the SYNAPSE WEIGHT
                            console.log("Sent spikes from " + k + ": " + spikeAdds[k]);
                        }
                    }

                    //resolve rule
                    delete draft[neuron.id].currentRule;
                }
            } else if (neuron.isInput) {
                
                inputTracker.push(neuron.id);
                var spike_arr = (neuron.bitstring).split(",");
                var len = spike_arr.length;
                console.log("SPIKE ARR", spike_arr);

                if (neuron.out) {
                    const neuronOut_in = neuron.out;
                    for (let k of neuronOut_in) {    
                        var bit = parseInt(spike_arr[time]);                        
                        console.log("TIME", time);
                        console.log("LEN", len);
                        var spk;
                        console.log("Bit", bit);
                        if (time < len){        // Check if bitstring length is less than time
                            console.log("TIME OK");
                            shouldEnd = false;
                            let newDelay = neuron.delay.valueOf();
                            newDelay--;
                            draft[neuron.id].delay = newDelay;                           
                           
                            spk = bit*neuronOutWeights[k];    // Multiply # of spikes by the SYNAPSE WEIGHT
                           
                        }
                        else{
                            console.log("TIME EXCEED");
                            spk = 0;
                            draft[neuron.id].delay = 0;  
                        }                     
                        spikeAdds[k] = parseInt(spk);
                        console.log("Sent spikes from IN", spk);
                    }
                }
            } else if (neuron.isOutput) {
                outputTracker.push(neuron.id);
                if (!(k in spikeAdds)) {
                    spikeAdds[k] = 0
                }
            } else if (neuron.delay == -1 && !neuron.isInput) {
                draft[neuron.id].delay = 0;
            }
        }
        for (const k in spikeAdds) {
            //states[k].spikes -= spikeAdds[k]
            let newSpikes = parseInt(draft[k].spikes.valueOf());
            newSpikes += spikeAdds[k];
            
            draft[k].spikes = newSpikes;
            
            if (draft[k].isOutput) {
                var newString;
                if (time == 0){
                    newString = `${draft[k].bitstring}${spikeAdds[k] || 0}`
                }
                else{
                    newString = `${draft[k].bitstring},${spikeAdds[k] || 0}`
                }                
                draft[k].bitstring = newString;
            }
        }
        console.log("should end", shouldEnd);
        if (shouldEnd) {
            handleSimulationEnd();
        }
        window.localStorage.setItem('shouldTimeStep', "1");

    })
    localStorage.setItem(time + 'sec', JSON.stringify(newStates));
    return newStates;

}

export function null_step(neurons){
    const same_state = produce(neurons, draft => {
        console.log("new_state")
    })
    return same_state;
}

export function backStep(time) {
    console.log("back step automata");
    var oldState = JSON.parse(localStorage.getItem(time + 'sec'));
    return oldState;

}
export function initialize(neurons) {
    const states = {}
    for (const k in neurons) {
        const neuron = neurons[k]
        states[k] = initializeState(neuron)
    }
    return states
}
export function initializeState(neuron) {
    return {
        spikes: neuron.spikes,
        delay: 0
    }
}