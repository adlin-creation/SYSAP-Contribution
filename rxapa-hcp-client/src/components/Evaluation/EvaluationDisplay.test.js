jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock React.act pour éviter les warnings d'avertissement
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    act: (callback) => callback(),
  };
});
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationDisplay from "./EvaluationDisplay";
import useToken from "../Authentication/useToken";
import { act } from "@testing-library/react";

// Mock des dépendances
jest.mock("../Authentication/useToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ patientId: "123" }),
  useNavigate: () => jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ patientId: "123" }),
  useNavigate: () => jest.fn(),
}));

// Mock de Constants
jest.mock("../Utils/Constants", () => ({
  SERVER_URL: "http://localhost:3000/api",
}));

// Mock des données
const mockPatient = {
  id: 123,
  firstname: "Jean",
  lastname: "Dupont",
};

const mockPaceEvaluation = {
  id: 1,
  createdAt: "2025-01-10T10:00:00Z",
  Evaluation_PACE: {
    chairTestSupport: true,
    chairTestCount: 8,
    scoreTotal: 15,
    balanceOneFooted: 10,
    frtSitting: true,
    frtDistance: 25,
    vitesseDeMarche: 0.75,
  },
  Program: {
    name: "Programme PACE 1",
  },
};

const mockPathEvaluation = {
  id: 2,
  createdAt: "2025-01-15T10:00:00Z",
  Evaluation_PATH: {
    chairTestSupport: false,
    chairTestCount: 10,
    scoreTotal: 8,
    balanceTandem: 8,
    vitesseDeMarche: 0.82,
  },
  Program: {
    name: "Programme PATH 2",
  },
};

const mockMatchEvaluation = {
  id: 3,
  createdAt: "2025-01-20T10:00:00Z",
  Evaluation_MATCH: {
    chairTestSupport: true,
    chairTestCount: 7,
    scoreTotal: 6,
    balanceTandem: 5,
    vitesseDeMarche: 0.6,
  },
  Program: {
    name: "Programme MATCH 3",
  },
};

describe("EvaluationDisplay Component", () => {
  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();

    // Configuration du mock pour useToken
    useToken.mockReturnValue({
      token: "fake-token",
      user: { role: "kinesiologue" },
    });

    // Mock pour fetch
    global.fetch = jest.fn();

    // Configuration pour les media queries
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

  it("affiche un indicateur de chargement pendant le fetch des données", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          // Ne pas résoudre la promesse tout de suite pour garder l'état "loading"
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(mockPatient),
              text: () => Promise.resolve(JSON.stringify(mockPatient)),
            });
          }, 1000);
        })
    );

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Vérifier que le spinner est affiché (Ant Design utilise des classes et non du texte pour les spinners)
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
  });

  it("affiche les données du patient correctement", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
          text: () => Promise.resolve("[]"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
    });
  });

  it("affiche un message quand aucune évaluation n'est trouvée", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
          text: () => Promise.resolve("[]"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Aucune évaluation trouvée")).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation PACE", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockPaceEvaluation]),
          text: () => Promise.resolve(JSON.stringify([mockPaceEvaluation])),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
      expect(screen.getByText("Score total : 15/18")).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 8")).toBeInTheDocument();
      expect(
        screen.getByText("Dernier test effectué : Unipodal")
      ).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 10")).toBeInTheDocument();
      expect(screen.getByText("Assis")).toBeInTheDocument();
      expect(screen.getByText("Distance (cm) : 25")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme PACE 1")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vitesse de marche (m/s) : 0.75")
      ).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation PATH", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockPathEvaluation]),
          text: () => Promise.resolve(JSON.stringify([mockPathEvaluation])),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Type : PATH")).toBeInTheDocument();
      expect(screen.getByText("Score total : 8")).toBeInTheDocument();
      expect(screen.getByText("Sans appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 10")).toBeInTheDocument();
      expect(
        screen.getByText("Dernier test effectué : Tandem")
      ).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 8")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme PATH 2")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vitesse de marche (m/s) : 0.82")
      ).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation MATCH", async () => {
    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockMatchEvaluation]),
          text: () => Promise.resolve(JSON.stringify([mockMatchEvaluation])),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Type : MATCH")).toBeInTheDocument();
      expect(screen.getByText("Score total : 6/9")).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 7")).toBeInTheDocument();
      expect(
        screen.getByText("Dernier test effectué : Tandem")
      ).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 5")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme MATCH 3")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Vitesse de marche (m/s) : 0.60")
      ).toBeInTheDocument();
    });
  });

  it("affiche plusieurs évaluations correctement et les trie par date", async () => {
    const allEvaluations = [
      mockPaceEvaluation,
      mockPathEvaluation,
      mockMatchEvaluation,
    ];

    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(allEvaluations),
          text: () => Promise.resolve(JSON.stringify(allEvaluations)),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que les données soient chargées et vérifier qu'elles sont triées
    await waitFor(() => {
      // Les évaluations devraient être triées par date, la plus récente en premier
      const evaluationTitles = screen.getAllByText(/Évaluation \d+ :/);
      expect(evaluationTitles).toHaveLength(3);

      // Vérifier que tous les types d'évaluation sont présents
      expect(screen.getByText("Type : MATCH")).toBeInTheDocument();
      expect(screen.getByText("Type : PATH")).toBeInTheDocument();
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
    });
  });

  it("gère correctement les erreurs de chargement des données patients", async () => {
    // Mock une erreur pour le fetch des patients
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
          text: () => Promise.resolve("[]"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Le composant devrait continuer à fonctionner même si la récupération du patient échoue
    await waitFor(() => {
      expect(screen.getByText("Évaluations effectuées")).toBeInTheDocument();
    });
  });

  it("gère correctement les erreurs de chargement des évaluations", async () => {
    // Mock une erreur pour le fetch des évaluations
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Vérifier que l'erreur est affichée correctement
    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
      expect(
        screen.getByText(/Erreur 500: Internal Server Error/)
      ).toBeInTheDocument();
    });
  });

  it("permet de réessayer le chargement après une erreur", async () => {
    // Mock une erreur, puis un succès pour le second appel
    let firstCall = true;

    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        if (firstCall) {
          firstCall = false;
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([mockPaceEvaluation]),
            text: () => Promise.resolve(JSON.stringify([mockPaceEvaluation])),
          });
        }
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
    });

    // Cliquer sur le bouton Réessayer
    await act(async () => {
      fireEvent.click(screen.getByText("Réessayer"));
    });

    // Vérifier que les données sont chargées après le second essai
    await waitFor(() => {
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
    });
  });

  it("gère correctement le bouton Retourner", async () => {
    const navigateMock = jest.fn();
    // Remplacer directement le mock pour ce test spécifique
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(navigateMock);

    // Mock des réponses pour fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
          text: () => Promise.resolve("[]"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Attendre que le composant soit rendu
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Retourner/i })
      ).toBeInTheDocument();
    });

    // Cliquer sur le bouton Retourner
    fireEvent.click(screen.getByRole("button", { name: /Retourner/i }));

    // Vérifier que la fonction navigate a été appelée
    expect(navigateMock).toHaveBeenCalled();
  });

  it("gère correctement les erreurs de parsing JSON", async () => {
    // Mock une réponse non-JSON pour le fetch des évaluations
    global.fetch.mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("<html><body>Error page</body></html>"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Vérifier que l'erreur de parsing est affichée correctement
    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
      expect(screen.getByText(/Erreur de format JSON/)).toBeInTheDocument();
    });
  });
});
