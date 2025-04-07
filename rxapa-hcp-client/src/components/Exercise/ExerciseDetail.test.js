import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import ExerciseDetail from "./ExerciseDetail";
import useToken from "../Authentication/useToken";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

jest.mock("../Authentication/useToken", () => ({
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

test("renders ExerciseDetail form snapshot", () => {
  // Mock token
  useToken.mockReturnValue({ token: "fake-token" });

  const mockExercise = {
    key: "123",
    name: "Push-up",
    description: "A basic upper body exercise",
    category: "strength",
    fitnessLevel: "intermediate",
    videoUrl: "https://www.youtube.com/watch?v=8CE4ijWlQ18",
  };

  const mockRefetchExercises = jest.fn();

  // Render via react-test-renderer
  const component = renderer.create(
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <ExerciseDetail
            exercise={mockExercise}
            refetchExercises={mockRefetchExercises}
          />
        </Suspense>
      </ErrorBoundary>
    </I18nextProvider>
  );

  // Snapshot
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
