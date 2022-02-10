import React from 'react';
import { fireEvent, render, screen, getByText } from '@testing-library/react';
import EditNodeForm from '../EditNodeForm';
const neurons = {
    n1: {
        id: "n1",
        position: { x: 50, y: 50 },
        rules: 'a+/a->a;2',
        startingSpikes: 1,
        delay: 0,
        spikes: 1,
        isOutput: false,
        out: ['n2']
    }
}
test('renders edit node form', async () =>{
    const { queryByTestId } = render(<EditNodeForm showEditModal={true} neurons={neurons}/>);
    //renderform
    expect(queryByTestId('edit-node-form')).toBeInTheDocument
});
test('successful submit', ()=>{
    const handleEditNode=jest.fn();
    const handleCloseEditModal=jest.fn();
    const { getByTestId, getByLabelText } = render(<EditNodeForm showEditModal={true} neurons={neurons}
        handleEditNode={handleEditNode}
        handleCloseEditModal={handleCloseEditModal}/>); 
    //answer the form
    fireEvent.change(getByTestId("select-option"), { target: { value: "n1" } });
    fireEvent.change(getByLabelText("Node Rules"), {
        target: {value: 'a/a->a;1'},
    });
    fireEvent.change(getByLabelText("Starting Spike Number"), {
        target: {value: 0},
    });
    //submit
    fireEvent.click(screen.getByTestId('edit-node-submit-button'));
    expect(handleEditNode).toHaveBeenCalledTimes(1);
    expect(handleCloseEditModal).toHaveBeenCalledTimes(1);
});
test('shows error on wrong submit', ()=>{
    const handleEditNode=jest.fn();
    const handleError=jest.fn();
    const { getByTestId, getByLabelText } = render(<EditNodeForm showEditModal={true} 
        neurons={neurons}
        handleError={handleError}/>); 
    //answer the form
    fireEvent.change(getByLabelText("Node Rules"), {
        target: {value: 'wrong value'},
    });
    //submit
    fireEvent.click(screen.getByTestId('edit-node-submit-button'));
    expect(handleError).toHaveBeenCalledTimes(1);
})
