import React from 'react';
import { render, screen } from '@testing-library/react';
import ChoiceHistory from './ChoiceHistory';

test('test choice history component', async () =>{
    const time = 0;
    const handleCloseHoiceHistoryModal = () => {return false}
    const {queryByTestId} = render(<ChoiceHistory
        time={time}
        showChoiceHistoryModal={true}
        handleCloseHoiceHistoryModal={handleCloseHoiceHistoryModal}
    />);
    //table should be rendering
    expect(queryByTestId('choice-history-table')).toBeInTheDocument
})