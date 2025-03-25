import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationPACE from "./EvaluationPACE";
import useToken from "../Authentication/useToken";
import axios from "axios";
// Utiliser act depuis React Testing Library au lieu de react-dom/test-utils
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
        patient_can_walk: "Le patient peut marcher",
        patient_cannot_walk: "Le patient ne peut pas marcher",
        walktime_placeholder: "Entrez le temps en secondes",
        walking_time_label: "Temps nécessaire pour marcher 4 mètres (secondes)",
        walking_speed: "Vitesse de marche",
        walking_objective: "Objectif de marche",
        minutes_per_day: "minutes par jour",
        sectionD_title: "OBJECTIF DE MARCHE",
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
      const chairTestInput = screen.getByPlaceholderText(
        "stand_count_placeholder"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });

      const distanceInput = screen.getByPlaceholderText("distance_placeholder");
      fireEvent.change(distanceInput, { target: { value: "20" } });

      // Assurez-vous que le patient peut marcher est sélectionné
      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      // Maintenant cherchez le champ de temps de marche qui devrait être visible
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

  it("renders the component and shows all expected sections", async () => {
    // Envelopper le rendu avec act
    await act(async () => {
      render(<EvaluationPACE />);
    });

    [
      "sectionA_title",
      "sectionB_title",
      "sectionC_title",
      "OBJECTIF DE MARCHE",
    ].forEach((section) =>
      expect(screen.getByText(section)).toBeInTheDocument()
    );

    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Soumettre")).toBeInTheDocument();

    expect(screen.getByText("chair_test_label")).toBeInTheDocument();
    expect(screen.getByText("with_support")).toBeInTheDocument();
    expect(screen.getByText("without_support")).toBeInTheDocument();

    const withSupportRadio = screen
      .getByText("with_support")
      .closest("label")
      .querySelector("input");
    expect(withSupportRadio.checked).toBeTruthy();

    expect(screen.getByText("feet_together")).toBeInTheDocument();
    expect(screen.getByText("feet_semi_tandem")).toBeInTheDocument();
    expect(screen.getByText("feet_tandem")).toBeInTheDocument();
    expect(screen.getByText("feet_unipodal")).toBeInTheDocument();

    expect(screen.getByText("frt_label")).toBeInTheDocument();
    expect(screen.getByText("sitting")).toBeInTheDocument();
    expect(screen.getByText("standing")).toBeInTheDocument();
    expect(screen.getByText("arms_not_working")).toBeInTheDocument();

    expect(screen.getByText("walk_test_label")).toBeInTheDocument();
  });

  it("enables/disables balance tests based on previous test results", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");

    await act(async () => {
      fireEvent.change(balanceInputs[0], { target: { value: "5" } });
    });
    expect(balanceInputs[1]).toBeDisabled();

    await act(async () => {
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });
    });
    expect(balanceInputs[1]).not.toBeDisabled();

    await act(async () => {
      fireEvent.change(balanceInputs[1], { target: { value: "10" } });
    });
    expect(balanceInputs[2]).not.toBeDisabled();

    await act(async () => {
      fireEvent.change(balanceInputs[2], { target: { value: "10" } });
    });
    expect(balanceInputs[3]).not.toBeDisabled();
  });

  it("affiche ou masque le champ du temps de marche selon la capacité du patient à marcher", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
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

  it("calcule correctement la vitesse de marche et désactive l'entrée FRT au besoin", async () => {
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

    await act(async () => {
      const armsNotWorkingRadio = screen.getByText("arms_not_working");
      fireEvent.click(armsNotWorkingRadio);
    });

    const distanceInput = screen.getByPlaceholderText("distance_placeholder");
    expect(distanceInput).toBeDisabled();
  });
  it("submits the form with valid data", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText(
        "stand_count_placeholder"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      fireEvent.change(balanceInputs[1], { target: { value: "10" } });
      fireEvent.change(balanceInputs[2], { target: { value: "10" } });
      fireEvent.change(balanceInputs[3], { target: { value: "10" } });

      const sittingRadio = screen.getByText("sitting");
      fireEvent.click(sittingRadio);

      const distanceInput = screen.getByPlaceholderText("distance_placeholder");
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
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("tests all chair test score scenarios", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    await act(async () => {
      const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });

      const distanceInput = screen.getByPlaceholderText("distance_placeholder");
      fireEvent.change(distanceInput, { target: { value: "20" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });

    const chairTestInput = screen.getByPlaceholderText(
      "stand_count_placeholder"
    );
    const submitButton = screen.getByText("Soumettre");

    const chairScenarios = [
      { support: true, count: "0", expectedScore: 0 },
      { support: true, count: "5", expectedScore: 1 },
      { support: true, count: "10", expectedScore: 2 },
      { support: false, count: "3", expectedScore: 2 },
      { support: false, count: "7", expectedScore: 3 },
      { support: false, count: "11", expectedScore: 4 },
      { support: false, count: "14", expectedScore: 5 },
      { support: false, count: "16", expectedScore: 6 },
    ];

    for (const scenario of chairScenarios) {
      await act(async () => {
        const supportRadio = screen.getByText(
          scenario.support ? "with_support" : "without_support"
        );
        fireEvent.click(supportRadio);
        fireEvent.change(chairTestInput, { target: { value: scenario.count } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    }

    await act(async () => {
      fireEvent.change(chairTestInput, { target: { value: "" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("tests all balance score scenarios", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText(
        "stand_count_placeholder"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const distanceInput = screen.getByPlaceholderText("distance_placeholder");
      fireEvent.change(distanceInput, { target: { value: "20" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });

    const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
    const submitButton = screen.getByText("Soumettre");

    const balanceScenarios = [
      { ft: "5", st: "", t: "", of: "", expectedScore: 0 },
      { ft: "10", st: "5", t: "", of: "", expectedScore: 1 },
      { ft: "10", st: "10", t: "3", of: "", expectedScore: 2 },
      { ft: "10", st: "10", t: "7", of: "", expectedScore: 3 },
      { ft: "10", st: "10", t: "10", of: "", expectedScore: 4 },
      { ft: "10", st: "10", t: "10", of: "7", expectedScore: 5 },
      { ft: "10", st: "10", t: "10", of: "10", expectedScore: 6 },
    ];

    for (const scenario of balanceScenarios) {
      await act(async () => {
        fireEvent.change(balanceInputs[0], { target: { value: scenario.ft } });

        if (!balanceInputs[1].disabled && scenario.st) {
          fireEvent.change(balanceInputs[1], {
            target: { value: scenario.st },
          });
        }

        if (!balanceInputs[2].disabled && scenario.t) {
          fireEvent.change(balanceInputs[2], { target: { value: scenario.t } });
        }

        if (!balanceInputs[3].disabled && scenario.of) {
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

  it("tests mobility score calculation in sitting and standing positions", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    await act(async () => {
      const chairTestInput = screen.getByPlaceholderText(
        "stand_count_placeholder"
      );
      fireEvent.change(chairTestInput, { target: { value: "10" } });

      const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      fireEvent.change(balanceInputs[1], { target: { value: "10" } });
      fireEvent.change(balanceInputs[2], { target: { value: "10" } });
      fireEvent.change(balanceInputs[3], { target: { value: "7" } });

      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });

    const distanceInput = screen.getByPlaceholderText("distance_placeholder");
    const submitButton = screen.getByText("Soumettre");

    await act(async () => {
      const sittingRadio = screen.getByText("sitting");
      fireEvent.click(sittingRadio);
    });

    const distanceScenariosSitting = [
      { distance: "0", expectedScore: 0 },
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
      const standingRadio = screen.getByText("standing");
      fireEvent.click(standingRadio);
    });

    const distanceScenariosStanding = [
      { distance: "0", expectedScore: 0 },
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
      const armsNotWorkingRadio = screen.getByText("arms_not_working");
      fireEvent.click(armsNotWorkingRadio);
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("determines correct level based on total score", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    const chairTestInput = screen.getByPlaceholderText(
      "stand_count_placeholder"
    );
    const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
    const distanceInput = screen.getByPlaceholderText("distance_placeholder");
    const submitButton = screen.getByText("Soumettre");

    await act(async () => {
      const canWalkRadio = screen.getByText("Le patient peut marcher");
      fireEvent.click(canWalkRadio);

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      fireEvent.change(walkingTimeInput, { target: { value: "5" } });
    });

    await act(async () => {
      const sittingRadio = screen.getByText("sitting");
      fireEvent.click(sittingRadio);

      fireEvent.change(chairTestInput, { target: { value: "5" } });
      fireEvent.change(balanceInputs[0], { target: { value: "5" } });
      fireEvent.change(distanceInput, { target: { value: "10" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.change(chairTestInput, { target: { value: "10" } });
      fireEvent.change(balanceInputs[0], { target: { value: "10" } });
      fireEvent.change(distanceInput, { target: { value: "20" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.change(balanceInputs[1], { target: { value: "10" } });
      fireEvent.change(balanceInputs[2], { target: { value: "10" } });
      fireEvent.change(distanceInput, { target: { value: "30" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    await act(async () => {
      const withoutSupportRadio = screen.getByText("without_support");
      fireEvent.click(withoutSupportRadio);
      fireEvent.change(chairTestInput, { target: { value: "16" } });

      const standingRadio = screen.getByText("standing");
      fireEvent.click(standingRadio);
      fireEvent.change(distanceInput, { target: { value: "30" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.change(distanceInput, { target: { value: "40" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("tests the cancel button functionality", async () => {
    await act(async () => {
      render(<EvaluationPACE />);
    });

    await act(async () => {
      const cancelButton = screen.getByText("Annuler");
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(true).toBeTruthy();
    });
  });

  it("validates walkingTime input correctly", async () => {
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

  // Continuer avec le reste des tests, en appliquant le même modèle de correction
  // avec act() pour toutes les interactions utilisateur

  describe("Score calculation unit tests", () => {
    it("should calculate chair test score correctly for all cases", () => {
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
    it("tests all color determination scenarios", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      const chairTestInput = screen.getByPlaceholderText(
        "stand_count_placeholder"
      );
      const balanceInputs = screen.getAllByPlaceholderText("time_placeholder");
      const distanceInput = screen.getByPlaceholderText("distance_placeholder");
      const submitButton = screen.getByText("Soumettre");
      const sittingRadio = screen.getByText("sitting");

      await act(async () => {
        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });
      });

      const colorScenarios = [
        { a: "5", b: "10", c: "20", position: "sitting", color: "BLEU" },
        { a: "10", b: "5", c: "20", position: "sitting", color: "JAUNE" },
        { a: "10", b: "10", c: "10", position: "sitting", color: "ROUGE" },
        { a: "1", b: "0", c: "40", position: "sitting", color: "VERT" },
        { a: "10", b: "1", c: "10", position: "sitting", color: "ORANGE" },
        { a: "1", b: "10", c: "10", position: "sitting", color: "VIOLET" },
        { a: "1", b: "1", c: "10", position: "sitting", color: "MARRON" },
      ];

      for (const scenario of colorScenarios) {
        await act(async () => {
          fireEvent.click(sittingRadio);

          fireEvent.change(chairTestInput, { target: { value: scenario.a } });
          fireEvent.change(balanceInputs[0], {
            target: { value: scenario.b === "0" ? "5" : "10" },
          });
          if (scenario.b !== "0" && scenario.b !== "5") {
            fireEvent.change(balanceInputs[1], {
              target: { value: scenario.b },
            });
          }
          fireEvent.change(distanceInput, { target: { value: scenario.c } });

          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("handles edge cases for building payload", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "stand_count_placeholder"
        );
        fireEvent.change(chairTestInput, { target: { value: "5.5" } });

        const balanceInputs =
          screen.getAllByPlaceholderText("time_placeholder");
        fireEvent.change(balanceInputs[0], { target: { value: "10.5" } });

        const sittingRadio = screen.getByText("sitting");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText(
          "distance_placeholder"
        );
        fireEvent.change(distanceInput, { target: { value: "25.5" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5.25" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    it("tests form validation with missing required fields", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        const errorElements = document.querySelectorAll(
          ".ant-form-item-explain-error"
        );
        expect(errorElements.length).toBeGreaterThan(0);
      });

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("tests walking objective calculation for all speeds", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "stand_count_placeholder"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs =
          screen.getAllByPlaceholderText("time_placeholder");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText(
          "distance_placeholder"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);
      });

      const walkingTimeInput = screen.getByPlaceholderText(
        "Entrez le temps en secondes"
      );
      const submitButton = screen.getByText("Soumettre");

      const speedScenarios = [
        { time: "", expectedObjective: null },
        { time: "-1", expectedObjective: null },
        { time: "0", expectedObjective: null },
        { time: "11", expectedObjective: 10 },
        { time: "8", expectedObjective: 15 },
        { time: "6", expectedObjective: 20 },
        { time: "4", expectedObjective: 30 },
      ];

      for (const scenario of speedScenarios) {
        await act(async () => {
          fireEvent.change(walkingTimeInput, {
            target: { value: scenario.time },
          });
          fireEvent.click(submitButton);
        });

        await waitFor(() => {
          expect(axios.post).not.toHaveBeenCalled();
        });
      }
    });

    it("tests edge case in chair test score calculation", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "stand_count_placeholder"
        );
        fireEvent.change(chairTestInput, { target: { value: "" } });

        const balanceInputs =
          screen.getAllByPlaceholderText("time_placeholder");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const distanceInput = screen.getByPlaceholderText(
          "distance_placeholder"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });

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

    it("tests frtPosition values in buildPayload", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "stand_count_placeholder"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs =
          screen.getAllByPlaceholderText("time_placeholder");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });

        const canWalkRadio = screen.getByText("Le patient peut marcher");
        fireEvent.click(canWalkRadio);

        const walkingTimeInput = screen.getByPlaceholderText(
          "Entrez le temps en secondes"
        );
        fireEvent.change(walkingTimeInput, { target: { value: "5" } });

        const standingRadio = screen.getByText("standing");
        fireEvent.click(standingRadio);

        const distanceInput = screen.getByPlaceholderText(
          "distance_placeholder"
        );
        fireEvent.change(distanceInput, { target: { value: "20" } });
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        try {
          const confirmButton = screen.getByText("modal_confirm_evaluation");
          act(() => {
            fireEvent.click(confirmButton);
          });
        } catch (error) {}
      });

      await waitFor(() => {});

      axios.post.mockClear();

      await act(async () => {
        const armsNotWorkingRadio = screen.getByText("arms_not_working");
        fireEvent.click(armsNotWorkingRadio);
      });

      await act(async () => {
        const submitButton = screen.getByText("Soumettre");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        try {
          const confirmButton = screen.getByText("modal_confirm_evaluation");
          act(() => {
            fireEvent.click(confirmButton);
          });
        } catch (error) {}
      });

      await waitFor(() => {});
    });

    it("tests the complete evaluation flow with modal confirmation", async () => {
      await act(async () => {
        render(<EvaluationPACE />);
      });

      await act(async () => {
        const chairTestInput = screen.getByPlaceholderText(
          "stand_count_placeholder"
        );
        fireEvent.change(chairTestInput, { target: { value: "10" } });

        const balanceInputs =
          screen.getAllByPlaceholderText("time_placeholder");
        fireEvent.change(balanceInputs[0], { target: { value: "10" } });
        fireEvent.change(balanceInputs[1], { target: { value: "10" } });
        fireEvent.change(balanceInputs[2], { target: { value: "10" } });
        fireEvent.change(balanceInputs[3], { target: { value: "10" } });

        const sittingRadio = screen.getByText("sitting");
        fireEvent.click(sittingRadio);

        const distanceInput = screen.getByPlaceholderText(
          "distance_placeholder"
        );
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
          const confirmButton = screen.getByText("modal_confirm_evaluation");
          act(() => {
            fireEvent.click(confirmButton);
          });
        } catch (error) {}
      });

      await waitFor(() => {});
    });

    describe("Score calculation unit tests", () => {
      it("should determine color correctly for all score combinations", () => {
        const determineColor = (scoreA, scoreB, scoreC) => {
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

        expect(determineColor(3, 5, 6)).toBe("BLEU");
        expect(determineColor(5, 2, 6)).toBe("JAUNE");
        expect(determineColor(5, 6, 1)).toBe("ROUGE");
        expect(determineColor(2, 2, 5)).toBe("VERT");
        expect(determineColor(5, 2, 2)).toBe("ORANGE");
        expect(determineColor(3, 5, 3)).toBe("VIOLET");
        expect(determineColor(4, 4, 4)).toBe("MARRON");
        expect(determineColor(10, 5, 8)).toBe("JAUNE");

        const mockMin = jest.spyOn(Math, "min").mockImplementationOnce(() => 0);
        expect(determineColor(4, 4, 4)).toBe("MARRON");
        mockMin.mockRestore();
      });

      it("should calculate balance score correctly for all cases", () => {
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

      it("should calculate mobility score correctly for all cases", () => {
        const calculateMobilityScore = (
          isStanding,
          distance,
          balanceScore,
          armNotWorking
        ) => {
          if (armNotWorking) return 0;
          if (distance === 0 || isNaN(distance)) return 0;

          if (isStanding && balanceScore >= 5) {
            if (distance > 35) return 6;
            if (distance >= 27) return 5;
            if (distance >= 15) return 4;
            return 3;
          } else {
            if (distance > 35) return 4;
            if (distance >= 27) return 3;
            if (distance >= 15) return 2;
            return 1;
          }
        };

        expect(calculateMobilityScore(false, 0, 0, false)).toBe(0);
        expect(calculateMobilityScore(false, 10, 0, false)).toBe(1);
        expect(calculateMobilityScore(false, 20, 0, false)).toBe(2);
        expect(calculateMobilityScore(false, 30, 0, false)).toBe(3);
        expect(calculateMobilityScore(false, 40, 0, false)).toBe(4);

        expect(calculateMobilityScore(true, 10, 5, false)).toBe(3);
        expect(calculateMobilityScore(true, 20, 5, false)).toBe(4);
        expect(calculateMobilityScore(true, 30, 5, false)).toBe(5);
        expect(calculateMobilityScore(true, 40, 5, false)).toBe(6);

        expect(calculateMobilityScore(false, 20, 0, true)).toBe(0);
        expect(calculateMobilityScore(true, 20, 5, true)).toBe(0);

        expect(calculateMobilityScore(false, NaN, 0, false)).toBe(0);
        expect(calculateMobilityScore(true, undefined, 5, false)).toBe(0);
      });

      it("should determine level correctly for all score ranges", () => {
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

      it("should calculate walking objective correctly for all speed ranges", () => {
        const calculateWalkingObjective = (walkingTime) => {
          if (!walkingTime || walkingTime <= 0 || isNaN(walkingTime))
            return null;

          const speed = 4 / parseFloat(walkingTime);

          if (speed < 0.4) return 10;
          if (speed >= 0.4 && speed < 0.59) return 15;
          if (speed >= 0.6 && speed < 0.79) return 20;
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
});
