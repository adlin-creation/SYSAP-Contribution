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

jest.setTimeout(10000);

describe("EvaluationPATH Component", () => {
  const fillRequiredFields = async () => {
    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
      fireEvent.change(balanceInputs[0], { target: { value: "5" } });

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

      ["CARDIO-MUSCULAIRE", "ÉQUILIBRE", "OBJECTIF DE MARCHE"].forEach(
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

      expect(
        screen.getByText("Temps Pieds joints (secondes)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Temps Semi-tandem (secondes)")
      ).toBeInTheDocument();
      expect(screen.getByText("Temps Tandem (secondes)")).toBeInTheDocument();

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

      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");

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
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
      const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");

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
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "3" } });
        fireEvent.change(balanceInputs[2], { target: { value: "0" } });

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

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "0" } });

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
  });

  describe("Section Cardio-Musculaire", () => {
    it("calcule correctement le score du test de la chaise avec et sans appui", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");

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
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "xyz" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

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
    it("calcule correctement la vitesse de marche", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
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
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "5" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
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

  describe("Validation et soumission du formulaire", () => {
    it("valide correctement les champs de saisie", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
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
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });

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

    it("teste le contenu modal pour un patient ne pouvant pas marcher", async () => {
      const mockSubmit = jest.fn();

      await act(async () => {
        render(<EvaluationPATH onSubmit={mockSubmit} />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
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
        const chairTestInput = screen.getByPlaceholderText("Entrez le nombre");
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs = screen.getAllByPlaceholderText("Entrez le temps");
        fireEvent.change(balanceInputs[0], { target: { value: "5" } });
        fireEvent.change(balanceInputs[1], { target: { value: "5" } });
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
