import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import EvaluationSearch from "./EvaluationSearch";
import Constants from "../Utils/Constants";

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
    render(<EvaluationSearch />);

    expect(screen.getByText("Recherche de patients")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Entrez un nom ou un ID")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Rechercher/i })
    ).toBeInTheDocument();
  });

  it("does not trigger search when input is empty", async () => {
    fetch.mockClear();

    render(<EvaluationSearch />);

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("searches by ID when input is numeric", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "123" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(fetch).toHaveBeenCalledWith(`${Constants.SERVER_URL}/patient/123`, {
      headers: { Authorization: "Bearer fake-token" },
    });

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients),
    });

    render(<EvaluationSearch />);

    const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Doe" } });
    });

    const searchButton = screen.getByRole("button", { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(fetch).toHaveBeenCalledWith(
      `${Constants.SERVER_URL}/patients/search?term=Doe`,
      { headers: { Authorization: "Bearer fake-token" } }
    );

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
    });
  });

  it("shows message when no patients found", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<EvaluationSearch />);

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
    fetch.mockRejectedValueOnce(new Error("Server error"));

    render(<EvaluationSearch />);

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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

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
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({ message: "Server error" }),
    });

    render(<EvaluationSearch />);

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

    fetch.mockReturnValueOnce(fetchPromise);

    render(<EvaluationSearch />);

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
  });

  it("handles single patient response correctly", async () => {
    const testPatient = {
      id: 123,
      lastname: "Doe",
      firstname: "John",
      birthday: "1980-01-01",
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients),
    });

    render(<EvaluationSearch />);

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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

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

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient),
    });

    render(<EvaluationSearch />);

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
});
