import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ExerciseDetail from "./ExerciseDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react-dom/test-utils";

jest.mock("axios");

const mockExercise = {
  key: "123",
  name: "Squat",
  description: "Un exercice pour les jambes",
  category: "Force",
  fitnessLevel: "Intermédiaire",
};

const queryClient = new QueryClient();

describe("ExerciseDetail Component", () => {
  it("should render exercise details", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseDetail exercise={mockExercise} refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByDisplayValue("Squat")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Un exercice pour les jambes")).toBeInTheDocument();
  });

  it("should enable edit mode", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseDetail exercise={mockExercise} refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Modifier/i }));

    const nameInput = screen.getByDisplayValue("Squat");
    fireEvent.change(nameInput, { target: { value: "Squat Profond" } });

    expect(nameInput.value).toBe("Squat Profond");
  });

  it("should submit the form and update exercise", async () => {
    axios.put.mockResolvedValue({ data: { message: "Exercice mis à jour avec succès" } });

    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseDetail exercise={mockExercise} refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Modifier/i }));

    const nameInput = screen.getByDisplayValue("Squat");
    fireEvent.change(nameInput, { target: { value: "Squat Avancé" } });

    fireEvent.click(screen.getByRole("button", { name: /Enregistrer/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledWith(expect.stringContaining("/update-exercise/123"), expect.any(Object), expect.any(Object));
    });

    expect(screen.getByText("Exercice mis à jour avec succès")).toBeInTheDocument();
  });
});