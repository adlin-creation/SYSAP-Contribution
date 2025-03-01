import React from 'react';
import renderer from 'react-test-renderer';
import CreateKinesiologist from './CreateKinesiologist';
import useToken from '../../Authentication/useToken';

// 1) Mock the useToken hook
jest.mock('../../Authentication/useToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// 2) Mock matchMedia for Ant Design layout usage
beforeAll(() => {
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

afterAll(() => {
  global.matchMedia.mockRestore();
});

test('renders CreateKinesiologist form', () => {
  // 3) Provide a fake token via our mocked hook
  useToken.mockReturnValue({ token: 'fake-token' });

  // 4) Provide a mock refetch function
  const mockRefetchKinesiologists = jest.fn().mockReturnValue([]);

  // 5) Render the component with react-test-renderer
  const component = renderer.create(
    <CreateKinesiologist refetchKinesiologists={mockRefetchKinesiologists} />
  );
  const tree = component.toJSON();

  // 6) Recursive helper to check for a placeholder in any <input>
  function hasInputWithPlaceholder(node, placeholder) {
    if (!node || !node.children) return false;

    return node.children.some((child) => {
      // If it's an <input> with the desired placeholder, return true
      if (child.type === 'input' && child.props?.placeholder === placeholder) {
        return true;
      }
      // Otherwise, check recursively
      return hasInputWithPlaceholder(child, placeholder);
    });
  }

  // 7) Check for one of the known placeholders, e.g., "Entrez le prénom"
  expect(hasInputWithPlaceholder(tree, 'Entrez le prénom')).toBe(true);

  
});
