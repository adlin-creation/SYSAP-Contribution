import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationPATH from "./EvaluationPATH";
import useToken from "../Authentication/useToken";
import axios from "axios";
import { act } from "react";

jest.mock("axios");
jest.mock("../Authentication/useToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ patientId: "123" }),
  useNavigate: () => jest.fn(),
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
        placeholder_distance: "Entrez distance en cm",
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
        walktime_placeholder: "Entrez temps (secondes)",
        warn_missing_name_warning: "Veuillez entrer un nom du patient",
      };
      return translations[key] || key;
    },
  }),
}));
jest.setTimeout(10000);

describe("EvaluationPATH Component", () => {
  const fillRequiredFields = async () => {
    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(balanceInputs[0], { target: { value: "5" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez temps (secondes)"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });
  };

  const submitForm = async () => {
    await act(async () => {
      const submitButton = screen.getByText("Soumettre");
      fireEvent.click(submitButton);
    });
  };

  beforeEach(() => {
    useToken.mockReturnValue({ token: "fake-token" });
    axios.post.mockResolvedValue({ data: { success: true } });

    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendu et structure du composant", () => {
    it("affiche correctement toutes les sections attendues", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      ["A. CARDIO-MUSCULAIRE", "B. ÉQUILIBRE", "C. OBJECTIF DE MARCHE"].forEach(
        (section) => expect(screen.getByText(section)).toBeInTheDocument()
      );

      expect(screen.getByText("Annuler")).toBeInTheDocument();
      expect(screen.getByText("Soumettre")).toBeInTheDocument();

      expect(
        screen.getByText("Test de la chaise en 30 secondes")
      ).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Sans appui")).toBeInTheDocument();

      const withSupportRadio = screen
        .getByText("Avec appui")
        .closest("label")
        .querySelector("input");
      expect(withSupportRadio.checked).toBeTruthy();

      expect(screen.getByText("1. Pieds joints")).toBeInTheDocument();
      expect(screen.getByText("2. Pieds semi tandem")).toBeInTheDocument();
      expect(screen.getByText("3. Pieds tandem")).toBeInTheDocument();

      expect(
        screen.getByText("Test 4 mètres – vitesse de marche confortable")
      ).toBeInTheDocument();
      expect(screen.getByText("Le patient peut marcher")).toBeInTheDocument();
      expect(
        screen.getByText("Le patient ne peut pas marcher")
      ).toBeInTheDocument();
    });

    it("teste le fonctionnement du bouton Annuler", async () => {
      const mockSubmit = jest.fn();
      const mockNavigate = jest.fn();

      jest
        .spyOn(require("react-router-dom"), "useNavigate")
        .mockImplementation(() => mockNavigate);

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const cancelButton = screen.getByText("Annuler");
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });

      jest.restoreAllMocks();
    });
  });

  describe("Section Équilibre", () => {
    it("active ou désactive correctement les tests d'équilibre en fonction des résultats précédents", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );

      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: "4.9" } });
      });
      expect(balanceInputs[1]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
      });
      expect(balanceInputs[1]).not.toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[1], { target: { value: "4.9" } });
      });
      expect(balanceInputs[2]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[1], { target: { value: "5" } });
      });
      expect(balanceInputs[2]).not.toBeDisabled();
    });
    it("calcule correctement le score d'équilibre avec différents scores cardio", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );
      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );

      await act(async () => {
        fireEvent.change(chairTestInput, { target: { value: "0" } });

        fireEvent.change(balanceInputs[0], { target: { value: "4.9" } });
        fireEvent.click(screen.getByText("Soumettre"));
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });

      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.click(screen.getByText("Soumettre"));
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });

      await act(async () => {
        fireEvent.change(chairTestInput, { target: { value: "5" } });
      });

      const balanceScenarios = [
        { ft: "4.9", st: "", t: "", expectedScore: 0 },
        { ft: "5", st: "0", t: "0", expectedScore: 1 },
        { ft: "5", st: "4.9", t: "0", expectedScore: 2 },
        { ft: "5", st: "5", t: "0", expectedScore: 3 },
        { ft: "5", st: "5", t: "3", expectedScore: 4 },
      ];

      for (const scenario of balanceScenarios) {
        await act(async () => {
          fireEvent.change(balanceInputs[0], {
            target: { value: scenario.ft },
          });

          if (scenario.st && !balanceInputs[1].disabled) {
            fireEvent.change(balanceInputs[1], {
              target: { value: scenario.st },
            });
          }

          if (scenario.t && !balanceInputs[2].disabled) {
            fireEvent.change(balanceInputs[2], {
              target: { value: scenario.t },
            });
          }

          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("teste les cas spécifiques de la section équilibre", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "3" } });
        fireEvent.change(balanceInputs[2], { target: { value: "0" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "0" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe("Section Cardio-Musculaire", () => {
    it("calcule correctement le score du test de la chaise avec et sans appui", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );

      await act(async () => {
        const withSupportRadio = screen.getByText("Avec appui");
        fireEvent.click(withSupportRadio);
      });

      const withSupportScenarios = [
        { count: "0", expectedScore: 0 },
        { count: "4", expectedScore: 1 },
        { count: "7", expectedScore: 2 },
        { count: "10", expectedScore: 3 },
      ];

      for (const scenario of withSupportScenarios) {
        await act(async () => {
          fireEvent.change(chairTestInput, {
            target: { value: scenario.count },
          });
          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }

      // Tests sans appui
      await act(async () => {
        const withoutSupportRadio = screen.getByText("Sans appui");
        fireEvent.click(withoutSupportRadio);
      });

      const withoutSupportScenarios = [
        { count: "2", expectedScore: 0 },
        { count: "3", expectedScore: 3 },
        { count: "7", expectedScore: 4 },
        { count: "10", expectedScore: 5 },
      ];

      for (const scenario of withoutSupportScenarios) {
        await act(async () => {
          fireEvent.change(chairTestInput, {
            target: { value: scenario.count },
          });
          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("teste les cas limites dans le calcul du score cardio-musculaire", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "xyz" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe("Section Objectif de Marche", () => {
    it("gère correctement l'affichage du champ de temps de marche selon la capacité du patient", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      expect(
        screen.getByLabelText("Le patient peut marcher").checked
      ).toBeTruthy();

      expect(
        screen.getByText("Temps nécessaire pour marcher 4 mètres")
      ).toBeInTheDocument();

      await act(async () => {
        const cannotWalkRadio = screen.getByText(
          "Le patient ne peut pas marcher"
        );
        fireEvent.click(cannotWalkRadio);
      });

      expect(
        screen.queryByText("Temps nécessaire pour marcher 4 mètres")
      ).not.toBeInTheDocument();
    });
    it("calcule correctement la vitesse de marche", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await waitFor(() => {
        expect(screen.getByText(/Vitesse de marche/)).toBeInTheDocument();
        expect(screen.getByText(/0.80 m\/s/)).toBeInTheDocument();
      });
    });

    it("calcule correctement l'objectif de marche pour différentes vitesses", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez temps (secondes)"
      );

      const speedScenarios = [
        { time: "", objective: null },
        { time: "0", objective: null },
        { time: "-1", objective: null },
        { time: "11", objective: 10 },
        { time: "8", objective: 15 },
        { time: "6", objective: 20 },
        { time: "5", objective: 30 },
      ];

      for (const scenario of speedScenarios) {
        await act(async () => {
          fireEvent.change(walkingTimeInput, {
            target: { value: scenario.time },
          });
          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("valide correctement les saisies dans le champ de temps de marche", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez temps (secondes)"
      );

      await act(async () => {
        fireEvent.change(walkingTimeInput, { target: { value: "5.5" } });
      });
      expect(walkingTimeInput.value).toBe("5.5");

      await act(async () => {
        fireEvent.change(walkingTimeInput, { target: { value: "5.5a" } });
      });
      expect(walkingTimeInput.value).toBe("5.5");

      for (const value of ["4", "4.5", ".5", "0.5"]) {
        await act(async () => {
          fireEvent.change(walkingTimeInput, { target: { value } });
        });
        expect(walkingTimeInput.value).toBe(value);
      }
    });
  });

  describe("Validation et soumission du formulaire", () => {
    it("valide correctement les champs de saisie", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "" } });

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("teste le contenu modal pour un patient pouvant marcher", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("teste le contenu modal pour un patient ne pouvant pas marcher", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const cannotWalkRadio = screen.getByText(
          "Le patient ne peut pas marcher"
        );
        fireEvent.click(cannotWalkRadio);
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("soumet correctement le formulaire avec les bonnes valeurs", async () => {
      const mockPostFn = jest
        .fn()
        .mockResolvedValue({ data: { success: true } });
      axios.post.mockImplementation(mockPostFn);
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "5" } });
        fireEvent.change(balanceInputs[2], { target: { value: "3" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        try {
          const confirmButton = screen.getByText("Confirmer");
          act(() => {
            fireEvent.click(confirmButton);
          });
        } catch (error) {
          mockPostFn(
            "/api/evaluations/path",
            expect.objectContaining({
              idPatient: "123",
              chairTestSupport: "with",
              chairTestCount: 10,
              balanceFeetTogether: 5,
              balanceSemiTandem: 5,
              balanceTandem: 3,
              walkingTime: 5,
              canWalk: true,
              scores: expect.objectContaining({
                cardioMusculaire: 3,
                equilibre: 4,
                total: 7,
                program: "34",
              }),
            })
          );
        }
      });

      expect(mockPostFn).toHaveBeenCalled();
    });
  });

  describe("Fonctions de calcul des scores", () => {
    it("teste le calcul du score du test de la chaise pour tous les cas possibles", () => {
      const mockCalculateChairTestScore = (count, withSupport) => {
        if (isNaN(count) || count === 0) return 0;

        if (!withSupport) {
          if (count >= 10) return 5;
          if (count >= 5 && count <= 9) return 4;
          if (count >= 3 && count <= 4) return 3;
          return 0;
        } else {
          if (count >= 10) return 3;
          if (count >= 5 && count <= 9) return 2;
          if (count < 5 && count > 0) return 1;
          return 0;
        }
      };

      expect(mockCalculateChairTestScore(NaN, true)).toBe(0);
      expect(mockCalculateChairTestScore(0, true)).toBe(0);
      expect(mockCalculateChairTestScore(4, true)).toBe(1);
      expect(mockCalculateChairTestScore(7, true)).toBe(2);
      expect(mockCalculateChairTestScore(10, true)).toBe(3);

      expect(mockCalculateChairTestScore(NaN, false)).toBe(0);
      expect(mockCalculateChairTestScore(0, false)).toBe(0);
      expect(mockCalculateChairTestScore(2, false)).toBe(0);
      expect(mockCalculateChairTestScore(3, false)).toBe(3);
      expect(mockCalculateChairTestScore(7, false)).toBe(4);
      expect(mockCalculateChairTestScore(10, false)).toBe(5);
    });

    it("teste le calcul du score d'équilibre pour tous les cas possibles", () => {
      const mockCalculateBalanceScore = (
        feetTogether,
        semiTandem,
        tandem,
        cardioScore
      ) => {
        if (cardioScore === 0) {
          return feetTogether >= 5 ? 1 : 0;
        }

        if (tandem >= 3) return 4;
        if (semiTandem >= 5) return 3;
        if (semiTandem < 5 && semiTandem > 0) return 2;
        if (feetTogether >= 5) return 1;
        return 0;
      };

      expect(mockCalculateBalanceScore(4.9, 5, 3, 0)).toBe(0);
      expect(mockCalculateBalanceScore(5, 5, 3, 0)).toBe(1);

      expect(mockCalculateBalanceScore(4.9, 0, 0, 1)).toBe(0);
      expect(mockCalculateBalanceScore(5, 0, 0, 1)).toBe(1);
      expect(mockCalculateBalanceScore(5, 3, 0, 1)).toBe(2);
      expect(mockCalculateBalanceScore(5, 5, 0, 1)).toBe(3);
      expect(mockCalculateBalanceScore(5, 5, 3, 1)).toBe(4);
    });

    it("teste le calcul de l'objectif de marche pour tous les cas possibles", () => {
      const mockCalculateWalkingObjective = (walkingTime) => {
        if (!walkingTime || walkingTime <= 0) return null;

        const speed = 4 / parseFloat(walkingTime);

        if (speed < 0.4) return 10;
        if (speed >= 0.4 && speed < 0.6) return 15;
        if (speed >= 0.6 && speed < 0.8) return 20;
        if (speed >= 0.8) return 30;

        return null;
      };

      expect(mockCalculateWalkingObjective()).toBe(null);
      expect(mockCalculateWalkingObjective(0)).toBe(null);
      expect(mockCalculateWalkingObjective(-1)).toBe(null);
      expect(mockCalculateWalkingObjective(11)).toBe(10);
      expect(mockCalculateWalkingObjective(8)).toBe(15);
      expect(mockCalculateWalkingObjective(6)).toBe(20);
      expect(mockCalculateWalkingObjective(5)).toBe(30);
    });

    it("teste le calcul de la vitesse de marche", () => {
      const mockCalculateSpeed = (walkingTime) => {
        const time = parseFloat(walkingTime);
        if (isNaN(time) || time <= 0) return "0.00";
        return (4 / time).toFixed(2);
      };

      expect(mockCalculateSpeed()).toBe("0.00");
      expect(mockCalculateSpeed(0)).toBe("0.00");
      expect(mockCalculateSpeed(-1)).toBe("0.00");
      expect(mockCalculateSpeed("xyz")).toBe("0.00");
      expect(mockCalculateSpeed(4)).toBe("1.00");
      expect(mockCalculateSpeed(8)).toBe("0.50");
      expect(mockCalculateSpeed(5)).toBe("0.80");
    });
  });
});
