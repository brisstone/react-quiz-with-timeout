import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders WORLD AFFAIRS QUIZ', () => {
  render(<App />); 
  const linkElement = screen.getByText(/WORLD AFFAIRS QUIZ/i);
  expect(linkElement).toBeInTheDocument();
});