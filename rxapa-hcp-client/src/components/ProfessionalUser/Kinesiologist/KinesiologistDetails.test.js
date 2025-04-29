<<<<<<< HEAD
// KinesiologistDetails.test.js
import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import KinesiologistDetails from "./KinesiologistDetails";
import useToken from "../../Authentication/useToken";
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

jest.mock("../../Authentication/useToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // Mock matchMedia if AntD relies on it
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

test("renders KinesiologistDetails form", () => {
  // Mock token
  useToken.mockReturnValue({ token: "fake-token" });

  // Mock props
  const mockKinesiologist = {
    id: 1,
    firstname: "Jane",
    lastname: "Doe",
    email: "jane@example.com",
    phoneNumber: "12345678",
    active: true,
  };
  const mockOnClose = jest.fn();
  const mockRefetch = jest.fn();
  const mockOpenModal = jest.fn();

  // Render with react-test-renderer
  const component = renderer.create(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <KinesiologistDetails
            kinesiologist={mockKinesiologist}
            onClose={mockOnClose}
            refetchKinesiologists={mockRefetch}
            openModal={mockOpenModal}
          />
        </Suspense>
      </ErrorBoundary>
    </I18nextProvider>
  );

  // Convert to JSON
  const tree = component.toJSON();

  // Basic snapshot assertion
  expect(tree).toMatchSnapshot();
});
=======
// KinesiologistDetails.test.js
import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import KinesiologistDetails from "./KinesiologistDetails";
import useToken from "../../Authentication/useToken";
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';

jest.mock("../../Authentication/useToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // Mock matchMedia if AntD relies on it
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

test("renders KinesiologistDetails form", () => {
  // Mock token
  useToken.mockReturnValue({ token: "fake-token" });

  // Mock props
  const mockKinesiologist = {
    id: 1,
    firstname: "Jane",
    lastname: "Doe",
    email: "jane@example.com",
    phoneNumber: "12345678",
    active: true,
  };
  const mockOnClose = jest.fn();
  const mockRefetch = jest.fn();
  const mockOpenModal = jest.fn();

  // Render with react-test-renderer
  const component = renderer.create(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <KinesiologistDetails
            kinesiologist={mockKinesiologist}
            onClose={mockOnClose}
            refetchKinesiologists={mockRefetch}
            openModal={mockOpenModal}
          />
        </Suspense>
      </ErrorBoundary>
    </I18nextProvider>
  );

  // Convert to JSON
  const tree = component.toJSON();

  // Basic snapshot assertion
  expect(tree).toMatchSnapshot();
});
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
