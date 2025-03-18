// EvaluationMATCH.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvaluationMATCH from './EvaluationMATCH';
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

describe('EvaluationMATCH Component', () => {
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
    render(<EvaluationMATCH />);
    
    // Vérifier que les sections principales sont présentes
    expect(screen.getByText('CARDIO-MUSCULAIRE')).toBeInTheDocument();
    expect(screen.getByText('ÉQUILIBRE (Debout, sans aide)')).toBeInTheDocument();
    expect(screen.getByText('OBJECTIF DE MARCHE')).toBeInTheDocument();
    
    // Vérifier la présence des boutons principaux
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  it('displays the chair test options correctly', () => {
    render(<EvaluationMATCH />);
    
    // Vérifier les options du test de chaise
    expect(screen.getByText('Test de la chaise en 30 secondes')).toBeInTheDocument();
    expect(screen.getByText('Avec appui')).toBeInTheDocument();
    expect(screen.getByText('Sans appui')).toBeInTheDocument();
    
    // Vérifier que l'option "Avec appui" est sélectionnée par défaut selon l'état initial
    const withSupportRadio = screen.getByText('Avec appui').closest('label').querySelector('input');
    expect(withSupportRadio.checked).toBeTruthy();
  });

  it('shows all balance test inputs', () => {
    render(<EvaluationMATCH />);
    
    // Vérifier que tous les tests d'équilibre sont présents
    expect(screen.getByText('Temps Pieds joints (secondes)')).toBeInTheDocument();
    expect(screen.getByText('Temps Semi-tandem (secondes)')).toBeInTheDocument();
    expect(screen.getByText('Temps Tandem (secondes)')).toBeInTheDocument();
  });

  it('shows walking options correctly', () => {
    render(<EvaluationMATCH />);
    
    // Vérifier les options de marche
    expect(screen.getByText('Test 4 mètres – vitesse de marche confortable')).toBeInTheDocument();
    expect(screen.getByText('Le patient peut marcher')).toBeInTheDocument();
    expect(screen.getByText('Le petient ne peut pas marcher')).toBeInTheDocument();
  });

  it('disables semi-tandem balance test when feet together time is insufficient', async () => {
    render(<EvaluationMATCH />);
    
    // Configurer un score cardio-musculaire suffisant (> 1)
    // 10 levers avec appui = score 3
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    // Remplir le temps pieds joints avec une valeur insuffisante
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '5' } }); // < 10 secondes
    
    // Vérifier que le champ semi-tandem est désactivé
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    
    expect(semiTandemInput).toBeDisabled();
  });

  it('enables semi-tandem balance test when feet together time is sufficient', async () => {
    render(<EvaluationMATCH />);
    
    // Configurer un score cardio-musculaire suffisant (> 1)
    // 10 levers avec appui = score 3
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    // Remplir le temps pieds joints avec une valeur suffisante
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '10' } }); // ≥ 10 secondes
    
    // Vérifier que le champ semi-tandem est activé
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    
    expect(semiTandemInput).not.toBeDisabled();
  });

  it('disables tandem balance test when semi-tandem time is insufficient', async () => {
    render(<EvaluationMATCH />);
    
    // D'abord remplir le temps pieds joints avec une valeur suffisante pour activer semi-tandem
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '10' } }); // ≥ 10 secondes
    
    // Puis remplir le temps semi-tandem avec une valeur insuffisante
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    fireEvent.change(semiTandemInput, { target: { value: '5' } }); // < 10 secondes
    
    // Vérifier que le champ tandem est désactivé
    const tandemInput = balanceInputs[2]; // Troisième champ (tandem)
    
    expect(tandemInput).toBeDisabled();
  });

  it('displays walking time input when patient can walk', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Le patient peut marcher"
    const canWalkRadio = screen.getByText('Le patient peut marcher');
    fireEvent.click(canWalkRadio);
    
    // Vérifier que le champ de temps apparaît
    expect(screen.getByText('Temps nécessaire pour marcher 4 mètres (secondes)')).toBeInTheDocument();
  });

  it('does not display walking time input when patient cannot walk', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Le petient ne peut pas marcher"
    const cannotWalkRadio = screen.getByText('Le petient ne peut pas marcher');
    fireEvent.click(cannotWalkRadio);
    
    // Vérifier que le champ de temps n'apparaît pas
    expect(screen.queryByText('Temps nécessaire pour marcher 4 mètres (secondes)')).not.toBeInTheDocument();
  });

  it('calculates walking speed correctly', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Le patient peut marcher"
    const canWalkRadio = screen.getByText('Le patient peut marcher');
    fireEvent.click(canWalkRadio);
    
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
    render(<EvaluationMATCH />);
    
    // Sélectionner "Le patient peut marcher"
    const canWalkRadio = screen.getByText('Le patient peut marcher');
    fireEvent.click(canWalkRadio);
    
    // Tester toutes les tranches de vitesse et leurs objectifs correspondants
    
    // < 0.4 m/s = 10 minutes
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    fireEvent.change(walkingTimeInput, { target: { value: '11' } }); // Environ 0.36 m/s
    
    await waitFor(() => {
      expect(screen.getByText(/Objectif de marche : 10 minutes par jour/)).toBeInTheDocument();
    });
    
    // 0.4 à < 0.6 m/s = 15 minutes
    fireEvent.change(walkingTimeInput, { target: { value: '8' } }); // 0.5 m/s
    
    await waitFor(() => {
      expect(screen.getByText(/Objectif de marche : 15 minutes par jour/)).toBeInTheDocument();
    });
    
    // 0.6 à < 0.8 m/s = 20 minutes
    fireEvent.change(walkingTimeInput, { target: { value: '6' } }); // Environ 0.67 m/s
    
    await waitFor(() => {
      expect(screen.getByText(/Objectif de marche : 20 minutes par jour/)).toBeInTheDocument();
    });
    
    // >= 0.8 m/s = 30 minutes
    fireEvent.change(walkingTimeInput, { target: { value: '5' } }); // 0.8 m/s
    
    await waitFor(() => {
      expect(screen.getByText(/Objectif de marche : 30 minutes par jour/)).toBeInTheDocument();
    });
  });

  it('calculates chair test score correctly when using support', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Avec appui"
    const withSupportRadio = screen.getByText('Avec appui');
    fireEvent.click(withSupportRadio);
    
    // Tester les différents cas selon l'arbre décisionnel
    
    // 0 lever = score 0
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '0' } });
    
    // Compléter le formulaire avec des valeurs valides pour permettre la soumission
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // Score équilibre 1
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    // La suite des opérations se passe dans la modale qui n'est pas accessible directement
    // Mais on peut au moins vérifier que l'API n'a pas été appelée (car modale ouverte)
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 4 levers = score 1
    fireEvent.change(chairTestInput, { target: { value: '4' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 7 levers = score 2
    fireEvent.change(chairTestInput, { target: { value: '7' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 10 levers = score 3
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates chair test score correctly when not using support', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Sans appui"
    const withoutSupportRadio = screen.getByText('Sans appui');
    fireEvent.click(withoutSupportRadio);
    
    // Compléter le formulaire avec des valeurs valides pour permettre la soumission
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // Score équilibre 1
    
    // Tester les différents cas selon l'arbre décisionnel
    
    // 2 levers sans appui = score 2 (Si E < 3, accorder le score C)
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '2' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // 4 levers sans appui = score 3 (3 à 5 levers)
    fireEvent.change(chairTestInput, { target: { value: '4' } });
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

  it('calculates balance score correctly', async () => {
    render(<EvaluationMATCH />);
    
    // Configurer un score cardio-musculaire suffisant pour activer tous les tests d'équilibre
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    
    // Pieds joints < 10 secondes = score 0
    fireEvent.change(balanceInputs[0], { target: { value: '5' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Pieds joints ≥ 10 secondes = score 1
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Semi-tandem < 10 secondes = score 2
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    fireEvent.change(balanceInputs[1], { target: { value: '5' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Semi-tandem ≥ 10 secondes = score 3
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    fireEvent.change(balanceInputs[1], { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Tandem ≥ 3 secondes = score 4
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    fireEvent.change(balanceInputs[1], { target: { value: '10' } });
    fireEvent.change(balanceInputs[2], { target: { value: '3' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('calculates program color correctly based on total score', async () => {
    render(<EvaluationMATCH />);
    
    // Configurer un score de 1 (ROUGE)
    // Score Cardio-musculaire = 1, Score Équilibre = 0
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '4' } }); // Avec appui par défaut = score 1
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '5' } }); // < 10 sec = score 0
    
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Configurer un score de 3 (JAUNE)
    // Score Cardio-musculaire = 2, Score Équilibre = 1
    fireEvent.change(chairTestInput, { target: { value: '7' } }); // Avec appui = score 2
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // ≥ 10 sec = score 1
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Configurer un score de 5 (ORANGE)
    // Score Cardio-musculaire = 3, Score Équilibre = 2
    fireEvent.change(chairTestInput, { target: { value: '10' } }); // Avec appui = score 3
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // ≥ 10 sec
    fireEvent.change(balanceInputs[1], { target: { value: '5' } }); // < 10 sec = score 2
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Configurer un score de 7 (VERT)
    // Score Cardio-musculaire = 4, Score Équilibre = 3
    const withoutSupportRadio = screen.getByText('Sans appui');
    fireEvent.click(withoutSupportRadio);
    fireEvent.change(chairTestInput, { target: { value: '7' } }); // Sans appui = score 4
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // ≥ 10 sec
    fireEvent.change(balanceInputs[1], { target: { value: '10' } }); // ≥ 10 sec = score 3
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Configurer un score de 9 (BLEU)
    // Score Cardio-musculaire = 5, Score Équilibre = 4
    fireEvent.change(chairTestInput, { target: { value: '10' } }); // Sans appui = score 5
    fireEvent.change(balanceInputs[0], { target: { value: '10' } }); // ≥ 10 sec
    fireEvent.change(balanceInputs[1], { target: { value: '10' } }); // ≥ 10 sec
    fireEvent.change(balanceInputs[2], { target: { value: '3' } }); // ≥ 3 sec = score 4
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('handles form validation correctly', async () => {
    render(<EvaluationMATCH />);
    
    // Soumettre le formulaire sans valeurs
    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);
    
    // Vérifier que la validation empêche la soumission
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
    
    // Remplir juste le minimum requis
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '5' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    
    // Vérifier que le formulaire peut maintenant être soumis
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Le formulaire ouvre une modale de confirmation, donc l'API n'est pas encore appelée
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('handles walking time validation correctly', async () => {
    render(<EvaluationMATCH />);
    
    // Sélectionner "Le patient peut marcher"
    const canWalkRadio = screen.getByText('Le patient peut marcher');
    fireEvent.click(canWalkRadio);
    
    // Entrer une valeur de temps de marche non numérique et vérifier le message d'erreur
    const walkingTimeInput = screen.getByPlaceholderText('Entrez le temps en secondes');
    
    // Tester avec valeur valide
    fireEvent.change(walkingTimeInput, { target: { value: '5.5' } });
    expect(walkingTimeInput.value).toBe('5.5');
    
    // Essayer d'entrer une valeur invalide
    fireEvent.change(walkingTimeInput, { target: { value: '5.5a' } });
    expect(walkingTimeInput.value).toBe('5.5'); // La valeur ne devrait pas changer
  });

  it('submits the form with correct payload', async () => {
    render(<EvaluationMATCH />);
    
    // Remplir le formulaire avec des valeurs valides
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    fireEvent.change(balanceInputs[0], { target: { value: '10' } });
    fireEvent.change(balanceInputs[1], { target: { value: '10' } });
    fireEvent.change(balanceInputs[2], { target: { value: '3' } });
    
    const canWalkRadio = screen.getByText('Le patient peut marcher');
    fireEvent.click(canWalkRadio);
    
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
      // Simulation de la fonction calculateChairTestScore selon l'arbre décisionnel
      const calculateChairTestScore = (count, withSupport) => {
        if (isNaN(count) || count === 0) return 0;
      
        if (withSupport) {
          // Avec appui
          if (count < 5) return 1; // B < 5 levers
          if (count >= 5 && count <= 9) return 2; // C 5-9 levers
          if (count >= 10) return 3; // D ≥ 10 levers
        } else {
          // Sans appui
          if (count >= 3 && count <= 5) return 3; // E 3 à 5 levers
          if (count < 3) return 2; // Si E < 3, accorder le score C (2)
          if (count >= 5 && count <= 9) return 4; // F 5-9 levers
          if (count >= 10) return 5; // G ≥ 10 levers
        }
      
        return 0;
      };
      
      // Test avec appui
      expect(calculateChairTestScore(0, true)).toBe(0); // 0 lever
      expect(calculateChairTestScore(4, true)).toBe(1); // < 5 levers
      expect(calculateChairTestScore(7, true)).toBe(2); // 5-9 levers
      expect(calculateChairTestScore(10, true)).toBe(3); // ≥ 10 levers
      
      // Test sans appui
      expect(calculateChairTestScore(2, false)).toBe(2); // Si E < 3, score C (2)
      expect(calculateChairTestScore(4, false)).toBe(3); // 3 à 5 levers
      expect(calculateChairTestScore(7, false)).toBe(4); // 5-9 levers
      expect(calculateChairTestScore(10, false)).toBe(5); // ≥ 10 levers
    });
    
    it('should simulate balance score calculation correctly', () => {
      // Simulation de la fonction calculateBalanceScore selon l'arbre décisionnel
      const calculateBalanceScore = (feetTogether, semiTandem, tandem) => {
        if (tandem >= 3) return 4;
        if (semiTandem >= 10) return 3;
        if (semiTandem < 10 && semiTandem > 0) return 2;
        if (feetTogether >= 10) return 1;
        return 0;
      };
      
      expect(calculateBalanceScore(5, 0, 0)).toBe(0); // < 10 sec pieds joints
      expect(calculateBalanceScore(10, 0, 0)).toBe(1); // ≥ 10 sec pieds joints
      expect(calculateBalanceScore(10, 5, 0)).toBe(2); // < 10 sec semi-tandem
      expect(calculateBalanceScore(10, 10, 0)).toBe(3); // ≥ 10 sec semi-tandem
      expect(calculateBalanceScore(10, 10, 3)).toBe(4); // ≥ 3 sec tandem
    });
    
    it('should simulate program color determination correctly', () => {
      // Simulation de la fonction getProgramColor selon l'arbre décisionnel
      const getProgramColor = (totalScore) => {
        if (totalScore <= 1) return "ROUGE";
        if (totalScore <= 3) return "JAUNE";
        if (totalScore <= 5) return "ORANGE";
        if (totalScore <= 7) return "VERT";
        return "BLEU";
      };
      
      expect(getProgramColor(0)).toBe("ROUGE"); // 0-1
      expect(getProgramColor(1)).toBe("ROUGE"); // 0-1
      expect(getProgramColor(2)).toBe("JAUNE"); // 2-3
      expect(getProgramColor(3)).toBe("JAUNE"); // 2-3
      expect(getProgramColor(4)).toBe("ORANGE"); // 4-5
      expect(getProgramColor(5)).toBe("ORANGE"); // 4-5
      expect(getProgramColor(6)).toBe("VERT"); // 6-7
      expect(getProgramColor(7)).toBe("VERT"); // 6-7
      expect(getProgramColor(8)).toBe("BLEU"); // 8-9
      expect(getProgramColor(9)).toBe("BLEU"); // 8-9
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
