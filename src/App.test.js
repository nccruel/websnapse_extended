import React from 'react';
import { fireEvent, render, screen, getByText } from '@testing-library/react';
import App from './App';

it('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText('WebSnapse')).toBeInTheDocument();
});