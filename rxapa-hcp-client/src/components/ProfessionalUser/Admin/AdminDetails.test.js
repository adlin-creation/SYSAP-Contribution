// AdminDetails.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import AdminDetails from './AdminDetails';
import useToken from '../../Authentication/useToken';

jest.mock('../../Authentication/useToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // Mock matchMedia, used by Ant Design for responsive layouts
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

afterAll(() => {
  global.matchMedia.mockRestore();
});

test('renders AdminDetails form snapshot', () => {
  // Mock useToken to return a fake token
  useToken.mockReturnValue({ token: 'fake-token' });

  // Simulate an admin object passed as a prop
  const mockAdmin = {
    id: 42,
    firstname: 'Alice',
    lastname: 'Wonderland',
    email: 'alice@example.com',
    phoneNumber: '987654321',
    active: true,
  };

  // Mock the required callback props
  const mockOnClose = jest.fn();
  const mockRefetchAdmins = jest.fn();
  const mockOpenModal = jest.fn();

  // Render the component via react-test-renderer
  const component = renderer.create(
    <AdminDetails
      admin={mockAdmin}
      onClose={mockOnClose}
      refetchAdmins={mockRefetchAdmins}
      openModal={mockOpenModal}
    />
  );

  // Convert it to a JSON tree and compare to snapshot
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
