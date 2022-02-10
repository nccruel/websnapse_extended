import React from 'react'
import ReactDOM from 'react-dom'
import Snapse from './Snapse'

describe('Snapse', () => {
    const div = document.createElement('div')
    const neurons = {};
    const onEdgeCreate = () => {return "test"};
    const handleChangePosition = () => {return "test"};
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <Snapse neurons={neurons}
                onEdgeCreate={onEdgeCreate}
                handleChangePosition={handleChangePosition}
                headless={true} />,
            div

        )
    })
});