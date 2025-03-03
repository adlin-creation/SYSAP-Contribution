// DoctorDetails.test.js

import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import DoctorDetails from "./DoctorDetails";
import useToken from "../../Authentication/useToken";
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

jest.mock("../../Authentication/useToken", () => ({
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

const ErrorBoundary = ({ children }) => {
  return children;
};

test("renders DoctorDetails form snapshot", () => {
  // Mock token
  useToken.mockReturnValue({ token: "fake-token" });

  // Simulate a doctor object
  const mockDoctor = {
    id: 123,
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    phoneNumber: "12345678",
    active: true,
  };

  const mockOnClose = jest.fn();
  const mockRefetchDoctors = jest.fn();
  const mockOpenModal = jest.fn();

  // Render via react-test-renderer
  const component = renderer.create(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <DoctorDetails
            doctor={mockDoctor}
            onClose={mockOnClose}
            refetchDoctors={mockRefetchDoctors}
            openModal={mockOpenModal}
          />
        </Suspense>
      </ErrorBoundary>
    </I18nextProvider>
  );

  // Snapshot
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
