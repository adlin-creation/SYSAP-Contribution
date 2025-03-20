import { exportMatchPdf } from './ExportEvaluationPdf';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

// Mock les dépendances externes
jest.mock('axios');
jest.mock('pdf-lib');

// Mock directement le module Constants
jest.mock('../Utils/Constants', () => ({
  __esModule: true,
  default: {
    SERVER_URL: 'http://localhost:80'
  }
}), { virtual: true });

describe('exportMatchPdf', () => {
  let mockFirstPage;
  let originalConsoleError;
  let originalAlert;
  let mockPdfDoc;
  let originalFetch;
  let originalCreateElement;
  let originalAppendChild;
  let originalRemoveChild;
  let originalURL;

  beforeEach(() => {
    // Sauvegarder les fonctions originales
    originalConsoleError = console.error;
    originalAlert = window.alert;
    originalFetch = global.fetch;
    originalCreateElement = document.createElement;
    originalAppendChild = document.body.appendChild;
    originalRemoveChild = document.body.removeChild;
    originalURL = global.URL;

    // Mock console.error pour éviter la pollution de la console
    console.error = jest.fn();
    window.alert = jest.fn();

    // Mock pour fetch
    global.fetch = jest.fn().mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
    });

    // Mock pour DOM
    document.createElement = jest.fn().mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    });
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    // Mock pour URL
    global.URL = {
      createObjectURL: jest.fn().mockReturnValue('mock-url'),
      revokeObjectURL: jest.fn()
    };

    // Mock pour PDFDocument
    mockFirstPage = {
      drawText: jest.fn(),
      drawLine: jest.fn(),
      drawCircle: jest.fn()
    };

    mockPdfDoc = {
      getPages: jest.fn().mockReturnValue([mockFirstPage]),
      save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    };

    PDFDocument.load = jest.fn().mockResolvedValue(mockPdfDoc);

    // Mock pour axios
    axios.get.mockResolvedValue({
      data: {
        firstname: 'John',
        lastname: 'Doe',
        birthday: '1980-01-01',
        weight: 75,
        weightUnit: 'kg'
      }
    });
  });

  afterEach(() => {
    // Restaurer les fonctions originales
    console.error = originalConsoleError;
    window.alert = originalAlert;
    global.fetch = originalFetch;
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
    global.URL = originalURL;

    jest.clearAllMocks();
  });

  // Test simplifié pour vérifier la gestion de base
  it('should handle basic PDF generation flow', async () => {
    const mockEvaluationData = {
      date: '2023-01-01',
      idPatient: '123',
      chairTestCount: 10,
      chairTestSupport: 'with',
      balanceFeetTogether: 30,
      balanceSemiTandem: 25,
      balanceTandem: 15,
      walkingTime: 5,
      scores: {
        cardioMusculaire: 3,
        equilibre: 2,
        total: 5,
        program: 'VERT'
      }
    };

    const mockToken = 'test-token';

    await exportMatchPdf(mockEvaluationData, mockToken);

    // Vérifications de base
    expect(fetch).toHaveBeenCalled();
    expect(PDFDocument.load).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(mockPdfDoc.getPages).toHaveBeenCalled();
    expect(mockPdfDoc.save).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalled();
  });

  // Tests complets pour toutes les valeurs de cardioMusculaire
  it('should handle each cardioMusculaire score correctly', async () => {
    // CASES 0, 1, 2 (lignes 154-170)
    const cardioScores = [0, 1, 2, 3, 4, 5];
    
    for (const score of cardioScores) {
      jest.clearAllMocks();
      
      const mockData = {
        date: '2023-01-01',
        idPatient: '123',
        chairTestCount: 10,
        chairTestSupport: 'with',
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: { 
          cardioMusculaire: score, 
          equilibre: 2, 
          total: 5, 
          program: 'VERT' 
        }
      };
      
      await exportMatchPdf(mockData, 'token');
      
      // Vérification spécifique pour chaque score
      expect(mockFirstPage.drawCircle).toHaveBeenCalled();
    }
    
    // Test spécifique pour score=3 et chairTestSupport='without' (pour couvrir la branche else if)
    jest.clearAllMocks();
    
    const mockDataWithout = {
      date: '2023-01-01',
      idPatient: '123',
      chairTestCount: 10,
      chairTestSupport: 'without',
      balanceFeetTogether: 30,
      balanceSemiTandem: 25,
      balanceTandem: 15,
      walkingTime: 5,
      scores: { 
        cardioMusculaire: 3, 
        equilibre: 2, 
        total: 5, 
        program: 'VERT' 
      }
    };
    
    await exportMatchPdf(mockDataWithout, 'token');
    expect(mockFirstPage.drawCircle).toHaveBeenCalled();
  });

  // Tests pour toutes les valeurs de equilibre (lignes 181-197)
  it('should handle each equilibre score correctly', async () => {
    const equilibreScores = [0, 1, 2, 3, 4]; // Tous les cas possibles
    
    for (const score of equilibreScores) {
      jest.clearAllMocks();
      
      const mockData = {
        date: '2023-01-01',
        idPatient: '123',
        chairTestCount: 10,
        chairTestSupport: 'with',
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: { 
          cardioMusculaire: 2, 
          equilibre: score, 
          total: 5, 
          program: 'VERT' 
        }
      };
      
      await exportMatchPdf(mockData, 'token');
      
      // Vérification que drawCircle a été appelé pour chaque score d'équilibre
      expect(mockFirstPage.drawCircle).toHaveBeenCalled();
    }
  });

  // Tests pour tous les programmes (lignes 210-217, 222-225)
  it('should handle each program type correctly', async () => {
    const programs = ['ROUGE', 'JAUNE', 'ORANGE', 'VERT', 'BLEU', 'NON_EXISTANT'];
    
    for (const program of programs) {
      jest.clearAllMocks();
      
      const mockData = {
        date: '2023-01-01',
        idPatient: '123',
        chairTestCount: 10,
        chairTestSupport: 'with',
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: 5,
        scores: { 
          cardioMusculaire: 2, 
          equilibre: 2, 
          total: 5, 
          program: program 
        }
      };
      
      await exportMatchPdf(mockData, 'token');
      
      // Pour les programmes reconnus, drawText devrait être appelé
      // Pour NON_EXISTANT, la clause default devrait être exécutée
      if (program !== 'NON_EXISTANT') {
        expect(mockFirstPage.drawText).toHaveBeenCalled();
      }
    }
  });

  // Tests pour différentes vitesses de marche (lignes 239, 246, 253)
  it('should handle different walking speeds correctly', async () => {
    // Tester toutes les tranches de vitesse: < 0.4, 0.4-0.6, 0.6-0.8, >= 0.8
    const walkingTimes = [11, 8, 6, 4];  // 4/11 < 0.4, 4/8 = 0.5, 4/6 ≈ 0.67, 4/4 = 1.0
    
    for (const walkingTime of walkingTimes) {
      jest.clearAllMocks();
      
      const mockData = {
        date: '2023-01-01',
        idPatient: '123',
        chairTestCount: 10,
        chairTestSupport: 'with',
        balanceFeetTogether: 30,
        balanceSemiTandem: 25,
        balanceTandem: 15,
        walkingTime: walkingTime,
        scores: { 
          cardioMusculaire: 2, 
          equilibre: 2, 
          total: 5, 
          program: 'VERT' 
        }
      };
      
      await exportMatchPdf(mockData, 'token');
      
      // Chaque vitesse devrait déclencher un appel à drawLine
      expect(mockFirstPage.drawLine).toHaveBeenCalled();
    }
  });

  // Test pour NaN walkingTime
  it('should handle NaN walkingTime correctly', async () => {
    const mockData = {
      date: '2023-01-01',
      idPatient: '123',
      chairTestCount: 10,
      chairTestSupport: 'with',
      balanceFeetTogether: 30,
      balanceSemiTandem: 25,
      balanceTandem: 15,
      walkingTime: NaN,
      scores: { 
        cardioMusculaire: 3, 
        equilibre: 2, 
        total: 5, 
        program: 'VERT' 
      }
    };
    
    await exportMatchPdf(mockData, 'token');
    
    // Pour NaN, un '+'  est dessiné à des coordonnées spécifiques
    expect(mockFirstPage.drawText).toHaveBeenCalled();
  });

  // Tests d'erreur
  it('should handle fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    const mockEvaluationData = {
      date: '2023-01-01',
      idPatient: '123',
      scores: {}
    };

    await exportMatchPdf(mockEvaluationData, 'token');
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    axios.get.mockRejectedValue(new Error('API error'));
    
    const mockData = {
      date: '2023-01-01',
      idPatient: '123',
      scores: { program: 'VERT' }
    };
    
    await exportMatchPdf(mockData, 'token');
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should handle PDF document save error', async () => {
    // Mock une erreur lors de l'enregistrement du PDF
    mockPdfDoc.save = jest.fn().mockRejectedValue(new Error('Save error'));
    
    const mockData = {
      date: '2023-01-01',
      idPatient: '123',
      chairTestCount: 10,
      chairTestSupport: 'with',
      balanceFeetTogether: 30,
      balanceSemiTandem: 25,
      balanceTandem: 15,
      walkingTime: 5,
      scores: { 
        cardioMusculaire: 2, 
        equilibre: 2, 
        total: 5, 
        program: 'VERT' 
      }
    };
    
    await exportMatchPdf(mockData, 'token');
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });
});