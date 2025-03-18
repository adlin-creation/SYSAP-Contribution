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
    useToken.mockReturnValue({ token: 'fake-token' });
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
    
    // Vérifier que les sections principale sont présentes
    expect(screen.getByText('CARDIO-MUSCULAIRE')).toBeInTheDocument();
    expect(screen.getByText('ÉQUILIBRE (Debout, sans aide)')).toBeInTheDocument();
    expect(screen.getByText('OBJECTIF DE MARCHE')).toBeInTheDocument();
    
    // Vérifier la présence des boutons Annuler et Soumettre
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  it('displays the chair test options correctly', () => {
    render(<EvaluationMATCH />);
    
    // Vérifier les options du test de chaise
    expect(screen.getByText('Test de la chaise en 30 secondes')).toBeInTheDocument();
    expect(screen.getByText('Avec appui')).toBeInTheDocument();
    expect(screen.getByText('Sans appui')).toBeInTheDocument();
    
    // vérifier que l'option "Avec appui" est sélectionne par défaut
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
    expect(screen.getByText('Le patient ne peut pas marcher')).toBeInTheDocument();
  });

  it('disables semi-tandem balance test when feet together time is insufficient', async () => {
    render(<EvaluationMATCH />);
    
    
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; // Premier champ (pieds joints)
    fireEvent.change(feetTogetherInput, { target: { value: '5' } }); // < 10 sec
    
    
    const semiTandemInput = balanceInputs[1]; // Deuxième champ (semi-tandem)
    
    expect(semiTandemInput).toBeDisabled();
  });

  it('enables semi-tandem balance test when feet together time is sufficient', async () => {
    render(<EvaluationMATCH />);
    
    // Configurer un score cardio-musculaire suffisant (> 1)
    const chairTestInput = screen.getByPlaceholderText('Entrez le nombre');
    fireEvent.change(chairTestInput, { target: { value: '10' } });
    
    // Remplir le temps pieds joints avec une valeur suffisante
    const balanceInputs = screen.getAllByPlaceholderText('Entrez le temps');
    const feetTogetherInput = balanceInputs[0]; 
    fireEvent.change(feetTogetherInput, { target: { value: '10' } });
    
    // Vérifier que le champ semi-tandem est activé
    const semiTandemInput = balanceInputs[1]; 
    
    expect(semiTandemInput).not.toBeDisabled();
  });





});
