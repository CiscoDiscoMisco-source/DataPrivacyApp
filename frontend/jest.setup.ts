// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Add a global JSX namespace reference for TypeScript in tests
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(name: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveTextContent(text: string): R;
    }
  }
} 