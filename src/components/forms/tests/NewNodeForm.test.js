import React from 'react';
import { fireEvent, render, screen, getByText } from '@testing-library/react';
import NewNodeForm from '../NewNodeForm';

test('renders new node form', async () =>{
    const {queryByTestId} = render(<NewNodeForm showNewNodeModal={true}/>);
    //renderform
    expect(queryByTestId('new-node-form')).toBeInTheDocument
});
test('Submits form successfully', async () => {
    const handleNewNode = jest.fn();
    const handleClose = jest.fn();
    const showError = jest.fn();
    render(
        <NewNodeForm showNewNodeModal={true}
              handleCloseModal={handleClose}
              handleNewNode={handleNewNode}
              handleError={showError} />
    );
    // fill out the form
    fireEvent.change(screen.getByLabelText("Node Name"), {
        target: {value: 'chuck'},
    })
    fireEvent.change(screen.getByLabelText("Node Rules"), {
        target: {value: 'a/a->a;1'},
    });
    fireEvent.change(screen.getByLabelText("Starting Spike Number"), {
        target: {value: 0},
    });
    //submit
    fireEvent.click(screen.getByTestId('new-node-submit-button'));
    expect(handleNewNode).toHaveBeenCalledTimes(1);
})