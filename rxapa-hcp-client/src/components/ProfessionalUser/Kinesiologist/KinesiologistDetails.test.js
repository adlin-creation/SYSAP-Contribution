// KinesiologistDetails.test.js
import React from "react";
import renderer from "react-test-renderer";
import KinesiologistDetails from "./KinesiologistDetails";
import useToken from "../../Authentication/useToken";

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
    <KinesiologistDetails
      kinesiologist={mockKinesiologist}
      onClose={mockOnClose}
      refetchKinesiologists={mockRefetch}
      openModal={mockOpenModal}
    />
  );

  // Convert to JSON
  const tree = component.toJSON();

  // Basic snapshot assertion
  expect(tree).toMatchSnapshot();
});
