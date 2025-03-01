// DoctorDetails.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import DoctorDetails from './DoctorDetails';
import useToken from '../../Authentication/useToken';

jest.mock('../../Authentication/useToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // Mock matchMedia (Ant Design might use for responsive layout)
  global.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

afterAll(() => {
  global.matchMedia.mockRestore();
});

test('renders DoctorDetails form snapshot', () => {
  // Mock token
  useToken.mockReturnValue({ token: 'fake-token' });

  // Simulate a doctor object
  const mockDoctor = {
    id: 123,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phoneNumber: '12345678',
    active: true,
  };

  const mockOnClose = jest.fn();
  const mockRefetchDoctors = jest.fn();
  const mockOpenModal = jest.fn();

  // Render via react-test-renderer
  const component = renderer.create(
    <DoctorDetails
      doctor={mockDoctor}
      onClose={mockOnClose}
      refetchDoctors={mockRefetchDoctors}
      openModal={mockOpenModal}
    />
  );

  // Snapshot
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
