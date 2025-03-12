import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CreateExercise from "./CreateExercise";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react-dom/test-utils";

jest.mock("axios");

const queryClient = new QueryClient();

describe("CreateExercise Component", () => {
  it("should render the form correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateExercise refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText("Nom de l'exercice")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description de l'exercice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Soumettre/i })).toBeInTheDocument();
  });

  it("should update input values", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateExercise refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    const nameInput = screen.getByPlaceholderText("Nom de l'exercice");
    const descriptionInput = screen.getByPlaceholderText("Description de l'exercice");

    fireEvent.change(nameInput, { target: { value: "Push-up" } });
    fireEvent.change(descriptionInput, { target: { value: "Un bon exercice" } });

    expect(nameInput.value).toBe("Push-up");
    expect(descriptionInput.value).toBe("Un bon exercice");
  });

  it("should submit the form and call API", async () => {
    axios.post.mockResolvedValue({ data: { message: "Exercice créé avec succès" } });

    render(
      <QueryClientProvider client={queryClient}>
        <CreateExercise refetchExercises={jest.fn()} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nom de l'exercice"), {
      target: { value: "Push-up" },
    });

    fireEvent.change(screen.getByPlaceholderText("Description de l'exercice"), {
      target: { value: "Exercice de force" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Soumettre/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/create-exercise"), expect.any(FormData), expect.any(Object));
    });

    expect(screen.getByText("Exercice créé avec succès")).toBeInTheDocument();
  });
});