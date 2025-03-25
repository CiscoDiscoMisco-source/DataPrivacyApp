import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../../components/Navigation';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
    };
  },
}));

describe('Navigation Component', () => {
  test('renders navigation component', () => {
    render(<Navigation />);
    
    // Check if the navigation element exists
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(<Navigation />);
    
    // Check if all the navigation links are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  test('displays app name', () => {
    render(<Navigation />);
    
    // Check if the app name is displayed
    expect(screen.getByText('Data Privacy App')).toBeInTheDocument();
  });
}); 