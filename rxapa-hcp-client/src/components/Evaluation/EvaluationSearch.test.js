import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import EvaluationSearch from "./EvaluationSearch";
import Constants from "../Utils/Constants";
import { message } from "antd";

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
  describe("Rendu du composant", () => {
    it("affiche correctement le formulaire de recherche", async () => {
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

    it("n'effectue pas de recherche quand le champ est vide", async () => {
      const warningSpy = jest
        .spyOn(message, "warning")
        .mockImplementation(() => {});

      await act(async () => {
        render(<EvaluationSearch />);
      });

      const searchButton = screen.getByRole("button", { name: /Rechercher/i });
      await act(async () => {
        fireEvent.click(searchButton);
      });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(warningSpy).toHaveBeenCalledWith("Veuillez entrer un nom.");

      warningSpy.mockRestore();
    });
  });
  describe("Fonctionnalité de recherche", () => {
    it("effectue une recherche par ID quand l'entrée est numérique", async () => {
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

    it("effectue une recherche par nom quand l'entrée n'est pas numérique", async () => {
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

    it("gère correctement une liste vide de patients", async () => {
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

    it("gère correctement une réponse null", async () => {
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

    it("affiche correctement plusieurs patients dans les résultats", async () => {
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

    it("effectue une recherche via la touche Entrée", async () => {
      global.fetch.mockClear();
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ id: 123, lastname: "Doe", firstname: "John" }),
      });

      await act(async () => {
        render(<EvaluationSearch />);
      });

      const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: "123" } });
      });

      await act(async () => {
        fireEvent.keyDown(searchInput, {
          key: "Enter",
          code: "Enter",
          charCode: 13,
        });
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `${Constants.SERVER_URL}/patient/123`,
          { headers: { Authorization: "Bearer fake-token" } }
        );
      });
    });
  });
  describe("Gestion des erreurs et des états de chargement", () => {
    it("affiche un message d'erreur lorsque la requête échoue", async () => {
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

    it("gère correctement les réponses non-ok de l'API", async () => {
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

    it("affiche l'état de chargement pendant la recherche", async () => {
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
  });
  // Section 4: Tests des actions (boutons, navigation)
  describe("Actions et navigation", () => {
    it("navigue vers la page d'évaluation PACE quand le bouton est cliqué", async () => {
      // Préparer un patient de test
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

      // Effectuer une recherche
      const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: "123" } });
      });

      const searchButton = screen.getByRole("button", { name: /Rechercher/i });
      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Attendre l'affichage des résultats
      await waitFor(() => {
        expect(screen.getByText("Doe")).toBeInTheDocument();
      });

      // Cliquer sur le bouton d'évaluation PACE
      const paceButton = screen.getByText("Évaluation PACE");
      await act(async () => {
        fireEvent.click(paceButton);
      });

      // Vérifier la redirection
      expect(window.location.href).toBe("/evaluation-pace/123");
    });

    it("navigue vers la page d'évaluation PATH quand le bouton est cliqué", async () => {
      // Préparer un patient de test
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

      // Effectuer une recherche
      const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: "123" } });
      });

      const searchButton = screen.getByRole("button", { name: /Rechercher/i });
      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Attendre l'affichage des résultats
      await waitFor(() => {
        expect(screen.getByText("Doe")).toBeInTheDocument();
      });

      // Cliquer sur le bouton d'évaluation PATH
      const pathButton = screen.getByText("Évaluation PATH");
      await act(async () => {
        fireEvent.click(pathButton);
      });

      // Vérifier la redirection
      expect(window.location.href).toBe("/evaluation-path/123");
    });

    it("navigue vers la page d'évaluation MATCH quand le bouton est cliqué", async () => {
      // Préparer un patient de test
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

      // Effectuer une recherche
      const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: "123" } });
      });

      const searchButton = screen.getByRole("button", { name: /Rechercher/i });
      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Attendre l'affichage des résultats
      await waitFor(() => {
        expect(screen.getByText("Doe")).toBeInTheDocument();
      });

      // Cliquer sur le bouton d'évaluation MATCH
      const matchButton = screen.getByText("Évaluation MATCH");
      await act(async () => {
        fireEvent.click(matchButton);
      });

      // Vérifier la redirection
      expect(window.location.href).toBe("/evaluation-match/123");
    });

    it("efface les résultats de recherche quand le bouton d'effacement est cliqué", async () => {
      // Préparer un patient de test
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

      // Effectuer une recherche
      const searchInput = screen.getByPlaceholderText("Entrez un nom ou un ID");
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: "123" } });
      });

      const searchButton = screen.getByRole("button", { name: /Rechercher/i });
      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Attendre l'affichage des résultats
      await waitFor(() => {
        expect(screen.getByText("Doe")).toBeInTheDocument();
      });

      // Cliquer sur le bouton d'effacement
      const clearButton = screen.getByRole("button", {
        name: "close",
      });
      await act(async () => {
        fireEvent.click(clearButton);
      });

      // Vérifier que les résultats sont effacés et le champ est vide
      expect(screen.queryByText("Doe")).not.toBeInTheDocument();
      expect(searchInput.value).toBe("");
    });
  });
});