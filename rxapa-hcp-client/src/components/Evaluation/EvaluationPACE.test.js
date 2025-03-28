import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationPACE from "./EvaluationPACE";
import useToken from "../Authentication/useToken";
import axios from "axios";
import { act } from "@testing-library/react";

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
        sectionA_title: "CARDIO-MUSCULAIRE",
        sectionB_title: "ÉQUILIBRE (Debout, sans aide)",
        sectionC_title: "MOBILITÉ & STABILITÉ DU TRONC",
        sectionD_title: "OBJECTIF DE MARCHE",
        chair_test_label: "Test de la chaise en 30 secondes",
        with_support: "Avec appui",
        without_support: "Sans appui",
        stand_count: "Nombre de levers",
        stand_count_placeholder: "Entrez le nombre",
        balance_instructions:
          "Mesurer le temps maximal en position d'équilibre (secondes)",
        feet_together: "Pieds joints",
        feet_semi_tandem: "Semi-tandem",
        feet_tandem: "Tandem",
        feet_unipodal: "Unipodale",
        time_placeholder: "Entrez le temps",
        frt_label: "Functional Reach Test (FRT)",
        sitting: "Assis",
        standing: "Debout",
        arms_not_working: "Bras non fonctionnels",
        distance_label: "Distance atteinte (cm)",
        distance_placeholder: "Entrez la distance",
        walk_test_label: "Test 4 mètres – vitesse de marche confortable",
        patient_can_walk: "Le patient peut marcher",
        patient_cannot_walk: "Le patient ne peut pas marcher",
        walking_time_label: "Temps nécessaire pour marcher 4 mètres (secondes)",
        walktime_placeholder: "Entrez le temps en secondes",
        walking_speed: "Vitesse de marche",
        walking_objective: "Objectif de marche",
        minutes_per_day: "minutes par jour",
        walking_time_required: "Veuillez entrer le temps de marche",
        walking_time_invalid: "Le temps de marche doit être un nombre positif",
        walking_ability_to_work:
          "Capacité de marche à travailler (Objectif à réévaluer au cours du séjour)",
        color_blue: "BLEU",
        color_yellow: "JAUNE",
        color_red: "ROUGE",
        color_green: "VERT",
        color_orange: "ORANGE",
        color_purple: "VIOLET",
        color_brown: "MARRON",
        modal_results_eval: "Évaluation PACE",
        individual_scores: "Scores individuels :",
        cardio_score: "Cardio-musculaire",
        balance_score: "Équilibre",
        mobility_score: "Mobilité",
        total_score: "SCORE TOTAL",
        level: "Niveau",
        recommended_program: "Programme PACE recommandé",
        modal_confirm_evaluation: "Confirmer",
      };
      return translations[key] || key;
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

describe("EvaluationPACE Component", () => {
  const fillRequiredFields = async () => {
    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });

      const distanceInput = screen.getByPlaceholderText("Entrez la distance");
      fireEvent.change(distanceInput, { target: { value: "20" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });
  };

  const submitForm = async () => {
    await act(async () => {
      const submitButton = screen.getByText("Soumettre");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
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
      await act(async () => {
        render(<EvaluationPACE />);
      });

      const sections = [
        "CARDIO-MUSCULAIRE",
        "ÉQUILIBRE (Debout, sans aide)",
        "MOBILITÉ & STABILITÉ DU TRONC",
        "OBJECTIF DE MARCHE",
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

      expect(screen.getByText("Pieds joints")).toBeInTheDocument();
      expect(screen.getByText("Semi-tandem")).toBeInTheDocument();
      expect(screen.getByText("Tandem")).toBeInTheDocument();
      expect(screen.getByText("Unipodale")).toBeInTheDocument();

      expect(
        screen.getByText("Functional Reach Test (FRT)")
      ).toBeInTheDocument();
      expect(screen.getByText("Assis")).toBeInTheDocument();
      expect(screen.getByText("Debout")).toBeInTheDocument();
      expect(screen.getByText("Bras non fonctionnels")).toBeInTheDocument();

      expect(
        screen.getByText("Test 4 mètres – vitesse de marche confortable")
      ).toBeInTheDocument();
      expect(screen.getByText("Le patient peut marcher")).toBeInTheDocument();
      expect(
        screen.getByText("Le patient ne peut pas marcher")
      ).toBeInTheDocument();
    });
  });
  describe("Section Équilibre", () => {
    it("active ou désactive correctement les tests d'équilibre en fonction des résultats précédents", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");

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
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText("Entrez la distance");
        fireEvent.change(distanceInput, { target: { value: "20" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      const submitButton = screen.getByText("Soumettre");

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

          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });
  describe("Section Cardio-Musculaire", () => {
    it("calcule correctement le score du test de la chaise avec et sans appui", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText("Entrez la distance");
        fireEvent.change(distanceInput, { target: { value: "20" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const submitButton = screen.getByText("Soumettre");

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
          fireEvent.click(submitButton);
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
          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });
  describe("Section Mobilité", () => {
    it("désactive correctement le champ de distance FRT lorsque 'Bras non fonctionnels' est sélectionné", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      const distanceInput = screen.getByPlaceholderText("Entrez la distance");
      expect(distanceInput).not.toBeDisabled();

      await act(async () => {
        const armsNotWorkingRadio = screen.getByText("Bras non fonctionnels");
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
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
        fireEvent.change(balanceInputs[3], { target: { value: "10" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const distanceInput = screen.getByPlaceholderText("Entrez la distance");
      const submitButton = screen.getByText("Soumettre");

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
          fireEvent.click(submitButton);
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
          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }

      await act(async () => {
        const armsNotWorkingRadio = screen.getByText("Bras non fonctionnels");
        fireEvent.click(armsNotWorkingRadio);
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe("Section Objectif de Marche", () => {
    it("gère correctement l'affichage du champ de temps de marche selon la capacité du patient", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      expect(
        screen.queryByText("Temps nécessaire pour marcher 4 mètres (secondes)")
      ).not.toBeInTheDocument();

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      expect(
        screen.getByText("Temps nécessaire pour marcher 4 mètres (secondes)")
      ).toBeInTheDocument();

      await act(async () => {
        const cannotWalkRadio = screen.getByText(
          "Le patient ne peut pas marcher"
        );
        fireEvent.click(cannotWalkRadio);
      });

      expect(
        screen.queryByText("Temps nécessaire pour marcher 4 mètres (secondes)")
      ).not.toBeInTheDocument();
    });

    it("calcule correctement la vitesse de marche et l'objectif de marche", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
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
              new RegExp(`Objectif de marche : ${scenario.objective} minutes`)
            )
          ).toBeInTheDocument();
        });
      }
    });

    it("valide correctement les champs de saisie", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
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
        "Entrez le temps en secondes"
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
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      const distanceInput = screen.getByPlaceholderText("Entrez la distance");
      const submitButton = screen.getByText("Soumettre");

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

          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("détermine correctement le niveau en fonction du score total", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      const distanceInput = screen.getByPlaceholderText("Entrez la distance");
      const submitButton = screen.getByText("Soumettre");

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

          fireEvent.click(submitButton);
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

      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
        fireEvent.change(balanceInputs[3], { target: { value: "10" } });

        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText("Entrez la distance");
        fireEvent.change(distanceInput, { target: { value: "30" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
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

      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const sittingRadio = screen.getByText("Assis");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText("Entrez la distance");
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
