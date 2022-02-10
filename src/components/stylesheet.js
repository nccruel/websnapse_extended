const styles = [
    {
        selector: '.snapse-node, .snapse-output',
        style: {
            'font-family': 'Computer Modern',
            'background-opacity': '0',
            'padding-top': '0',
            'border-width': 0,
            'text-halign': 'left',
            'text-valign': 'top',
            color: 'black',
            content: 'data(label)'
        }
    },
    {
        selector: '.snapse-node__closed',
        style: {
            'font-family': 'Computer Modern',
            'background-opacity': '0',
            'padding-top': '0',
            'border-width': 0,
            'text-halign': 'left',
            'text-valign': 'top',
            'background-color':'gray',
            color: 'black',
            content: 'data(label)'
        }
    },
    {
        selector: '.snapse-node__rules, .snapse-node__output',
        style: {
            'font-family': 'Computer Modern',
            'font-style':'italic',
            'background-color': 'white',
            'border-width': 1,
            events: 'no',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'text-halign': 'center',
            'text-valign': 'center',
            content: 'data(label)',
            'height': 150,
            shape: 'roundrectangle',
            width: 100
        }
    },
    {
        selector: '.snapse-node__rules__closed',
        style: {
            'font-family': 'Computer Modern',
            'font-style':'italic',
            'background-color': 'gray',
            'border-width': 3,
            events: 'no',
            'text-halign': 'center',
            'text-valign': 'center',
            'text-wrap':'wrap',
            'text-max-width': '100px',
            content: 'data(label)',
            height: 150,
            shape: 'roundrectangle',
            width: 100
        }
    },
    {
        selector: '.snapse-node__time, .snapse-node__spike',
        style: {
            'font-family': 'Computer Modern',
            'background-opacity': '0',
            'text-halign': 'center',
            'text-valign': 'center',
            content: 'data(label)',
            events: 'no',
            height: 15,
            shape: 'roundrectangle',
            width: 50
        }
    },
    {
        selector: '.snapse-node__time__closed, .snapse-node__spike__closed',
        style: {
            'font-family': 'Computer Modern',
            'background-opacity': '0',
            'text-halign': 'center',
            'text-valign': 'center',
            content: 'data(label)',
            events: 'no',
            height: 15,
            shape: 'roundrectangle',
            width: 50
        }
    },
    /*     {
            selector: 'node',
            style: {
                'background-opacity': '0',
                'padding-top': '0',
                'text-halign': 'left',
                'text-valign': 'top',
                color: 'black',
                content: 'data(label)',
                'border-width': 1,
                events: 'no',
                'text-wrap': 'wrap',
                shape: 'roundrectangle'
            }
        }, */
    {
        selector: 'edge',
        style: {
            'font-family': 'Computer Modern',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'text-background-color': 'white',
            'text-background-shape': 'rectangle',
            width: 1
        }
    },
    {
        selector: '.edge--triggering',
        style: {
          'line-color': 'magenta',
          'line-style': 'dashed',
          'target-arrow-color': 'magenta',
          'line-color': 'magenta',
          'line-style': 'dashed',
          'target-arrow-color': 'magenta',
          'width': 4,
          'line-dash-offset': 3,
          'line-dash-pattern': [15,3],
          'arrow-scale': 1.5
        }
    },
]
export default styles;
