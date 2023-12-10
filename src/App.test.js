import React from 'react';
import { render } from '@testing-library/react';
import App from './App.js';

test('renders MyComponent without crashing', () => {
  render(<App />);
});
