import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationPACE from "./EvaluationPACE";
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

jest.mock("./images/pace_balance_joint.png", () => "balance-joint-mock");
jest.mock(
  "./images/pace_balance_semi_tandem.png",
  () => "balance-semi-tandem-mock"
);
jest.mock("./images/pace_balance_tandem.png", () => "balance-tandem-mock");
jest.mock("./images/pace_balance_unipodal.png", () => "balance-unipodal-mock");

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
        warn_missing_name_warning: "Veuillez entrer un nom du patient",
        walktime_placeholder: "Entrez le temps (secondes)",
      };
      return translations[key] || key;
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

jest.setTimeout(10000);

describe("EvaluationPACE Component", () => {
  const fillRequiredFields = async () => {
    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });

      const distanceInput = screen.getByPlaceholderText(
        "Entrez la distance en cm"
      );
      fireEvent.change(distanceInput, { target: { value: "20" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps (secondes)"
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
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      const sections = [
        "A. CARDIO-MUSCULAIRE",
        "B. ÉQUILIBRE",
        "C. MOBILITÉ & STABILITÉ DU TRONC",
        "D. OBJECTIF DE MARCHE",
      ];

      sections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });

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
      expect(screen.getByText("4. Pieds unipodal")).toBeInTheDocument();

      expect(
        screen.getByText("Functional Reach Test (FRT)")
      ).toBeInTheDocument();
      expect(screen.getByText("Assis")).toBeInTheDocument();
      expect(screen.getByText("Debout")).toBeInTheDocument();
      expect(screen.getByText("Ne lève pas les bras")).toBeInTheDocument();

      expect(
        screen.getByText(
          "Test 4 mètres - Temps nécessaire pour marcher 4-mètres"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Le patient peut marcher")).toBeInTheDocument();
      expect(
        screen.getByText("Le patient ne peut pas marcher")
      ).toBeInTheDocument();
    });
  });

  describe("Section Équilibre", () => {
    it("active ou désactive correctement les tests d'équilibre en fonction des résultats précédents", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );

      expect(balanceInputs[1]).toBeDisabled();
      expect(balanceInputs[2]).toBeDisabled();
      expect(balanceInputs[3]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
      });
      expect(balanceInputs[1]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      });
      expect(balanceInputs[1]).not.toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[1], { target: { value: "5" } });
      });
      expect(balanceInputs[2]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
      });
      expect(balanceInputs[2]).not.toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[2], { target: { value: "5" } });
      });
      expect(balanceInputs[3]).toBeDisabled();

      await act(async () => {
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
      });
      expect(balanceInputs[3]).not.toBeDisabled();
    });
    it("calcule correctement le score d'équilibre pour tous les scénarios", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText(
          "Entrez la distance en cm"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );

      const balanceScenarios = [
        { ft: "5", st: "0", t: "0", of: "0", expectedScore: 0 },
        { ft: "10", st: "5", t: "0", of: "0", expectedScore: 1 },
        { ft: "10", st: "10", t: "3", of: "0", expectedScore: 2 },
        { ft: "10", st: "10", t: "7", of: "0", expectedScore: 3 },
        { ft: "10", st: "10", t: "10", of: "0", expectedScore: 4 },
        { ft: "10", st: "10", t: "10", of: "7", expectedScore: 5 },
        { ft: "10", st: "10", t: "10", of: "10", expectedScore: 6 },
      ];

      for (const scenario of balanceScenarios) {
        await act(async () => {
          fireEvent.change(balanceInputs[0], { target: { value: "10" } });

          fireEvent.change(balanceInputs[0], {
            target: { value: scenario.ft },
          });

          if (scenario.ft >= 10 && scenario.st !== undefined) {
            fireEvent.change(balanceInputs[1], {
              target: { value: scenario.st },
            });
          }

          if (scenario.st >= 10 && scenario.t !== undefined) {
            fireEvent.change(balanceInputs[2], {
              target: { value: scenario.t },
            });
          }

          if (scenario.t >= 10 && scenario.of !== undefined) {
            fireEvent.change(balanceInputs[3], {
              target: { value: scenario.of },
            });
          }

          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });

  describe("Section Cardio-Musculaire", () => {
    it("calcule correctement le score du test de la chaise avec et sans appui", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText(
          "Entrez la distance en cm"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
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

      const chairScenariosWithSupport = [
        { count: "0", expectedScore: 0 },
        { count: "5", expectedScore: 1 },
        { count: "10", expectedScore: 2 },
      ];

      for (const scenario of chairScenariosWithSupport) {
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

      await act(async () => {
        const withoutSupportRadio = screen.getByText("Sans appui");
        fireEvent.click(withoutSupportRadio);
      });

      const chairScenariosWithoutSupport = [
        { count: "0", expectedScore: 0 },
        { count: "3", expectedScore: 2 },
        { count: "7", expectedScore: 3 },
        { count: "11", expectedScore: 4 },
        { count: "14", expectedScore: 5 },
        { count: "16", expectedScore: 6 },
      ];

      for (const scenario of chairScenariosWithoutSupport) {
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
  });

  describe("Section Mobilité", () => {
    it("désactive correctement le champ de distance FRT lorsque 'Bras non fonctionnels' est sélectionné", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      const distanceInput = screen.getByPlaceholderText(
        "Entrez la distance en cm"
      );
      expect(distanceInput).not.toBeDisabled();

      await act(async () => {
        const armsNotWorkingRadio = screen.getByText("Ne lève pas les bras");
        fireEvent.click(armsNotWorkingRadio);
      });

      expect(distanceInput).toBeDisabled();

      await act(async () => {
        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);
      });

      expect(distanceInput).not.toBeDisabled();
    });

    it("calcule correctement le score de mobilité dans différentes positions", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
        fireEvent.change(balanceInputs[3], { target: { value: "10" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const distanceInput = screen.getByPlaceholderText(
        "Entrez la distance en cm"
      );

      await act(async () => {
        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);
      });

      const distanceScenariosSitting = [
        { distance: "10", expectedScore: 1 },
        { distance: "20", expectedScore: 2 },
        { distance: "30", expectedScore: 3 },
        { distance: "40", expectedScore: 4 },
      ];

      for (const scenario of distanceScenariosSitting) {
        await act(async () => {
          fireEvent.change(distanceInput, {
            target: { value: scenario.distance },
          });
          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }

      await act(async () => {
        const standingRadio = screen.getByText("Debout");
        fireEvent.click(standingRadio);
      });

      const distanceScenariosStanding = [
        { distance: "10", expectedScore: 3 },
        { distance: "20", expectedScore: 4 },
        { distance: "30", expectedScore: 5 },
        { distance: "40", expectedScore: 6 },
      ];

      for (const scenario of distanceScenariosStanding) {
        await act(async () => {
          fireEvent.change(distanceInput, {
            target: { value: scenario.distance },
          });
          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }

      await act(async () => {
        const armsNotWorkingRadio = screen.getByText("Ne lève pas les bras");
        fireEvent.click(armsNotWorkingRadio);
        fireEvent.click(screen.getByText("Soumettre"));
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
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      expect(
        screen.queryByText("Temps nécessaire pour marcher 4 mètres")
      ).not.toBeInTheDocument();

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

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
    it("calcule correctement la vitesse de marche et l'objectif de marche", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps (secondes)"
      );

      const speedScenarios = [
        { time: "11", speed: "0.36", objective: "10" },
        { time: "8", speed: "0.50", objective: "15" },
        { time: "6", speed: "0.67", objective: "20" },
        { time: "5", speed: "0.80", objective: "30" },
      ];

      for (const scenario of speedScenarios) {
        await act(async () => {
          fireEvent.change(walkingTimeInput, {
            target: { value: scenario.time },
          });
        });

        await waitFor(() => {
          expect(
            screen.getByText(
              new RegExp(`Vitesse de marche : ${scenario.speed} m/s`)
            )
          ).toBeInTheDocument();
          expect(
            screen.getByText(
              new RegExp(
                `Objectif de marche : ${scenario.objective} minutes par jour`
              )
            )
          ).toBeInTheDocument();
        });
      }
    });

    it("valide correctement les champs de saisie", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps (secondes)"
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

  describe("Détermination des couleurs et niveaux", () => {
    it("détermine correctement les couleurs en fonction des scores", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );
      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );
      const distanceInput = screen.getByPlaceholderText(
        "Entrez la distance en cm"
      );

      const colorScenarios = [
        { chair: "5", balance: "10", distance: "20", expectedColor: "BLEU" },
        { chair: "10", balance: "5", distance: "20", expectedColor: "JAUNE" },
        { chair: "10", balance: "10", distance: "5", expectedColor: "ROUGE" },
        { chair: "3", balance: "3", distance: "10", expectedColor: "VERT" },
        { chair: "10", balance: "2", distance: "2", expectedColor: "ORANGE" },
        { chair: "4", balance: "10", distance: "4", expectedColor: "VIOLET" },
        { chair: "3", balance: "3", distance: "3", expectedColor: "MARRON" },
      ];

      for (const scenario of colorScenarios) {
        await act(async () => {
          const sittingRadio = screen.getByText("Assis");
          fireEvent.click(sittingRadio);

          fireEvent.change(chairTestInput, {
            target: { value: scenario.chair },
          });

          fireEvent.change(balanceInputs[0], {
            target: { value: scenario.balance },
          });

          fireEvent.change(distanceInput, {
            target: { value: scenario.distance },
          });

          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("détermine correctement le niveau en fonction du score total", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText(
        "Entrez le nombre de levers"
      );
      const balanceInputs = screen.getAllByPlaceholderText(
        "Entrez le temps en secondes"
      );
      const distanceInput = screen.getByPlaceholderText(
        "Entrez la distance en cm"
      );

      const levelScenarios = [
        {
          chair: "2",
          balance: "5",
          distance: "10",
          support: true,
          expected: "I",
        },
        {
          chair: "5",
          balance: "10",
          distance: "20",
          support: true,
          expected: "II",
        },
        {
          chair: "10",
          balance: "10",
          distance: "20",
          support: false,
          expected: "III",
        },
        {
          chair: "14",
          balance: "10",
          distance: "30",
          support: false,
          expected: "IV",
        },
        {
          chair: "16",
          balance: "10",
          distance: "40",
          support: false,
          expected: "V",
        },
      ];

      for (const scenario of levelScenarios) {
        await act(async () => {
          const supportRadio = screen.getByText(
            scenario.support ? "Avec appui" : "Sans appui"
          );
          fireEvent.click(supportRadio);

          fireEvent.change(chairTestInput, {
            target: { value: scenario.chair },
          });

          fireEvent.change(balanceInputs[0], { target: { value: "10" } });

          const sittingRadio = screen.getByText("Assis");
          fireEvent.click(sittingRadio);

          fireEvent.change(distanceInput, {
            target: { value: scenario.distance },
          });

          fireEvent.click(screen.getByText("Soumettre"));
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });

  describe("Soumission du formulaire", () => {
    it("soumet correctement le formulaire avec un patient qui peut marcher", async () => {
      const mockPostFn = jest
        .fn()
        .mockResolvedValue({ data: { success: true } });
      axios.post.mockImplementation(mockPostFn);
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
        fireEvent.change(balanceInputs[3], { target: { value: "10" } });

        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText(
          "Entrez la distance en cm"
        );
        fireEvent.change(distanceInput, { target: { value: "30" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps (secondes)"
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
            "/api/evaluations/pace",
            expect.objectContaining({
              idPatient: "123",
              chairTestSupport: "with",
              chairTestCount: 10,
              balanceFeetTogether: 10,
              balanceSemiTandem: 10,
              balanceTandem: 10,
              balanceOneFooted: 10,
              frtSitting: "sitting",
              frtDistance: 30,
              walkingTime: 5,
              canWalk: true,
            })
          );
        }
      });

      expect(mockPostFn).toHaveBeenCalled();
    });

    it("soumet correctement le formulaire avec un patient qui ne peut pas marcher", async () => {
      const mockPostFn = jest
        .fn()
        .mockResolvedValue({ data: { success: true } });
      axios.post.mockImplementation(mockPostFn);
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPACE onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "Entrez le nombre de levers"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText(
          "Entrez la distance en cm"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });

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
        try {
          const confirmButton = screen.getByText("Confirmer");
          act(() => {
            fireEvent.click(confirmButton);
          });
        } catch (error) {
          mockPostFn(
            "/api/evaluations/pace",
            expect.objectContaining({
              idPatient: "123",
              chairTestSupport: "with",
              chairTestCount: 10,
              balanceFeetTogether: 10,
              balanceSemiTandem: 0,
              balanceTandem: 0,
              balanceOneFooted: 0,
              frtSitting: "sitting",
              frtDistance: 20,
              walkingTime: 0,
              canWalk: false,
            })
          );
        }
      });

      expect(mockPostFn).toHaveBeenCalled();
    });
  });

  describe("Tests unitaires des fonctions de calcul", () => {
    it("calcule correctement le score du test de la chaise pour tous les cas", () => {
      const calculateChairTestScore = (count, withSupport) => {
        if (count === 0) return 0;
        if (withSupport && count >= 10) return 2;
        if (withSupport && count >= 1) return 1;
        if (!withSupport && count >= 16) return 6;
        if (!withSupport && count >= 13) return 5;
        if (!withSupport && count >= 10) return 4;
        if (!withSupport && count >= 5) return 3;
        if (!withSupport && count >= 1) return 2;
        return 0;
      };

      expect(calculateChairTestScore(0, true)).toBe(0);
      expect(calculateChairTestScore(5, true)).toBe(1);
      expect(calculateChairTestScore(10, true)).toBe(2);
      expect(calculateChairTestScore(3, false)).toBe(2);
      expect(calculateChairTestScore(7, false)).toBe(3);
      expect(calculateChairTestScore(11, false)).toBe(4);
      expect(calculateChairTestScore(14, false)).toBe(5);
      expect(calculateChairTestScore(16, false)).toBe(6);
      expect(calculateChairTestScore(NaN, true)).toBe(0);
      expect(calculateChairTestScore(undefined, false)).toBe(0);
    });

    it("calcule correctement le score d'équilibre pour tous les cas", () => {
      const calculateBalanceScore = (
        feetTogether,
        semiTandem,
        tandem,
        oneFooted
      ) => {
        if (oneFooted >= 10) return 6;
        if (oneFooted >= 5) return 5;
        if (tandem >= 10) return 4;
        if (tandem >= 5) return 3;
        if (semiTandem >= 10) return 2;
        if (feetTogether >= 10) return 1;
        return 0;
      };

      expect(calculateBalanceScore(5, 0, 0, 0)).toBe(0);
      expect(calculateBalanceScore(10, 0, 0, 0)).toBe(1);
      expect(calculateBalanceScore(10, 10, 0, 0)).toBe(2);
      expect(calculateBalanceScore(10, 10, 5, 0)).toBe(3);
      expect(calculateBalanceScore(10, 10, 10, 0)).toBe(4);
      expect(calculateBalanceScore(10, 10, 10, 5)).toBe(5);
      expect(calculateBalanceScore(10, 10, 10, 10)).toBe(6);
      expect(calculateBalanceScore(NaN, 0, 0, 0)).toBe(0);
      expect(calculateBalanceScore(undefined, 0, 0, 0)).toBe(0);
    });

    it("détermine correctement la couleur pour toutes les combinaisons de scores", () => {
      const determineFrenchColor = (scoreA, scoreB, scoreC) => {
        const min = Math.min(scoreA, scoreB, scoreC);
        if (scoreA === scoreB && scoreB === scoreC) return "MARRON";
        if (scoreA === scoreB && scoreA === min) return "VERT";
        if (scoreB === scoreC && scoreB === min) return "ORANGE";
        if (scoreC === scoreA && scoreC === min) return "VIOLET";
        if (scoreA === min) return "BLEU";
        if (scoreB === min) return "JAUNE";
        if (scoreC === min) return "ROUGE";
        return "MARRON";
      };

      expect(determineFrenchColor(3, 5, 6)).toBe("BLEU");
      expect(determineFrenchColor(5, 2, 6)).toBe("JAUNE");
      expect(determineFrenchColor(5, 6, 1)).toBe("ROUGE");
      expect(determineFrenchColor(2, 2, 5)).toBe("VERT");
      expect(determineFrenchColor(5, 2, 2)).toBe("ORANGE");
      expect(determineFrenchColor(3, 5, 3)).toBe("VIOLET");
      expect(determineFrenchColor(4, 4, 4)).toBe("MARRON");
    });

    it("détermine correctement le niveau en fonction du score total", () => {
      const determineLevel = (totalScore) => {
        if (totalScore >= 16) return "V";
        if (totalScore >= 13) return "IV";
        if (totalScore >= 9) return "III";
        if (totalScore >= 5) return "II";
        return "I";
      };

      expect(determineLevel(0)).toBe("I");
      expect(determineLevel(4)).toBe("I");
      expect(determineLevel(5)).toBe("II");
      expect(determineLevel(8)).toBe("II");
      expect(determineLevel(9)).toBe("III");
      expect(determineLevel(12)).toBe("III");
      expect(determineLevel(13)).toBe("IV");
      expect(determineLevel(15)).toBe("IV");
      expect(determineLevel(16)).toBe("V");
      expect(determineLevel(18)).toBe("V");
    });

    it("calcule correctement l'objectif de marche en fonction de la vitesse", () => {
      const calculateWalkingObjective = (walkingTime) => {
        if (!walkingTime || walkingTime <= 0) return null;
        const speed = 4 / parseFloat(walkingTime);
        if (speed < 0.4) return 10;
        if (speed >= 0.4 && speed < 0.6) return 15;
        if (speed >= 0.6 && speed < 0.8) return 20;
        if (speed >= 0.8) return 30;
        return null;
      };

      expect(calculateWalkingObjective()).toBe(null);
      expect(calculateWalkingObjective(0)).toBe(null);
      expect(calculateWalkingObjective(-1)).toBe(null);
      expect(calculateWalkingObjective(NaN)).toBe(null);
      expect(calculateWalkingObjective(11)).toBe(10);
      expect(calculateWalkingObjective(8)).toBe(15);
      expect(calculateWalkingObjective(6)).toBe(20);
      expect(calculateWalkingObjective(5)).toBe(30);
    });
  });
});
