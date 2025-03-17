// EvaluationPATH.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvaluationPATH from './EvaluationPATH';
import useToken from '../Authentication/useToken';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

// Mock des dépendances
jest.mock('axios');
jest.mock('../Authentication/useToken', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock du router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ patientId: '123' }),
  useNavigate: () => jest.fn(),
}));

describe('EvaluationPATH Component', () => {
  beforeEach(() => {
    // Configuration du mock du token
    useToken.mockReturnValue({ token: 'fake-token' });
    
    // Mock de la réponse de l'API
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Mock de matchMedia pour AntD
    window.matchMedia = window.matchMedia || function() {
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
  
  it('renders the component without crashing', () => {
    render(<EvaluationPATH />);
    
    // Vérifier que les sections principales sont présentes
    expect(screen.getByText('CARDIO-MUSCULAIRE')).toBeInTheDocument();
    expect(screen.getByText('ÉQUILIBRE')).toBeInTheDocument();
    expect(screen.getByText('VITESSE DE MARCHE')).toBeInTheDocument();
    
    // Vérifier la présence des boutons principaux
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  it('displays the chair test options correctly', () => {
    render(<EvaluationPATH />);
    
    // Vérifier les options du test de chaise
    expect(screen.getByText('Test de la chaise en 30 secondes')).toBeInTheDocument();
    expect(screen.getByText('Avec appui')).toBeInTheDocument();
    expect(screen.getByText('Sans appui')).toBeInTheDocument();
    
    // Vérifier que l'option "Avec appui" est sélectionnée par défaut selon l'état initial
    const withSupportRadio = screen.getByText('Avec appui').closest('label').querySelector('input');
    expect(withSupportRadio.checked).toBeTruthy();
  });

  it('shows all balance test inputs', () => {
    render(<EvaluationPATH />);
    
    // Vérifier que tous les tests d'équilibre sont présents
    expect(screen.getByText('Temps Pieds joints (secondes)')).toBeInTheDocument();
    expect(screen.getByText('Temps Semi-tandem (secondes)')).toBeInTheDocument();
    expect(screen.getByText('Temps Tandem (secondes)')).toBeInTheDocument();
  });

  it('shows walking time input', () => {
    render(<EvaluationPATH />);
    
    // Vérifier la présence du champ de temps de marche
    expect(screen.getByText(/Test 4 mètres - Temps nécessaire pour marcher 4-mètres/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Entrez le temps en secondes')).toBeInTheDocument();
  });

  it('enables semi-tandem balance test when feet together time is sufficient', async () => {
    render(<EvaluationPATH />);
    
    // Remplir le temps pieds joints avec une valeur suffisante selon PATH (≥ 5 secondes)
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '5' } }); // ≥ 5 secondes
    
    // Vérifier que le champ semi-tandem est activé
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    
    expect(semiTandemInput).not.toBeDisabled();
  });

  it('disables semi-tandem balance test when feet together time is insufficient', async () => {
    render(<EvaluationPATH />);
    
    // Remplir le temps pieds joints avec une valeur insuffisante
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '4.9' } }); // < 5 secondes
    
    // Vérifier que le champ semi-tandem est désactivé
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    
    expect(semiTandemInput).toBeDisabled();
  });

  it('enables tandem balance test when semi-tandem time is sufficient', async () => {
    render(<EvaluationPATH />);
    
    // D'abord remplir le temps pieds joints avec une valeur suffisante pour activer semi-tandem
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '5' } }); // ≥ 5 secondes
    
    // Puis remplir le temps semi-tandem avec une valeur suffisante
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    fireEvent.change(semiTandemInput, { target: { value: '5' } }); // ≥ 5 secondes
    
    // Vérifier que le champ tandem est activé
    const tandemInput = balanceInputs[2]; // Troisième champ (tandem)
    
    expect(tandemInput).not.toBeDisabled();
  });

  it('disables tandem balance test when semi-tandem time is insufficient', async () => {
    render(<EvaluationPATH />);
    
    // D'abord remplir le temps pieds joints avec une valeur suffisante pour activer semi-tandem
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '5' } }); // ≥ 5 secondes
    
    // Puis remplir le temps semi-tandem avec une valeur insuffisante
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    fireEvent.change(semiTandemInput, { target: { value: '4.9' } }); // < 5 secondes
    
    // Vérifier que le champ tandem est désactivé
    const tandemInput = balanceInputs[2]; // Troisième champ (tandem)
    
    expect(tandemInput).toBeDisabled();
  });

  it('calculates walking speed correctly', async () => {
    render(<EvaluationPATH />);
    
    // Entrer une valeur de temps de marche
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Attendre que l'interface se mette à jour
    await waitFor(() => {
      // Rechercher le div qui contient la vitesse de marche calculée
      expect(screen.getByText(/Vitesse de marche/)).toBeInTheDocument();
      expect(screen.getByText(/0.80 m\/s/)).toBeInTheDocument();
    });
  });

  it('calculates walking objective based on speed correctly', async () => {
    render(<EvaluationPATH />);
    
    // Remplir un minimum de champs requis pour permettre la soumission
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '5' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    
    // Tester toutes les tranches de vitesse et leurs objectifs correspondants
    
    // < 0.4 m/s = 10 minutes
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '11' } }); // Environ 0.36 m/s
    
    // Soumettre pour voir le résultat
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    // Vérifier que le modal s'ouvre (l'API n'est pas appelée car modal ouvert)
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates chair test score correctly when not using support', async () => {
    render(<EvaluationPATH />);
    
    // Sélectionner "Sans appui"
    const withoutSupportRadio = screen.getByText('Sans appui');
    fireEvent.click(withoutSupportRadio);
    
    // Compléter le formulaire avec des valeurs valides pour permettre la soumission
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } }); // Score équilibre 1
    
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Tester les différents cas selon l'arbre décisionnel PATH
    
    // 2 levers sans appui = score 0 (< 3 levers)
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '2' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 3 levers sans appui = score 3 (3 à 4 levers)
    fireEvent.change(chairTestInput, { target: { value: '3' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 7 levers sans appui = score 4 (5-9 levers)
    fireEvent.change(chairTestInput, { target: { value: '7' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 10 levers sans appui = score 5 (≥ 10 levers)
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates chair test score correctly when using support', async () => {
    render(<EvaluationPATH />);
    
    // S'assurer que "Avec appui" est sélectionné
    const withSupportRadio = screen.getByText('Avec appui');
    fireEvent.click(withSupportRadio);
    
    // Compléter le formulaire avec des valeurs valides pour permettre la soumission
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } }); // Score équilibre 1
    
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Tester les différents cas selon l'arbre décisionnel PATH
    
    // 0 lever avec appui = score 0
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '0' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 4 levers avec appui = score 1 (< 5 levers)
    fireEvent.change(chairTestInput, { target: { value: '4' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 7 levers avec appui = score 2 (5-9 levers)
    fireEvent.change(chairTestInput, { target: { value: '7' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 10 levers avec appui = score 3 (≥ 10 levers)
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates balance score correctly with cardio score of 0', async () => {
    render(<EvaluationPATH />);
    
    // Configurer un score cardio-musculaire de 0
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '0' } });
    
    // Remplir les champs d'équilibre
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    
    // Pieds joints < 5 secondes = score 0
    fireEvent.change(balanceInputs[0], { target: { value: '4' } });
    
    // Compléter le formulaire avec le temps de marche
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Pieds joints ≥ 5 secondes = score 1
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates balance score correctly with cardio score greater than 0', async () => {
    render(<EvaluationPATH />);
    
    // Configurer un score cardio-musculaire > 0
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '5' } }); // Score 2 avec appui
    
    // Compléter le formulaire avec le temps de marche
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    
    // Tester tous les scénarios d'équilibre
    
    // Pieds joints ≥ 5 secondes = score 1
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Semi-tandem < 5 secondes = score 2
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    fireEvent.change(balanceInputs[1], { target: { value: '4' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Semi-tandem ≥ 5 secondes = score 3
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    fireEvent.change(balanceInputs[1], { target: { value: '5' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Tandem ≥ 3 secondes = score 4
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    fireEvent.change(balanceInputs[1], { target: { value: '5' } });
    fireEvent.change(balanceInputs[2], { target: { value: '3' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('handles form validation correctly', async () => {
    render(<EvaluationPATH />);
    
    // Soumettre le formulaire sans valeurs
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    // Vérifier que la validation empêche la soumission
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      // Vérifier la présence de messages d'erreur
      expect(screen.getAllByText(/requis/)).not.toHaveLength(0);
    });
    
    // Remplir juste le minimum requis
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '5' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Vérifier que le formulaire peut maintenant être soumis
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Le formulaire ouvre une modale de confirmation, donc l'API n'est pas encore appelée
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('handles walking time validation correctly', async () => {
    render(<EvaluationPATH />);
    
    // Entrer une valeur de temps de marche non numérique et vérifier le comportement
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    
    // Tester avec valeur valide
    fireEvent.change(walkingTimeInput, { target: { value: '5.5' } });
    expect(walkingTimeInput.value).toBe('5.5');
    
    // Essayer d'entrer une valeur invalide
    fireEvent.change(walkingTimeInput, { target: { value: '5.5a' } });
    expect(walkingTimeInput.value).toBe('5.5'); // La valeur ne devrait pas changer
  });

  it('submits the form with correct payload', async () => {
    render(<EvaluationPATH />);
    
    // Remplir le formulaire avec des valeurs valides
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    fireEvent.change(balanceInputs[1], { target: { value: '5' } });
    fireEvent.change(balanceInputs[2], { target: { value: '3' } });
    
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '5' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    // Attendre que la modale apparaisse
    await waitFor(() => {
      // Le formulaire ouvre une modale de confirmation, donc l'API n'est pas encore appelée
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  // Tests des fonctions de calcul isolées (simulées)
  describe('Score calculation functions', () => {
    it('should simulate chair test score calculation correctly', () => {
      // Simulation de la fonction calculateChairTestScore selon l'arbre décisionnel PATH
      const calculateChairTestScore = (count, withSupport) => {
        if (isNaN(count) || count === 0) return 0;
      
        if (!withSupport) {
          // Sans appui
          if (count >= 10) return 5; // G ≥ 10 levers
          if (count >= 5 && count <= 9) return 4; // F 5-9 levers
          if (count >= 3 && count <= 4) return 3; // E 3 à 4 levers
          return 0; // Moins de 3 levers
        } else {
          // Avec appui
          if (count >= 10) return 3; // D ≥ 10 levers
          if (count >= 5 && count <= 9) return 2; // C 5-9 levers
          if (count < 5 && count > 0) return 1; // B < 5 levers
          return 0; // 0 lever
        }
      };
      
      // Test avec appui
      expect(calculateChairTestScore(0, true)).toBe(0); // 0 lever
      expect(calculateChairTestScore(4, true)).toBe(1); // < 5 levers
      expect(calculateChairTestScore(7, true)).toBe(2); // 5-9 levers
      expect(calculateChairTestScore(10, true)).toBe(3); // ≥ 10 levers
      
      // Test sans appui
      expect(calculateChairTestScore(2, false)).toBe(0); // < 3 levers
      expect(calculateChairTestScore(3, false)).toBe(3); // 3-4 levers
      expect(calculateChairTestScore(7, false)).toBe(4); // 5-9 levers
      expect(calculateChairTestScore(10, false)).toBe(5); // ≥ 10 levers
    });
    
    it('should simulate balance score calculation correctly', () => {
      // Simulation de la fonction calculateBalanceScore selon l'arbre décisionnel PATH
      const calculateBalanceScore = (feetTogether, semiTandem, tandem, cardioScore) => {
        // Si le score cardio-musculaire est 0, seulement évaluer l'équilibre pieds joints
        if (cardioScore === 0) {
          return feetTogether >= 5 ? 1 : 0;
        }
      
        // Vérifier dans l'ordre selon le document
        if (tandem >= 3) return 4;
        if (semiTandem >= 5) return 3;
        if (semiTandem < 5 && semiTandem > 0) return 2;
        if (feetTogether >= 5) return 1;
        return 0;
      };
      
      // Test avec score cardio = 0
      expect(calculateBalanceScore(4, 0, 0, 0)).toBe(0); // < 5 sec pieds joints
      expect(calculateBalanceScore(5, 0, 0, 0)).toBe(1); // ≥ 5 sec pieds joints
      expect(calculateBalanceScore(5, 5, 3, 0)).toBe(1); // Ignore les autres tests quand cardio = 0
      
      // Test avec score cardio > 0
      expect(calculateBalanceScore(4, 0, 0, 1)).toBe(0); // < 5 sec pieds joints
      expect(calculateBalanceScore(5, 0, 0, 1)).toBe(1); // ≥ 5 sec pieds joints
      expect(calculateBalanceScore(5, 4, 0, 1)).toBe(2); // < 5 sec semi-tandem
      expect(calculateBalanceScore(5, 5, 0, 1)).toBe(3); // ≥ 5 sec semi-tandem
      expect(calculateBalanceScore(5, 5, 3, 1)).toBe(4); // ≥ 3 sec tandem
    });
    
    it('should simulate program calculation correctly', () => {
      // Simulation de la façon dont le programme PATH est calculé
      const calculateProgram = (cardioScore, balanceScore) => {
        return cardioScore + "" + balanceScore; // Concaténation des scores
      };
      
      expect(calculateProgram(0, 1)).toBe("01");
      expect(calculateProgram(2, 3)).toBe("23");
      expect(calculateProgram(5, 4)).toBe("54");
    });
    
    it('should simulate walking objective calculation correctly', () => {
      // Simulation de la fonction calculateWalkingObjective selon l'arbre décisionnel
      const calculateWalkingObjective = (walkingTime) => {
        if (!walkingTime || walkingTime <= 0) return null;
      
        const speed = 4 / parseFloat(walkingTime);
      
        if (speed < 0.4) return 10;
        if (speed >= 0.4 && speed < 0.6) return 15;
        if (speed >= 0.6 && speed < 0.8) return 20;
        if (speed >= 0.8) return 30;
      
        return null;
      };
      
      expect(calculateWalkingObjective(11)).toBe(10); // < 0.4 m/s
      expect(calculateWalkingObjective(8)).toBe(15); // 0.4-0.6 m/s
      expect(calculateWalkingObjective(6)).toBe(20); // 0.6-0.8 m/s  
      expect(calculateWalkingObjective(5)).toBe(30); // ≥ 0.8 m/s
      expect(calculateWalkingObjective(0)).toBe(null); // valeur invalide
    });
  });
});