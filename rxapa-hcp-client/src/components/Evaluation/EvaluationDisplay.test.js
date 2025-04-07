/**
 * @file EvaluationDisplay.test.js
 * 
 */

// 1) On moque d'abord le module d'export de PDF, avant de l'importer,
//    afin que exportPacePdf, exportPathPdf, exportMatchPdf soient bien des mocks Jest.
jest.mock("./ExportEvaluationPdf", () => ({
  __esModule: true,
  exportMatchPdf: jest.fn(),
  exportPacePdf: jest.fn(),
  exportPathPdf: jest.fn(),
}));

import * as ExportEvaluationPdf from "./ExportEvaluationPdf";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// On moque React.act pour éviter certains avertissements
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    act: (callback) => callback(),
  };
});

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvaluationDisplay from "./EvaluationDisplay";
import useToken from "../Authentication/useToken";
import { useNavigate, useParams } from "react-router-dom";

// On moque useToken
jest.mock("../Authentication/useToken", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// On moque react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// On moque Constants
jest.mock("../Utils/Constants", () => ({
  SERVER_URL: "http://localhost:3000/api",
}));


const mockPatient = {
  id: 123,
  firstname: "Jean",
  lastname: "Dupont",
};

const mockPaceEvaluation = {
  id: 1,
  createdAt: "2025-01-10T10:00:00Z", // date au niveau supérieur
  Evaluation_PACE: {
    createdAt: "2025-01-10T10:00:00Z", // date dans le sous-objet
    chairTestSupport: true,
    chairTestCount: 8,
    scoreTotal: 15,
    BalanceFeetTogether: 10,
    balanceSemiTandem: 10,
    balanceTandem: 10,
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
    createdAt: "2025-01-15T10:00:00Z",
    chairTestSupport: false,
    chairTestCount: 10,
    scoreTotal: 8,
    BalanceFeetTogether: 8,
    balanceSemiTandem: 8,
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
    createdAt: "2025-01-20T10:00:00Z",
    chairTestSupport: true,
    chairTestCount: 7,
    scoreTotal: 6,
    BalanceFeetTogether: 5,
    balanceSemiTandem: 5,
    balanceTandem: 5,
    vitesseDeMarche: 0.6,
  },
  Program: {
    name: "Programme MATCH 3",
  },
};

describe("EvaluationDisplay Component", () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();

    // On simule le token
    useToken.mockReturnValue({
      token: "fake-token",
      user: { role: "kinesiologue" },
    });

    // On simule useNavigate
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    // On simule useParams
    useParams.mockReturnValue({ patientId: "123" });

    // Valeur par défaut de matchMedia
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
    // On simule un fetch qui prend du temps
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
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

    // Vérifier le spinner
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
  });

  it("affiche les données du patient correctement", async () => {
    // On simule un fetch renvoyant un patient et pas d'évaluations
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Vérifier que le nom du patient s'affiche
    await waitFor(() => {
      expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
    });
  });

  it("affiche un message quand aucune évaluation n'est trouvée", async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Vérifier le message "Aucune évaluation trouvée"
    await waitFor(() => {
      expect(screen.getByText("Aucune évaluation trouvée")).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation PACE (test du dépliement)", async () => {
    // On simule un fetch renvoyant une évaluation PACE
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Attendre les infos de base
    await waitFor(() => {
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
    });

    // Rechercher le bouton de bascule ayant le nom "plus"
    const toggleButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(toggleButton);

    // Vérifier les infos détaillées
    await waitFor(() => {
      expect(screen.getByText("Score total : 15/18")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme PACE 1")
      ).toBeInTheDocument();
      expect(screen.getByText("Vitesse de marche (m/s) : 0.75")).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 8")).toBeInTheDocument();
      expect(screen.getByText("Dernier test effectué : Unipodal")).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 10")).toBeInTheDocument();
      expect(screen.getByText("Mobilité :")).toBeInTheDocument();
      expect(screen.getByText("Assis")).toBeInTheDocument();
      expect(screen.getByText("Distance (cm) : 25")).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation PATH (test du dépliement)", async () => {
    // On simule un fetch renvoyant une évaluation PATH
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Attendre le texte "Type : PATH"
    await waitFor(() => {
      expect(screen.getByText("Type : PATH")).toBeInTheDocument();
    });

    // Rechercher à nouveau le bouton "plus"
    const toggleButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText("Score total : 8")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme PATH 2")
      ).toBeInTheDocument();
      expect(screen.getByText("Vitesse de marche (m/s) : 0.82")).toBeInTheDocument();
      expect(screen.getByText("Sans appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 10")).toBeInTheDocument();
      expect(screen.getByText("Dernier test effectué : Tandem")).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 8")).toBeInTheDocument();
    });
  });

  it("affiche correctement une évaluation MATCH (test du dépliement)", async () => {
    // On simule un fetch renvoyant une évaluation MATCH
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Attendre le texte "Type : MATCH"
    await waitFor(() => {
      expect(screen.getByText("Type : MATCH")).toBeInTheDocument();
    });

    // Bouton "plus"
    const toggleButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText("Score total : 6/9")).toBeInTheDocument();
      expect(
        screen.getByText("Programme recommandé : Programme MATCH 3")
      ).toBeInTheDocument();
      expect(screen.getByText("Vitesse de marche (m/s) : 0.60")).toBeInTheDocument();
      expect(screen.getByText("Avec appui")).toBeInTheDocument();
      expect(screen.getByText("Nombre de levers : 7")).toBeInTheDocument();
      expect(screen.getByText("Dernier test effectué : Tandem")).toBeInTheDocument();
      expect(screen.getByText("Temps (seconde) : 5")).toBeInTheDocument();
    });
  });

  it("affiche plusieurs évaluations correctement et les trie par date (le plus récent en premier)", async () => {
    const allEvaluations = [
      mockPaceEvaluation,  // date: 2025-01-10
      mockPathEvaluation,  // date: 2025-01-15
      mockMatchEvaluation, // date: 2025-01-20
    ];

    // On simule un fetch renvoyant plusieurs évaluations
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Vérifier l'ordre (MATCH en premier, PATH, et PACE)
    await waitFor(() => {
      const types = screen.getAllByText(/Type : (PACE|PATH|MATCH)/);
      expect(types.length).toBe(3);
      expect(types[0]).toHaveTextContent("MATCH");
      expect(types[1]).toHaveTextContent("PATH");
      expect(types[2]).toHaveTextContent("PACE");
    });
  });

  it("gère correctement les erreurs de chargement du patient (on continue malgré l'erreur)", async () => {
    // On simule une 404 coté patient mais pas d'évaluations trouvées
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Le composant affiche "Évaluations effectuées" et plus tard "Aucune évaluation trouvée"
    await waitFor(() => {
      expect(screen.getByText("Évaluations effectuées")).toBeInTheDocument();
      expect(screen.getByText("Aucune évaluation trouvée")).toBeInTheDocument();
    });
  });

  it("gère correctement les erreurs de chargement des évaluations (erreur 500)", async () => {
    // On simule une erreur 500 côté évaluations
    global.fetch = jest.fn().mockImplementation((url) => {
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

    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
      expect(screen.getByText(/Erreur 500: Internal Server Error/)).toBeInTheDocument();
    });
  });

  it("permet de réessayer le chargement après une erreur", async () => {
    // On simule d'abord une erreur 500, puis un succès
    let firstCall = true;

    global.fetch = jest.fn().mockImplementation((url) => {
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

    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
    });

    // Cliquer sur "Réessayer"
    fireEvent.click(screen.getByText("Réessayer"));

    // Le second appel devrait réussir
    await waitFor(() => {
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
    });
  });

  it("gère correctement le bouton Retourner", async () => {
    // On simule un patient et des évaluations vides
    global.fetch = jest.fn().mockImplementation((url) => {
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

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Retourner/i })).toBeInTheDocument();
    });

    // Cliquer sur "Retourner"
    fireEvent.click(screen.getByRole("button", { name: /Retourner/i }));
    expect(navigateMock).toHaveBeenCalled();
  });

  it("gère correctement les erreurs de parsing JSON", async () => {
    // On simule une réponse HTML au lieu de JSON pour les évaluations
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes("/patients/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPatient),
          text: () => Promise.resolve(JSON.stringify(mockPatient)),
        });
      } else {
        // Réponse invalide pour le JSON
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve("<html><body>Error page</body></html>"),
        });
      }
    });

    await act(async () => {
      render(<EvaluationDisplay />);
    });

    // Vérifier le message d'erreur de format JSON
    await waitFor(() => {
      expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
      expect(screen.getByText(/Erreur de format JSON/)).toBeInTheDocument();
    });
  });

  
  it("appelle exportPacePdf lorsqu'on clique sur le bouton PDF pour une évaluation PACE", async () => {
    // On simule un fetch renvoyant une évaluation PACE
    global.fetch = jest.fn().mockImplementation((url) => {
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

    await waitFor(() => {
      expect(screen.getByText("Type : PACE")).toBeInTheDocument();
    });

    // On clique sur le bouton "Télécharger PDF"
    const pdfButton = screen.getByRole("button", { name: /Télécharger PDF/i });
    fireEvent.click(pdfButton);

    // Vérifier que exportPacePdf a bien été appelé
    await waitFor(() => {
      expect(ExportEvaluationPdf.exportPacePdf).toHaveBeenCalledTimes(1);
   
    });
  });
});
