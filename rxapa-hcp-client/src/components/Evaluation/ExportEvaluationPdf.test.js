import {
  exportMatchPdf,
  exportPathPdf,
  exportPacePdf,
} from "./ExportEvaluationPdf";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { Modal } from "antd";

// Mock les dépendances externes
jest.mock("axios");
jest.mock("pdf-lib");
jest.mock("antd", () => ({
  Modal: {
    error: jest.fn(),
  },
}));

// Mock directement le module Constants
jest.mock(
  "../Utils/Constants",
  () => ({
    __esModule: true,
    default: {
      SERVER_URL: "http://localhost:80",
    },
  }),
  { virtual: true }
);

describe("ExportEvaluationPdf", () => {
  let mockFirstPage;
  let mockPdfDoc;
  let originalConsoleError;
  let originalFetch;
  let originalCreateElement;
  let originalAppendChild;
  let originalRemoveChild;
  let originalURL;

  beforeEach(() => {
    // Sauvegarder les fonctions originales
    originalConsoleError = console.error;
    originalFetch = global.fetch;
    originalCreateElement = document.createElement;
    originalAppendChild = document.body.appendChild;
    originalRemoveChild = document.body.removeChild;
    originalURL = global.URL;

    // Mock console.error pour éviter la pollution de la console
    console.error = jest.fn();

    // Mock pour fetch
    global.fetch = jest.fn().mockResolvedValue({
      arrayBuffer: jest
        .fn()
        .mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
    });

    // Mock pour DOM
    document.createElement = jest.fn().mockReturnValue({
      href: "",
      download: "",
      click: jest.fn(),
    });
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    // Mock pour URL
    global.URL = {
      createObjectURL: jest.fn().mockReturnValue("mock-url"),
      revokeObjectURL: jest.fn(),
    };

    // Mock pour PDFDocument
    mockFirstPage = {
      drawText: jest.fn(),
      drawLine: jest.fn(),
      drawCircle: jest.fn(),
      drawRectangle: jest.fn(),
    };

    mockPdfDoc = {
      getPages: jest.fn().mockReturnValue([mockFirstPage]),
      save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    };

    PDFDocument.load = jest.fn().mockResolvedValue(mockPdfDoc);

    // Mock pour axios
    axios.get.mockResolvedValue({
      data: {
        firstname: "John",
        lastname: "Doe",
        birthday: "1980-01-01",
        weight: 75,
        weightUnit: "kg",
      },
    });
  });

  afterEach(() => {
    // Restaurer les fonctions originales
    console.error = originalConsoleError;
    global.fetch = originalFetch;
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
    global.URL = originalURL;

    jest.clearAllMocks();
  });

  describe("exportMatchPdf", () => {
    it("should handle basic PDF generation flow", async () => {
      const mockEvaluationData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "VERT",
        },
      };

      const mockToken = "test-token";

      await exportMatchPdf(mockEvaluationData, mockToken);

      // Vérifications de base
      expect(fetch).toHaveBeenCalledWith(
        "/evaluation_pdf/Arbre_decisionnel_MATCH.pdf"
      );
      expect(PDFDocument.load).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:80/patient/123",
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
      expect(mockPdfDoc.getPages).toHaveBeenCalled();
      expect(mockFirstPage.drawText).toHaveBeenCalled();
      expect(mockPdfDoc.save).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalled();
    });

    it("should handle each cardioMusculaire score correctly", async () => {
      const cardioScores = [0, 1, 2, 3, 4, 5];

      for (const score of cardioScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: 5,
          scores: {
            cardioMusculaire: score,
            equilibre: 2,
            total: 5,
            program: "VERT",
          },
        };

        await exportMatchPdf(mockData, "token");

        // Vérification spécifique pour chaque score
        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }

      // Test spécifique pour score=3 et chairTestSupport='without'
      jest.clearAllMocks();

      const mockDataWithout = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "without",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "VERT",
        },
      };

      await exportMatchPdf(mockDataWithout, "token");
      expect(mockFirstPage.drawCircle).toHaveBeenCalled();
    });

    it("should handle each equilibre score correctly", async () => {
      const equilibreScores = [0, 1, 2, 3, 4];

      for (const score of equilibreScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: score,
            total: 5,
            program: "VERT",
          },
        };

        await exportMatchPdf(mockData, "token");

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }
    });
    it("should handle each program type correctly", async () => {
      const programs = [
        "ROUGE",
        "JAUNE",
        "ORANGE",
        "VERT",
        "BLEU",
        "NON_EXISTANT",
      ];

      for (const program of programs) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: 2,
            total: 5,
            program: program,
          },
        };

        await exportMatchPdf(mockData, "token");

        if (program !== "NON_EXISTANT") {
          expect(mockFirstPage.drawText).toHaveBeenCalled();
        }
      }
    });

    it("should handle different walking speeds correctly", async () => {
      const walkingTimes = [11, 8, 6, 4];

      for (const walkingTime of walkingTimes) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: walkingTime,
          scores: {
            cardioMusculaire: 2,
            equilibre: 2,
            total: 5,
            program: "VERT",
          },
        };

        await exportMatchPdf(mockData, "token");

        expect(mockFirstPage.drawLine).toHaveBeenCalled();
      }
    });

    it("should handle NaN walkingTime correctly", async () => {
      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: NaN,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "VERT",
        },
      };

      await exportMatchPdf(mockData, "token");

      expect(mockFirstPage.drawText).toHaveBeenCalled();
    });

    it("should handle fetch error", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const mockEvaluationData = {
        date: "2023-01-01",
        idPatient: "123",
        scores: {},
      };

      await exportMatchPdf(mockEvaluationData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalled();
    });

    it("should handle API error", async () => {
      axios.get.mockRejectedValue(new Error("API error"));

      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        scores: { program: "VERT" },
      };

      await exportMatchPdf(mockData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalled();
    });

    it("should handle PDF document save error", async () => {
      mockPdfDoc.save = jest.fn().mockRejectedValue(new Error("Save error"));

      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 2,
          equilibre: 2,
          total: 5,
          program: "VERT",
        },
      };

      await exportMatchPdf(mockData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalled();
    });
  });

  describe("exportPathPdf", () => {
    it("should handle basic PDF generation flow", async () => {
      const mockEvaluationData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "32",
        },
      };

      const mockToken = "test-token";

      await exportPathPdf(mockEvaluationData, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        "/evaluation_pdf/Arbre_decisionnel_PATH.pdf"
      );
      expect(PDFDocument.load).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:80/patient/123",
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
      expect(mockPdfDoc.getPages).toHaveBeenCalled();
      expect(mockFirstPage.drawText).toHaveBeenCalled();
      expect(mockPdfDoc.save).toHaveBeenCalled();
    });

    it("should handle each cardioMusculaire score for PATH", async () => {
      const cardioScores = [0, 1, 2, 3, 4, 5];

      for (const score of cardioScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: 5,
          scores: {
            cardioMusculaire: score,
            equilibre: 2,
            total: 5,
            program: "32",
          },
        };

        await exportPathPdf(mockData, "token");

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }

      // Test pour score=3 avec chairTestSupport='without'
      jest.clearAllMocks();

      const mockDataWithout = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "without",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "32",
        },
      };

      await exportPathPdf(mockDataWithout, "token");
      expect(mockFirstPage.drawCircle).toHaveBeenCalled();
    });
    it("should handle each equilibre score for PATH", async () => {
      const equilibreScores = [0, 1, 2, 3, 4];

      for (const score of equilibreScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: score,
            total: 5,
            program: "24",
          },
        };

        await exportPathPdf(mockData, "token");

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }
    });

    it("should handle different walking speeds for PATH", async () => {
      const walkingTimes = [11, 8, 6, 4];

      for (const walkingTime of walkingTimes) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          walkingTime: walkingTime,
          scores: {
            cardioMusculaire: 2,
            equilibre: 2,
            total: 5,
            program: "22",
          },
        };

        await exportPathPdf(mockData, "token");

        expect(mockFirstPage.drawLine).toHaveBeenCalled();
      }
    });

    it("should handle NaN walkingTime for PATH", async () => {
      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: NaN,
        scores: {
          cardioMusculaire: 3,
          equilibre: 2,
          total: 5,
          program: "32",
        },
      };

      await exportPathPdf(mockData, "token");

      expect(mockFirstPage.drawText).toHaveBeenCalled();
    });

    it("should handle errors for PATH PDF generation", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        scores: { program: "32" },
      };

      await exportPathPdf(mockData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalled();
    });
  });

  describe("exportPacePdf", () => {
    it("should handle basic PDF generation flow for PACE", async () => {
      const mockEvaluationData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        balanceOneFooted: 10,
        frtSitting: "sitting",
        frtDistance: 35,
        walkingTime: 5,
        scores: {
          cardioMusculaire: 3,
          equilibre: 4,
          mobilite: 3,
          total: 10,
          program: "BLEU IV",
          color: "BLEU",
          level: "IV",
        },
      };

      const mockToken = "test-token";

      await exportPacePdf(mockEvaluationData, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        "/evaluation_pdf/Arbre_decisionnel_PACE.pdf"
      );
      expect(PDFDocument.load).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:80/patient/123",
        {
          headers: { Authorization: "Bearer test-token" },
        }
      );
      expect(mockPdfDoc.getPages).toHaveBeenCalled();
      expect(mockFirstPage.drawText).toHaveBeenCalled();
      expect(mockPdfDoc.save).toHaveBeenCalled();
    });

    it("should handle each cardioMusculaire score for PACE", async () => {
      const cardioScores = [0, 1, 2, 3, 4, 5, 6];

      for (const score of cardioScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: 5,
          scores: {
            cardioMusculaire: score,
            equilibre: 2,
            mobilite: 3,
            total: 10,
            color: "BLEU",
            level: "III",
            program: "BLEU III",
          },
        };

        await exportPacePdf(mockData, "token");

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }
    });

    it("should handle each equilibre score for PACE", async () => {
      const equilibreScores = [0, 1, 2, 3, 4, 5, 6];

      for (const score of equilibreScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: score,
            mobilite: 3,
            total: 10,
            color: "VERT",
            level: "III",
            program: "VERT III",
          },
        };

        await exportPacePdf(mockData, "token");

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }
    });
    it("should handle each mobilite score for PACE", async () => {
      const mobiliteScores = [0, 1, 2, 3, 4, 5, 6];

      for (const score of mobiliteScores) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: 3,
            mobilite: score,
            total: 10,
            color: "ROUGE",
            level: "III",
            program: "ROUGE III",
          },
        };

        await exportPacePdf(mockData, "token");

        // Test score 3 with standing position
        if (score === 3) {
          jest.clearAllMocks();
          const standingData = {
            ...mockData,
            frtSitting: "standing",
            scores: {
              ...mockData.scores,
              mobilite: score,
            },
          };
          await exportPacePdf(standingData, "token");
        }

        // Test score 4 with standing position
        if (score === 4) {
          jest.clearAllMocks();
          const standingData = {
            ...mockData,
            frtSitting: "standing",
            scores: {
              ...mockData.scores,
              mobilite: score,
            },
          };
          await exportPacePdf(standingData, "token");
        }

        expect(mockFirstPage.drawCircle).toHaveBeenCalled();
      }
    });

    it("should handle each color for PACE", async () => {
      const colors = [
        "BLEU",
        "JAUNE",
        "ROUGE",
        "VERT",
        "ORANGE",
        "VIOLET",
        "MARRON",
        "INVALID",
      ];

      for (const color of colors) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: 3,
            mobilite: 3,
            total: 8,
            color: color,
            level: "II",
            program: `${color} II`,
          },
        };

        await exportPacePdf(mockData, "token");

        if (color !== "INVALID") {
          expect(mockFirstPage.drawLine).toHaveBeenCalled();
        }
      }
    });

    it("should handle each level for PACE", async () => {
      const levels = ["I", "II", "III", "IV", "V", "INVALID"];

      for (const level of levels) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: 5,
          scores: {
            cardioMusculaire: 2,
            equilibre: 3,
            mobilite: 3,
            total: 8,
            color: "VERT",
            level: level,
            program: `VERT ${level}`,
          },
        };

        await exportPacePdf(mockData, "token");

        if (level !== "INVALID") {
          expect(mockFirstPage.drawCircle).toHaveBeenCalled();
        }
      }
    });

    it("should handle different walking speeds for PACE", async () => {
      const walkingTimes = [11, 8, 6, 4];

      for (const walkingTime of walkingTimes) {
        jest.clearAllMocks();

        const mockData = {
          date: "2023-01-01",
          idPatient: "123",
          chairTestCount: 10,
          chairTestSupport: "with",
          balanceFeetTogether: 30,
          balanceSemiTandem: 25,
          balanceTandem: 15,
          balanceOneFooted: 10,
          frtSitting: "sitting",
          frtDistance: 35,
          walkingTime: walkingTime,
          scores: {
            cardioMusculaire: 2,
            equilibre: 3,
            mobilite: 3,
            total: 8,
            color: "VERT",
            level: "II",
            program: "VERT II",
          },
        };

        await exportPacePdf(mockData, "token");

        expect(mockFirstPage.drawLine).toHaveBeenCalled();
      }
    });

    it("should handle NaN walkingTime for PACE", async () => {
      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        chairTestCount: 10,
        chairTestSupport: "with",
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        balanceOneFooted: 10,
        frtSitting: "sitting",
        frtDistance: 35,
        walkingTime: NaN,
        scores: {
          cardioMusculaire: 2,
          equilibre: 3,
          mobilite: 3,
          total: 8,
          color: "VERT",
          level: "II",
          program: "VERT II",
        },
      };

      await exportPacePdf(mockData, "token");

      expect(mockFirstPage.drawText).toHaveBeenCalled();
    });

    it("should handle errors for PACE PDF generation", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        scores: {
          cardioMusculaire: 2,
          equilibre: 3,
          mobilite: 3,
          color: "VERT",
          level: "II",
          program: "VERT II",
        },
      };

      await exportPacePdf(mockData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalled();
    });
  });

  describe("handleError function", () => {
    it("should handle authentication error correctly", async () => {
      const axiosError = new Error("API error");
      axiosError.isAxiosError = true;
      axiosError.response = { status: 500 };

      axios.get.mockRejectedValue(axiosError);

      const mockData = {
        date: "2023-01-01",
        idPatient: "123",
        scores: { program: "VERT" },
      };

      await exportMatchPdf(mockData, "token");

      expect(console.error).toHaveBeenCalled();
      expect(Modal.error).toHaveBeenCalledWith({
        title: "Erreur",
        content: "Échec d'authentification. Veuillez vous reconnecter.",
      });
    });
  });
});
