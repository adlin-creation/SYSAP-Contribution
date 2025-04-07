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
        button_cancel: "Annuler",
        button_close: "Fermer",
        button_confirm: "Confirmer",
        button_download_pdf: "Télécharger PDF",
        button_match: "Évaluation MATCH",
        button_pace: "Évaluation PACE",
        button_path: "Évaluation PATH",
        button_search: "Rechercher",
        button_submit: "Soumettre",
        color_blue: "BLEU",
        color_brown: "MARRON",
        color_green: "VERT",
        color_orange: "ORANGE",
        color_purple: "VIOLET",
        color_red: "ROUGE",
        color_yellow: "JAUNE",
        error_distance_required: "La distance est requise",
        error_invalid_distance: "veuillez entrer une distance valide",
        error_no_patients: "Aucun patient trouvé.",
        error_pdf_export: "Échec de l'exportation du PDF",
        error_save_assessment: "Failed to save assessment data",
        error_search: "Erreur lors de la recherche. Veuillez réessayer.",
        error_stand_invalid: "Veuillez entrer un nombre valide",
        error_stand_required: "Le nombre de levers est requis",
        error_time_invalid: "Veuillez entrer un temps valide",
        error_time_required: "Le temps est requis",
        error_title: "Error",
        error_walk_time_invalid: "Veuillez entrer un temps de marche valide",
        error_walk_time_required: "Le temps de marche est requis",
        info_match_evaluation_1:
          " Si le patient ne peut pas accomplir 5 levers avec support, seulement faire le test d'équilibre pieds joints.",
        info_match_evaluation_2:
          " Si le patient n'arrive pas à garder un équilibre dans une partie, entrer 0.",
        info_path_evaluation_1:
          "Si le patient ne peut pas se lever avec support, seulement faire le test d'équilibre pieds joints",
        info_path_evaluation_2:
          "Si le patient n'arrive pas a garder un éuilibre dans une partie, entrez 0",
        info_start_with_support:
          "Commencer avec support. Si le patient réussi a faire 5 levers ou plus, refaire le test sans support",
        label_chair_test: "Test de la chaise en 30 secondes",
        label_distance: "Distance (cm)",
        label_feet_semi_tandem: "2. Pieds semi tandem",
        label_feet_tandem: "3. Pieds tandem",
        label_feet_together: "1. Pieds joints",
        label_feet_unipodal: "4. Pieds unipodal",
        label_functional_reach_test: "Functional Reach Test (FRT)",
        label_match_walk_objective:
          "Test 4 mètres – vitesse de marche confortable",
        label_stand_count: "Nombre de levers",
        label_time_needed_walk_4m: "Temps nécessaire pour marcher 4 mètres",
        label_walk_test:
          "Test 4 mètres - Temps nécessaire pour marcher 4-mètres",
        label_walk_time: "Temps de marche pour 4 mètres",
        minutes: "minutes",
        one_foot: "Unipodal",
        placeholder_distance: "Entrez la distance en cm",
        placeholder_stand_count: "Entrez le nombre de levers",
        placeholder_time: "Entrez le temps en secondes",
        radio_arms_not_working: "Ne lève pas les bras",
        radio_patient_can_walk: "Le patient peut marcher",
        radio_patient_cannot_walk: "Le patient ne peut pas marcher",
        radio_sitting: "Assis",
        radio_standing: "Debout",
        radio_with_support: "Avec appui",
        radio_without_support: "Sans appui",
        placeholder_search: "Rechercher un patient par nom",
        search_title: "Recherche de patient pour évaluation",
        semi_tandem: "Semi-tandem",
        speed_calculation: "Vitesse de marche",
        success_message: "Assessment saved successfully",
        success_title: "Success",
        tandem: "Tandem",
        text_balance_instructions:
          "Réalisez les équilibres dans l'ordre. Le score sera attribué selon l'équilibre le plus grand obtenu",
        text_balance_score: "Équilibre",
        text_cardio_score: "Cardio-musculaire",
        text_daily_walking_goal: "Objectif de marche journalier",
        text_individual_scores: "Scores individuels:",
        text_level: "Niveau",
        text_minutes_per_day: "minutes par jour",
        text_mobility_score: "Mobilité",
        text_recommended_match_program: "Programme MATCH recommandé",
        text_recommended_program: "Programme recommandé",
        text_speed_unit: "m/s",
        text_total_score: "Score Total",
        text_walk_speed: "Vitesse de marche",
        text_walking_capacity_to_improve:
          "Capacité de marche à travailler (Objectif à réévaluer au cours du séjour)",
        title_actions: "Actions",
        title_path_program: "Programme PATH",
        title_result: "Résultats",
        title_results_eval_match: "Évaluation MATCH",
        title_results_eval_pace: "Évaluation PACE",
        title_results_eval_path: "Évaluation PATH",
        title_sectionA: "A. CARDIO-MUSCULAIRE",
        title_sectionB: "B. ÉQUILIBRE",
        title_SectionB_match_evaluation: "B. ÉQUILIBRE (Debout, sans aide)",
        title_sectionC: "C. MOBILITÉ & STABILITÉ DU TRONC",
        title_SectionC_path_match_evaluation: "C. OBJECTIF DE MARCHE",
        title_sectionD: "D. OBJECTIF DE MARCHE",
        title_table_column_birthday: "Date de naissance",
        title_table_column_firstname: "Prénom",
        title_table_column_lastname: "Nom",
        title_walk_objective: "Objectif de marche",
        title_walking_ability_to_work: "Capacité de marche à développer",
        walking_time_label: "Temps de marche sur 4 mètres",
        walktime_placeholder: "Entrez le temps en secondes",
        warn_missing_name_warning: "Veuillez entrer un nom du patient",
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

      expect(
        screen.getByText("Recherche de patient pour évaluation")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Rechercher un patient par nom")
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
      expect(warningSpy).toHaveBeenCalledWith(
        "Veuillez entrer un nom du patient"
      );

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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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

      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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
      const searchInput = screen.getByPlaceholderText(
        "Rechercher un patient par nom"
      );
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
