// PatientStats.test.js
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import PatientStats from "./PatientStats";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";

jest.mock("axios");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

// Mock Recharts components to avoid ResizeObserver errors
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

// Vrai ResizeObserver pour éviter les erreurs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockSessions = [
  {
    id: 1,
    date: "2024-03-01",
    difficultyLevel: 3,
    painLevel: 5,
    walkingTime: 15,
    accomplishedExercice: 4,
  },
  {
    id: 2,
    date: "2024-03-05",
    difficultyLevel: 4,
    painLevel: 4,
    walkingTime: 20,
    accomplishedExercice: 5,
  },
];

const mockPrograms = [
  {
    id: 1,
    name: "Program 1",
    description: "Description 1",
    duration: 4,
    duration_unit: "weeks",
    actif: true,
  },
  {
    id: 2,
    name: "Program 2",
    description: "Description 2",
    duration: 4,
    duration_unit: "weeks",
    actif: true,
  },
];

const mockProgramEnrollments = [
  {
    id: 1,
    PatientId: 1,
    ProgramId: 1,
  },
];

const mockBlocs = [
  {
    id: 1,
    name: "Bloc 1",
    description: "Description bloc 1",
    key: "key-1",
    createdAt: "2025-03-27T22:21:57.967Z",
    updatedAt: "2025-03-27T22:21:57.967Z",
  },
];

const mockExercises = [
  {
    id: 1,
    name: "Exercise 1",
    description: "Description exercise 1",
    key: "key-ex-1",
    BlocId: 1,
    createdAt: "2025-03-27T22:37:45.628Z",
    updatedAt: "2025-03-27T22:37:45.628Z",
  },
];

const mockPatient = {
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  phoneNumber: "514-456-7890",
  status: "active",
  numberOfPrograms: 2,
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const originalDateTimeFormat = Intl.DateTimeFormat;
beforeEach(() => {
  Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
    format: () => "1 mars 2024",
  }));
});

afterEach(() => {
  Intl.DateTimeFormat = originalDateTimeFormat;
  jest.clearAllMocks();
});

describe("PatientStats Component", () => {
  beforeEach(() => {
    // Mock pour imiter le comportement de useQuery avec différentes clés
    useQuery.mockImplementation((queryKey) => {
      // Retourne différentes données selon la clé de la requête
      if (queryKey[0] === "SessionRecord") {
        return { data: mockSessions, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllPrograms") {
        return { data: mockPrograms, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllProgramEnrollments") {
        return {
          data: mockProgramEnrollments,
          isLoading: false,
          isError: false,
        };
      } else if (queryKey[0] === "AllBlocs") {
        return { data: mockBlocs, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllExercises") {
        return { data: mockExercises, isLoading: false, isError: false };
      }
      return { data: null, isLoading: false, isError: false };
    });
  });

  it("renders the component without crashing", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);
    expect(screen.getByText("title_patient_data")).toBeInTheDocument();
  });

  it("displays patient information correctly", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/514-456-7890/)).toBeInTheDocument();
    expect(screen.getByText(/active/)).toBeInTheDocument();
    expect(screen.getByText(/title_programs/)).toBeInTheDocument();
  });

  it("displays session data correctly", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    // Look for specific session data elements without relying on "Session:" text
    expect(screen.getByText(/text_difficulty_level/i)).toBeInTheDocument();
    expect(screen.getByText(/text_pain_level/i)).toBeInTheDocument();
    expect(screen.getByText(/text_walking_time/i)).toBeInTheDocument();
    expect(screen.getByText(/text_accomplished_exercise/i)).toBeInTheDocument();
  });

  it("navigates between sessions using Previous and Next buttons", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    // Find session section first
    const sessionSection = screen
      .getByText("title_session_data")
      .closest(".section-header").nextElementSibling;
    const sessionButtons = within(sessionSection).getAllByRole("button");

    // Get prev/next buttons
    const prevButton = sessionButtons.find((btn) =>
      /previous/i.test(btn.textContent)
    );
    const nextButton = sessionButtons.find((btn) =>
      /next/i.test(btn.textContent)
    );

    // Initial state - second session should be shown, so next is disabled, prev is enabled
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();

    // Click previous to go to first session
    fireEvent.click(prevButton);

    // Get the updated buttons
    const updatedSessionSection = screen
      .getByText("title_session_data")
      .closest(".section-header").nextElementSibling;
    const updatedButtons = within(updatedSessionSection).getAllByRole("button");

    const updatedPrevButton = updatedButtons.find((btn) =>
      /previous/i.test(btn.textContent)
    );
    const updatedNextButton = updatedButtons.find((btn) =>
      /next/i.test(btn.textContent)
    );

    // Now prev should be disabled and next should be enabled
    expect(updatedPrevButton).toBeDisabled();
    expect(updatedNextButton).not.toBeDisabled();
  });

  it("displays averages section when sessions exist", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    expect(screen.getByText("average_since_inception")).toBeInTheDocument();

    expect(screen.getByText(/text_average_difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/text_average_pain/i)).toBeInTheDocument();
    expect(screen.getByText(/text_average_walking/i)).toBeInTheDocument();
    expect(screen.getByText(/text_average_exercises/i)).toBeInTheDocument();
  });

  it("shows empty state when no sessions exist", () => {
    useQuery.mockImplementation((queryKey) => {
      if (queryKey[0] === "SessionRecord") {
        return { data: [], isLoading: false, isError: false };
      }
      // Conserver les mock data pour les autres requêtes
      if (queryKey[0] === "AllPrograms") {
        return { data: mockPrograms, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllProgramEnrollments") {
        return {
          data: mockProgramEnrollments,
          isLoading: false,
          isError: false,
        };
      } else if (queryKey[0] === "AllBlocs") {
        return { data: mockBlocs, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllExercises") {
        return { data: mockExercises, isLoading: false, isError: false };
      }
      return { data: null, isLoading: false, isError: false };
    });

    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    const emptyMessages = screen.getAllByText(
      "span_no_sessions_available_for_patient"
    );
    expect(emptyMessages.length).toBe(2);

    const exportButton = screen.getByRole("button", {
      name: /button_export_to_csv/i,
    });
    expect(exportButton).toBeDisabled();
  });

  it("can export data to CSV when sessions exist", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    const exportButton = screen.getByRole("button", {
      name: /button_export_to_csv/i,
    });
    expect(exportButton).not.toBeDisabled();

    fireEvent.click(exportButton);

    expect(saveAs).toHaveBeenCalledTimes(1);
    // Vérifie simplement que saveAs a été appelé avec un Blob et un nom de fichier qui contient "John_Doe"
    expect(saveAs.mock.calls[0][1]).toContain("John_Doe");
  });

  it("cannot export data when no sessions exist", () => {
    useQuery.mockImplementation((queryKey) => {
      if (queryKey[0] === "SessionRecord") {
        return { data: [], isLoading: false, isError: false };
      }
      if (queryKey[0] === "AllPrograms") {
        return { data: mockPrograms, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllProgramEnrollments") {
        return {
          data: mockProgramEnrollments,
          isLoading: false,
          isError: false,
        };
      } else if (queryKey[0] === "AllBlocs") {
        return { data: mockBlocs, isLoading: false, isError: false };
      } else if (queryKey[0] === "AllExercises") {
        return { data: mockExercises, isLoading: false, isError: false };
      }
      return { data: null, isLoading: false, isError: false };
    });

    render(<PatientStats patient={mockPatient} onClose={() => {}} />);
    const exportButton = screen.getByRole("button", {
      name: /button_export_to_csv/i,
    });
    expect(exportButton).toBeDisabled();
  });

  it("displays slider for session navigation", () => {
    render(<PatientStats patient={mockPatient} onClose={() => {}} />);

    // Look for the session section in the DOM
    const sessionSection = screen
      .getByText("title_session_data")
      .closest(".section-header").nextElementSibling;

    // Find slider within that section - use the new class names
    const slider = sessionSection.querySelector(".ant-slider");
    expect(slider).not.toBeNull();
    expect(slider).toBeInTheDocument();

    // Check for First/Latest labels - update to use the new class names
    const firstLabel = sessionSection.querySelector(
      ".slider-endpoint, .slider-labels"
    );
    expect(firstLabel).not.toBeNull();

    // Check if at least one of the endpoints contains "First" and one contains "Latest"
    const endpointTexts = Array.from(
      sessionSection.querySelectorAll(".slider-endpoint, .slider-labels span")
    ).map((el) => el.textContent);

    expect(endpointTexts.some((text) => text.includes("span_first"))).toBe(
      true
    );
    expect(endpointTexts.some((text) => text.includes("span_latest"))).toBe(
      true
    );
  });
});
