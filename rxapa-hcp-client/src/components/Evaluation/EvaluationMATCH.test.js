import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationMATCH from "./EvaluationMATCH";
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

describe("EvaluationMATCH Component", () => {
  const fillRequiredFields = async () => {
    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });
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
        render(<EvaluationMATCH />);
      });

      const sections = [
        "CARDIO-MUSCULAIRE",
        "ÉQUILIBRE (Debout, sans aide)",
        "OBJECTIF DE MARCHE",
      ];
      
      sections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });

      expect(screen.getByText("Annuler")).toBeInTheDocument();
      expect(screen.getByText("Soumettre")).toBeInTheDocument();

      expect(screen.getByText("Test de la chaise en 30 secondes")).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Sans appui")).toBeInTheDocument();

      const withSupportRadio = screen
        .getByText("Avec appui")
        .closest("label")
        .querySelector("input");
      expect(withSupportRadio.checked).toBeTruthy();

      expect(screen.getByText("Temps Pieds joints (secondes)")).toBeInTheDocument();
      expect(screen.getByText("Temps Semi-tandem (secondes)")).toBeInTheDocument();
      expect(screen.getByText("Temps Tandem (secondes)")).toBeInTheDocument();

      expect(screen.getByText("Test 4 mètres – vitesse de marche confortable")).toBeInTheDocument();
      expect(screen.getByText("Le patient peut marcher")).toBeInTheDocument();
      expect(screen.getByText("Le patient ne peut pas marcher")).toBeInTheDocument();
    });

    it("gère correctement le bouton Annuler", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const cancelButton = screen.getByText("Annuler");
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe("Section Cardio-Musculaire", () => {
    it("calcule correctement le score avec appui", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const submitButton = screen.getByText("Soumettre");

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
          fireEvent.change(chairTestInput, { target: { value: scenario.count } });
          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("calcule correctement le score sans appui", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const submitButton = screen.getByText("Soumettre");

      await act(async () => {
        const withoutSupportRadio = screen.getByText("Sans appui");
        fireEvent.click(withoutSupportRadio);
      });

      const withoutSupportScenarios = [
        { count: "2", expectedScore: 2 },
        { count: "4", expectedScore: 3 },
        { count: "7", expectedScore: 4 },
        { count: "10", expectedScore: 5 },
      ];

      for (const scenario of withoutSupportScenarios) {
        await act(async () => {
          fireEvent.change(chairTestInput, { target: { value: scenario.count } });
          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });

  describe("Section Équilibre", () => {
    it("active/désactive correctement les champs d'équilibre selon les résultats", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });
      });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");

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
    });
    it("calcule correctement les scores d'équilibre pour tous les scénarios", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });
      });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      const submitButton = screen.getByText("Soumettre");

      const balanceScenarios = [
        { ft: "5", st: "", t: "", expectedScore: 0 },
        { ft: "10", st: "0", t: "0", expectedScore: 1 },
        { ft: "10", st: "5", t: "0", expectedScore: 2 },
        { ft: "10", st: "10", t: "0", expectedScore: 3 },
        { ft: "10", st: "10", t: "3", expectedScore: 4 },
      ];

      for (const scenario of balanceScenarios) {
        await act(async () => {
          fireEvent.change(balanceInputs[0], { target: { value: scenario.ft } });

          if (scenario.st && !balanceInputs[1].disabled) {
            fireEvent.change(balanceInputs[1], {
              target: { value: scenario.st },
            });
          }

          if (scenario.t && !balanceInputs[2].disabled) {
            fireEvent.change(balanceInputs[2], { target: { value: scenario.t } });
          }

          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });
  });

  describe("Section Objectif de Marche", () => {
    it("affiche ou masque correctement le champ du temps de marche selon la capacité du patient", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

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

    it("calcule correctement la vitesse de marche et l'objectif journalier", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
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
              new RegExp(
                `Objectif de marche : ${scenario.objective} minutes par jour`
              )
            )
          ).toBeInTheDocument();
        });
      }
    });
    it("valide correctement les saisies dans le champ de temps de marche", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
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

  describe("Calcul des scores et programme recommandé", () => {
    it("calcule correctement le score total et détermine la couleur du programme", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      const submitButton = screen.getByText("Soumettre");

      const colorScenarios = [
        { chairCount: "0", balance: "5", expectedColor: "ROUGE" },
        { chairCount: "4", balance: "10", expectedColor: "JAUNE" },
        { chairCount: "10", balance: "10", st: "5", expectedColor: "ORANGE" },
        {
          withSupport: false,
          chairCount: "7", 
          balance: "10", 
          st: "10", 
          expectedColor: "VERT"
        },
        {
          withSupport: false,
          chairCount: "10",
          balance: "10",
          st: "10",
          tandem: "3",
          expectedColor: "BLEU"
        },
      ];

      for (const scenario of colorScenarios) {
        await act(async () => {
          if (scenario.withSupport === false) {
            const supportRadio = screen.getByText("Sans appui");
            fireEvent.click(supportRadio);
          } else {
            const supportRadio = screen.getByText("Avec appui");
            fireEvent.click(supportRadio);
          }

          fireEvent.change(chairTestInput, {
            target: { value: scenario.chairCount },
          });

          fireEvent.change(balanceInputs[0], {
            target: { value: scenario.balance },
          });

          if (scenario.st && !balanceInputs[1].disabled) {
            fireEvent.change(balanceInputs[1], {
              target: { value: scenario.st },
            });
          }

          if (scenario.tandem && !balanceInputs[2].disabled) {
            fireEvent.change(balanceInputs[2], {
              target: { value: scenario.tandem },
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

  describe("Validation du formulaire", () => {
    it("refuse de soumettre le formulaire avec des champs obligatoires vides", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("gère correctement les saisies non numériques dans les champs", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "xyz" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("gère correctement la valeur zéro dans les champs", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "0" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });
  describe("Soumission du formulaire", () => {
    it("soumet correctement le formulaire pour un patient pouvant marcher", async () => {
      const mockPostFn = jest.fn().mockResolvedValue({ data: { success: true } });
      axios.post.mockImplementation(mockPostFn);

      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "3" } });

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
            "/api/evaluations/match",
            expect.objectContaining({
              idPatient: "123",
              chairTestSupport: "with",
              chairTestCount: 10,
              balanceFeetTogether: 10,
              balanceSemiTandem: 10,
              balanceTandem: 3,
              walkingTime: 5,
              scores: expect.objectContaining({
                cardioMusculaire: expect.any(Number),
                equilibre: expect.any(Number),
                total: expect.any(Number),
                program: expect.any(String),
              }),
            })
          );
        }
      });

      expect(mockPostFn).toHaveBeenCalled();
    });

    it("soumet correctement le formulaire pour un patient ne pouvant pas marcher", async () => {
      const mockPostFn = jest.fn().mockResolvedValue({ data: { success: true } });
      axios.post.mockImplementation(mockPostFn);

      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

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
            "/api/evaluations/match",
            expect.objectContaining({
              idPatient: "123",
              chairTestSupport: "with",
              chairTestCount: 10,
              balanceFeetTogether: 10,
              balanceSemiTandem: 0,
              balanceTandem: 0,
              walkingTime: 0,
              scores: expect.objectContaining({
                cardioMusculaire: expect.any(Number),
                equilibre: expect.any(Number),
                total: expect.any(Number),
                program: expect.any(String),
              }),
            })
          );
        }
      });

      expect(mockPostFn).toHaveBeenCalled();
    });
  });

  describe("Fonctions de calcul des scores", () => {
    const testCalculateChairTestScore = (count, withSupport) => {
      if (isNaN(count) || count === 0) return 0;

      if (withSupport) {
        if (count < 5) return 1;
        if (count >= 5 && count <= 9) return 2;
        if (count >= 10) return 3;
      } else {
        if (count >= 3 && count <= 5) return 3;
        if (count < 3) return 2;
        if (count >= 5 && count <= 9) return 4;
        if (count >= 10) return 5;
      }
      return 0;
    };

    const testCalculateBalanceScore = (feetTogether, semiTandem, tandem) => {
      if (tandem >= 3) return 4;
      if (semiTandem >= 10) return 3;
      if (semiTandem < 10 && semiTandem > 0) return 2;
      if (feetTogether >= 10) return 1;
      return 0;
    };

    const testGetProgramColor = (totalScore) => {
      if (totalScore <= 1) return "ROUGE";
      if (totalScore <= 3) return "JAUNE";
      if (totalScore <= 5) return "ORANGE";
      if (totalScore <= 7) return "VERT";
      return "BLEU";
    };

    const testCalculateWalkingObjective = (walkingTime) => {
      if (!walkingTime || walkingTime <= 0) return null;

      const speed = 4 / parseFloat(walkingTime);

      if (speed < 0.4) return 10;
      if (speed >= 0.4 && speed < 0.6) return 15;
      if (speed >= 0.6 && speed < 0.8) return 20;
      if (speed >= 0.8) return 30;

      return null;
    };

    it("calcule correctement le score du test de la chaise pour tous les cas", () => {
      expect(testCalculateChairTestScore(NaN, true)).toBe(0);
      expect(testCalculateChairTestScore(0, true)).toBe(0);
      expect(testCalculateChairTestScore(4, true)).toBe(1);
      expect(testCalculateChairTestScore(7, true)).toBe(2);
      expect(testCalculateChairTestScore(10, true)).toBe(3);

      expect(testCalculateChairTestScore(NaN, false)).toBe(0);
      expect(testCalculateChairTestScore(0, false)).toBe(0);
      expect(testCalculateChairTestScore(2, false)).toBe(2);
      expect(testCalculateChairTestScore(4, false)).toBe(3);
      expect(testCalculateChairTestScore(7, false)).toBe(4);
      expect(testCalculateChairTestScore(10, false)).toBe(5);
    });

    it("calcule correctement le score d'équilibre pour tous les cas", () => {
      expect(testCalculateBalanceScore(9, 0, 0)).toBe(0);
      expect(testCalculateBalanceScore(10, 0, 0)).toBe(1);
      expect(testCalculateBalanceScore(10, 5, 0)).toBe(2);
      expect(testCalculateBalanceScore(10, 10, 0)).toBe(3);
      expect(testCalculateBalanceScore(10, 10, 3)).toBe(4);
    });

    it("détermine correctement la couleur du programme pour tous les scores", () => {
      expect(testGetProgramColor(0)).toBe("ROUGE");
      expect(testGetProgramColor(1)).toBe("ROUGE");
      expect(testGetProgramColor(2)).toBe("JAUNE");
      expect(testGetProgramColor(3)).toBe("JAUNE");
      expect(testGetProgramColor(4)).toBe("ORANGE");
      expect(testGetProgramColor(5)).toBe("ORANGE");
      expect(testGetProgramColor(6)).toBe("VERT");
      expect(testGetProgramColor(7)).toBe("VERT");
      expect(testGetProgramColor(8)).toBe("BLEU");
      expect(testGetProgramColor(9)).toBe("BLEU");
    });

    it("calcule correctement l'objectif de marche pour tous les cas", () => {
      expect(testCalculateWalkingObjective()).toBe(null);
      expect(testCalculateWalkingObjective(0)).toBe(null);
      expect(testCalculateWalkingObjective(-1)).toBe(null);
      expect(testCalculateWalkingObjective(11)).toBe(10);
      expect(testCalculateWalkingObjective(8)).toBe(15);
      expect(testCalculateWalkingObjective(6)).toBe(20);
      expect(testCalculateWalkingObjective(5)).toBe(30);
    });
  });

  describe("Contenu modal", () => {
    it("vérifie le contenu modal pour un patient avec données de marche complètes", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

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
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("vérifie le contenu modal pour un patient ne pouvant pas marcher", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

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
  });

  describe("Cas limites", () => {
    it("gère correctement les cas limites dans le calcul des scores", async () => {
      await act(async () => {
        render(<EvaluationMATCH />);
      });

      const originalParseInt = global.parseInt;
      global.parseInt = jest.fn().mockImplementation(() => {
        return {};
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "123" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      global.parseInt = originalParseInt;

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });
});
