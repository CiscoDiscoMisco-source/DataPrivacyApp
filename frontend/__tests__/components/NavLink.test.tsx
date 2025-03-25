import React from 'react';
import { render, screen } from '@testing-library/react';
import NavLink from '../../components/NavLink';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/test',
    };
  },
}));

describe('NavLink Component', () => {
  test('renders link with children', () => {
    render(
      <NavLink href="/test-link">
        Test Link
      </NavLink>
    );
    
    const link = screen.getByText('Test Link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test-link');
  });
  
  test('applies custom className', () => {
    render(
      <NavLink href="/test-link" className="custom-class">
        Test Link
      </NavLink>
    );
    
    const link = screen.getByText('Test Link');
    expect(link).toHaveClass('custom-class');
  });
  
  test('applies active styles when current pathname matches href', () => {
    // Router mock is set to /test
    render(
      <NavLink href="/test">
        Active Link
      </NavLink>
    );
    
    const link = screen.getByText('Active Link');
    expect(link).toHaveClass('glass-dark');
    expect(link).toHaveClass('text-primary-50');
  });
  
  test('applies inactive styles when current pathname does not match href', () => {
    // Router mock is set to /test
    render(
      <NavLink href="/other-path">
        Inactive Link
      </NavLink>
    );
    
    const link = screen.getByText('Inactive Link');
    expect(link).toHaveClass('glass');
    expect(link).toHaveClass('text-primary-100');
  });
  
  test('applies mobile view styles when mobileView prop is true', () => {
    render(
      <NavLink href="/test-link" mobileView={true}>
        Mobile Link
      </NavLink>
    );
    
    const link = screen.getByText('Mobile Link');
    expect(link).toHaveClass('p-3');
    expect(link).toHaveClass('text-center');
  });
}); 