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
    
    expect(screen.getByText('CARDIO-MUSCULAIRE')).toBeInTheDocument();
    expect(screen.getByText('ÉQUILIBRE (Debout, sans aide)')).toBeInTheDocument();
    expect(screen.getByText('OBJECTIF DE MARCHE')).toBeInTheDocument();
    
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  it('displays the chair test options correctly', () => {
    render(<EvaluationMATCH />);
    
    expect(screen.getByText('Test de la chaise en 30 secondes')).toBeInTheDocument();
    expect(screen.getByText('Avec appui')).toBeInTheDocument();
    expect(screen.getByText('Sans appui')).toBeInTheDocument();
    
    const withSupportRadio = screen.getByText('Avec appui').closest('label').querySelector('input');
    expect(withSupportRadio.checked).toBeTruthy();
  });


});
