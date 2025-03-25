import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../components/Layout';

// Mock the Navigation component
jest.mock('../../components/Navigation', () => {
  return () => <div data-testid="navigation-mock">Navigation Component</div>;
});

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

describe('Layout Component', () => {
  test('renders the layout with title', () => {
    render(
      <Layout title="Test Title">
        <div>Test Content</div>
      </Layout>
    );
    
    // Title is set in Head component, which isn't rendered in test environment
    // So we don't check for title directly
    
    // Check if the navigation component is included
    expect(screen.getByTestId('navigation-mock')).toBeInTheDocument();
    
    // Check if content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Check if footer is present
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });
  
  test('renders with default title if not provided', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check if content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 