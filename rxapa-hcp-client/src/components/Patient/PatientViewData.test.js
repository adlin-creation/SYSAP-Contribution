// PatientData.test.js
import { act } from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import PatientViewPage from "./PatientViewPage";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Mock de axios et useQuery
jest.mock("axios");
jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

// Mock des données de session
const mockSessions = [
    {
        id: 1,
        date: "2024-03-01",
        difficultyLevel: 3,
        painLevel: 5,
        accomplishedExercice: 4,
    },
    {
        id: 2,
        date: "2024-03-05",
        difficultyLevel: 4,
        painLevel: 4,
        accomplishedExercice: 5,
    },
];

// Mock des données du patient
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
      t: (key) => key, // Retourne simplement la clé de traduction au lieu d'une vraie traduction
    }),
  }));
  
describe("PatientViewPage Component", () => {
    beforeEach(() => {
        // Mock de useQuery pour retourner les sessions
        useQuery.mockImplementation(() => ({
            data: mockSessions,
            isLoading: false,
            isError: false,
        }));
    });

    it("renders the component without crashing", () => {
        render(<PatientViewPage patient={mockPatient} onClose={() => { }} />);
        expect(screen.getByText("Patients:patient_data_title")).toBeInTheDocument();

    });

    it("displays patient information correctly", () => {
        render(<PatientViewPage patient={mockPatient} onClose={() => { }} />);
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("514-456-7890")).toBeInTheDocument();
        expect(screen.getByText("active")).toBeInTheDocument();
        //expect(screen.getByText("Programmes: 2")).toBeInTheDocument();
    });

    it("displays session data correctly", () => {
        render(<PatientViewPage patient={mockPatient} onClose={() => { }} />);

        const sessionElement = screen.getByText("Session:").closest("p");
        expect(within(sessionElement).getByText("2")).toBeInTheDocument();
        expect(screen.getByText("2024-03-05")).toBeInTheDocument();

        const sessionInfo = screen.getByText("Session:").closest(".session-info");

        expect(
            within(sessionInfo).getByText((content, element) => {
                return (
                    element.textContent.includes("Difficulty Level:") &&
                    element.textContent.includes("3")
                );
            })
        ).toBeInTheDocument();
        expect(
            within(sessionInfo).getByText((content, element) => {
                return (
                    element.textContent.includes("Pain Level:") &&
                    element.textContent.includes("5")
                );
            })
        ).toBeInTheDocument();

        expect(
            within(sessionInfo).getByText((content, element) => {
                return (
                    element.textContent.includes("Accomplished Exercice:") &&
                    element.textContent.includes("4")
                );
            })
        ).toBeInTheDocument();
    });

    it("navigates between sessions using Previous and Next buttons", () => {
        render(<PatientViewPage patient={mockPatient} onClose={() => { }} />);

        // Vérifiez que la dernière session est affichée par défaut
        let sessionElement = screen.getByText("Session:").closest("p");
        expect(within(sessionElement).getByText("2")).toBeInTheDocument();
        // Cliquez sur "Previous"
        fireEvent.click(screen.getByText("Patients:previous_button"));


        sessionElement = screen.getByText("Session:").closest("p");
        expect(within(sessionElement).getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2024-03-01")).toBeInTheDocument();

        const sessionInfo = screen.getByText("Session:").closest(".session-info");
        const difficultyLevelElement = within(sessionInfo)
            .getByText("Difficulty Level:")
            .closest("p");
        expect(difficultyLevelElement).toHaveTextContent("3");

        // Use a more specific query for "Pain Level: 5"
        const painLevelElement = within(sessionInfo)
            .getByText("Pain Level:")
            .closest("p");
        expect(painLevelElement).toHaveTextContent("5");

        // Use a more specific query for "Accomplished Exercice: 4"
        const accomplishedExerciseElement = within(sessionInfo)
            .getByText("Accomplished Exercice:")
            .closest("p");
        expect(accomplishedExerciseElement).toHaveTextContent("4");

        // Cliquez sur "Next"
        fireEvent.click(screen.getByText("Patients:next_button"));
        sessionElement = screen.getByText("Session:").closest("p");
        expect(within(sessionElement).getByText("2")).toBeInTheDocument();
    });

    it("displays averages correctly", () => {
        render(<PatientViewPage patient={mockPatient} onClose={() => { }} />);

        expect(screen.getByText("3.5")).toBeInTheDocument(); // voir la moyenne est présente
        const painLevels = screen.getAllByText("4.5"); // voir si moyennes douleur/difficulté sont présentes
        expect(painLevels.length).toBe(2);

        //À faire; voir si moyennes sont à la bonne place
    });



});


