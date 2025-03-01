import React from 'react';
import renderer from 'react-test-renderer';
import CreateAdmin from './CreateAdmin';
import useToken from '../../Authentication/useToken'; 

// Mock the useToken hook
jest.mock('../../Authentication/useToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Match the style of your CreateDoctor test
beforeAll(() => {
  // Mock matchMedia used by Ant Design
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

afterAll(() => {
  global.matchMedia.mockRestore();
});

test('renders CreateAdmin form', () => {
  // Ensure useToken returns a "fake-token"
  useToken.mockReturnValue({ token: 'fake-token' });

  // Provide a mock refetch function
  const mockRefetchAdmins = jest.fn().mockReturnValue([]);

  // Render the component with react-test-renderer
  const component = renderer.create(<CreateAdmin refetchAdmins={mockRefetchAdmins} />);
  const tree = component.toJSON();

  // Recursive helper to check if an input placeholder exists
  const hasInputWithPlaceholder = (node, placeholder) => {
    if (!node || !node.children) return false;

    return node.children.some((child) => {
      // If this child is an <input> with the target placeholder, return true
      if (child.type === 'input' && child.props?.placeholder === placeholder) {
        return true;
      }
      // Otherwise, keep searching down the tree
      return hasInputWithPlaceholder(child, placeholder);
    });
  };

  // Pick one of the placeholders from CreateAdmin, e.g. "Entrez l'adresse email"
  expect(hasInputWithPlaceholder(tree, "Entrez l'adresse email")).toBe(true);
});
