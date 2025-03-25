import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import EvaluationSearch from "./EvaluationSearch";
import Constants from "../Utils/Constants";
import { message } from 'antd';

jest.mock("../Authentication/useToken", () => ({
  __esModule: true,
  default: () => ({ token: "fake-token" }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        search_title: "Recherche de patients",
        search_placeholder: "Entrez un nom ou un ID",
        table_column_lastname: "Nom",
        table_column_firstname: "Prénom",
        table_column_birthday: "Date de naissance",
        error_no_patients: "Aucun patient trouvé.",
        error_search: "Erreur lors de la recherche. Veuillez réessayer.",
      };
      return translations[key] || key;
    },
  }),
}));

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("EvaluationSearch Component", () => {
  let originalMatchMedia;
  let originalResizeObserver;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
    originalResizeObserver = window.ResizeObserver;

    global.message = {
      warning: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    window.ResizeObserver = MockResizeObserver;

    delete window.location;
    window.location = { href: "" };
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    window.ResizeObserver = originalResizeObserver;
  });

  it("renders the search form correctly", async () => {
    await act(async () => {
      render(<EvaluationSearch />);
    });

    expect(screen.getByText("Recherche de patients")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Entrez un nom ou un ID")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Rechercher/i })
    ).toBeInTheDocument();
  });

  it("does not trigger search when input is empty", async () => {
    // Créez un spy sur message.warning
    const warningSpy = jest.spyOn(message, 'warning').mockImplementation(() => {});
    
    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(warningSpy).toHaveBeenCalledWith("Veuillez entrer un nom.");
    
    // Nettoyez le spy après le test
    warningSpy.mockRestore();
  });

  it("searches by ID when input is numeric", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${Constants.SERVER_URL}/patient/123`,
      {
        headers: { Authorization: "Bearer fake-token" },
      }
    );

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("searches by name when input is not numeric", async () => {
    const testPatients = [
      {
        id: 123,
        lastname: "Doe",
        firstname: "John",
        birthday: "1980-01-01",
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Doe" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${Constants.SERVER_URL}/patients/search?term=Doe`,
      { headers: { Authorization: "Bearer fake-token" } }
    );

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });
  });

  it("shows message when no patients found", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Aucun patient trouvé.")).toBeInTheDocument();
    });
  });

  it("shows error message when fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Server error"));

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Doe" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors de la recherche. Veuillez réessayer.")
      ).toBeInTheDocument();
    });
  });
  it("navigates to evaluation page when button is clicked", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    const paceButton = screen.getByText("Évaluation PACE");
    await act(async () => {
      fireEvent.click(paceButton);
    });

    expect(window.location.href).toBe("/evaluation-pace/123");
  });

  it("clears search results when clear button is clicked", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    const clearButton = screen.getByRole("button", {
      name: "close",
    });
    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(screen.queryByText("Doe")).not.toBeInTheDocument();
    expect(searchInput.value).toBe("");
  });

  it("handles non-ok API response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({ message: "Server error" }),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors de la recherche. Veuillez réessayer.")
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during search", async () => {
    let resolvePromise;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch.mockReturnValueOnce(fetchPromise);

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(searchButton.classList.contains("ant-btn-loading")).toBe(true);

    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    await waitFor(() => {
      expect(searchButton.classList.contains("ant-btn-loading")).toBe(false);
    });
  });

  it("handles single patient response correctly", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("displays multiple patients in search results", async () => {
    const testPatients = [
      {
        id: 123,
        lastname: "Doe",
        firstname: "John",
        birthday: "1980-01-01",
      },
      {
        id: 456,
        lastname: "Smith",
        firstname: "Jane",
        birthday: "1985-05-05",
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Do" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Smith")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
    });
  });

  it("navigates to PATH evaluation page when PATH button is clicked", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    const pathButton = screen.getByText("Évaluation PATH");
    await act(async () => {
      fireEvent.click(pathButton);
    });

    expect(window.location.href).toBe("/evaluation-path/123");
  });

  it("navigates to MATCH evaluation page when MATCH button is clicked", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    const matchButton = screen.getByText("Évaluation MATCH");
    await act(async () => {
      fireEvent.click(matchButton);
    });

    expect(window.location.href).toBe("/evaluation-match/123");
  });

  it("navigates to patient evaluations page when view evaluations button is clicked", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });

    const viewEvaluationsButton = screen.getByText("Afficher évaluations");
    await act(async () => {
      fireEvent.click(viewEvaluationsButton);
    });

    expect(window.location.href).toBe("/evaluations/patient/123");
  });

  it("handles search via Enter key press", async () => {
    global.fetch.mockClear();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 123, lastname: "Doe", firstname: "John" }),
    });
  
    await act(async () => {
      render(<EvaluationSearch />);
    });
  
    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });
  
    // Simuler la pression de la touche Entrée de manière correcte
    await act(async () => {
      // Utiliser keyDown au lieu de keyPress car c'est ce que React utilise pour détecter l'événement Entrée
      fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter", charCode: 13 });
    });
  
    // Attendre que le fetch soit appelé
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${Constants.SERVER_URL}/patient/123`,
        { headers: { Authorization: "Bearer fake-token" } }
      );
    });
  });

  it("handles null response from API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null),
    });

    await act(async () => {
      render(<EvaluationSearch />);
    });

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Aucun patient trouvé.")).toBeInTheDocument();
    });
  });
});
