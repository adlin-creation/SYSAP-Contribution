// EvaluationSearch.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import EvaluationSearch from './EvaluationSearch';
import Constants from '../Utils/Constants';

// Mock des dépendances
jest.mock('../Authentication/useToken', () => ({
  __esModule: true,
  default: () => ({ token: 'fake-token' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'search_title': 'Recherche de patients',
        'search_placeholder': 'Entrez un nom ou un ID',
        'table_column_lastname': 'Nom',
        'table_column_firstname': 'Prénom',
        'table_column_birthday': 'Date de naissance',
        'error_no_patients': 'Aucun patient trouvé.',
        'error_search': 'Erreur lors de la recherche. Veuillez réessayer.'
      };
      return translations[key] || key;
    }
  }),
}));

// Cette classe spécifique est requise par Ant Design
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('EvaluationSearch Component', () => {
  let originalMatchMedia;
  let originalResizeObserver;

  beforeAll(() => {
    // Sauvegarde des fonctions originales si elles existent
    originalMatchMedia = window.matchMedia;
    originalResizeObserver = window.ResizeObserver;
    
    // Mock des fonctions de Ant Design
    global.message = {
      warning: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
    };
  });

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    
    // Mock de fetch
    global.fetch = jest.fn();
    
    // Configuration de matchMedia avant chaque test
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),     // Deprecated
      removeListener: jest.fn(),  // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Configuration de ResizeObserver avant chaque test
    window.ResizeObserver = MockResizeObserver;
    
    // Mock de window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    // Restauration des fonctions originales
    window.matchMedia = originalMatchMedia;
    window.ResizeObserver = originalResizeObserver;
  });

  // Test de base pour vérifier le rendu
  it('renders the search form correctly', async () => {
    render(<EvaluationSearch />);
    
    // Vérifier que les éléments de base sont présents
    expect(screen.getByText('Recherche de patients')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Entrez un nom ou un ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rechercher/i })).toBeInTheDocument();
  });
  
  // Test de validation du formulaire
  it('does not trigger search when input is empty', async () => {
    // Réinitialiser les mocks
    fetch.mockClear();
    
    render(<EvaluationSearch />);
    
    // Soumettre une recherche vide
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que la requête fetch n'a pas été appelée (ce qui indique que la validation a fonctionné)
    expect(fetch).not.toHaveBeenCalled();
  });
  
  // Test de recherche par ID
  it('searches by ID when input is numeric', async () => {
    // Préparer les données de test
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID numérique et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que fetch a été appelé avec le bon endpoint
    expect(fetch).toHaveBeenCalledWith(
      `${Constants.SERVER_URL}/patient/123`, 
      { headers: { Authorization: 'Bearer fake-token' } }
    );
    
    // Vérifier que les résultats sont affichés
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
  });
  
  // Test de recherche par nom
  it('searches by name when input is not numeric', async () => {
    // Préparer les données de test
    const testPatients = [
      {
        id: 123,
        lastname: 'Doe',
        firstname: 'John',
        birthday: '1980-01-01'
      }
    ];
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un nom et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Doe' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que fetch a été appelé avec le bon endpoint
    expect(fetch).toHaveBeenCalledWith(
      `${Constants.SERVER_URL}/patients/search?term=Doe`, 
      { headers: { Authorization: 'Bearer fake-token' } }
    );
    
    // Vérifier que les résultats sont affichés
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
  });
  
  // Test pour le cas "aucun patient trouvé"
  it('shows message when no patients found', async () => {
    // Mock de la réponse du serveur vide
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un nom et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText('Aucun patient trouvé.')).toBeInTheDocument();
    });
  });
  
  // Test pour les erreurs de recherche
  it('shows error message when fetch fails', async () => {
    // Mock d'une erreur serveur
    fetch.mockRejectedValueOnce(new Error('Server error'));
    
    render(<EvaluationSearch />);
    
    // Entrer un nom et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Doe' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la recherche. Veuillez réessayer.')).toBeInTheDocument();
    });
  });
  
  // Test de navigation vers les pages d'évaluation
  it('navigates to evaluation page when button is clicked', async () => {
    // Préparer des données de test
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Attendre que les résultats s'affichent
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
    
    // Cliquer sur un bouton d'évaluation (ex: PACE)
    const paceButton = screen.getByText('Évaluation PACE');
    await act(async () => {
      fireEvent.click(paceButton);
    });
    
    // Vérifier que la navigation a été effectuée
    expect(window.location.href).toBe('/evaluation-pace/123');
  });
  
  // Test de la fonction de réinitialisation
  it('clears search results when clear button is clicked', async () => {
    // Préparer des données de test
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Attendre que les résultats s'affichent
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
    
    // Vérifier que le bouton de réinitialisation (icône X) apparaît quand il y a une valeur
    // Dans Ant Design, le bouton de réinitialisation a une icône "close"
    const clearButton = screen.getByRole('button', {
      name: 'close'  // Le nom est celui donné par Ant Design à l'icône
    });
    await act(async () => {
      fireEvent.click(clearButton);
    });
    
    // Vérifier que les résultats ont été effacés
    expect(screen.queryByText('Doe')).not.toBeInTheDocument();
    expect(searchInput.value).toBe('');
  });
  
  // Test de la gestion d'une réponse d'API non-ok
  it('handles non-ok API response', async () => {
    // Mock d'une réponse avec statut non-ok
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ message: 'Server error' })
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que le message d'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la recherche. Veuillez réessayer.')).toBeInTheDocument();
    });
  });
  
  // Test du chargement (état loading)
  it('shows loading state during search', async () => {
    // Créer une promesse qui ne se résout pas immédiatement
    let resolvePromise;
    const fetchPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    // Mock de fetch qui renvoie la promesse contrôlée
    fetch.mockReturnValueOnce(fetchPromise);
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que l'état de chargement est visible
    // Dans Ant Design, le bouton a une classe 'ant-btn-loading' pendant le chargement
    expect(searchButton.classList.contains('ant-btn-loading')).toBe(true);
    
    // Résoudre la promesse pour terminer le test
    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve([])
      });
    });
  });
  
  // Test avec une API qui renvoie un objet unique au lieu d'un tableau
  it('handles single patient response correctly', async () => {
    // Préparer les données de test (un seul patient)
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur renvoyant un seul objet (pas un tableau)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient) // Objet unique, pas un tableau
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que les résultats sont affichés correctement (même pour un objet unique)
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
  
  // Test avec plusieurs patients retournés
  it('displays multiple patients in search results', async () => {
    // Préparer les données de test (plusieurs patients)
    const testPatients = [
      {
        id: 123,
        lastname: 'Doe',
        firstname: 'John',
        birthday: '1980-01-01'
      },
      {
        id: 456,
        lastname: 'Smith',
        firstname: 'Jane',
        birthday: '1985-05-05'
      }
    ];
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatients)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un nom et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Do' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Vérifier que les résultats multiples sont affichés
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
  
  // Test de la navigation vers PATH et MATCH
  it('navigates to PATH evaluation page when PATH button is clicked', async () => {
    // Préparer des données de test
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Attendre que les résultats s'affichent
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
    
    // Cliquer sur le bouton d'évaluation PATH
    const pathButton = screen.getByText('Évaluation PATH');
    await act(async () => {
      fireEvent.click(pathButton);
    });
    
    // Vérifier que la navigation a été effectuée
    expect(window.location.href).toBe('/evaluation-path/123');
  });
  
  it('navigates to MATCH evaluation page when MATCH button is clicked', async () => {
    // Préparer des données de test
    const testPatient = {
      id: 123,
      lastname: 'Doe',
      firstname: 'John',
      birthday: '1980-01-01'
    };
    
    // Mock de la réponse du serveur
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(testPatient)
    });
    
    render(<EvaluationSearch />);
    
    // Entrer un ID et rechercher
    const searchInput = screen.getByPlaceholderText('Entrez un nom ou un ID');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '123' } });
    });
    
    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await act(async () => {
      fireEvent.click(searchButton);
    });
    
    // Attendre que les résultats s'affichent
    await waitFor(() => {
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
    
    // Cliquer sur le bouton d'évaluation MATCH
    const matchButton = screen.getByText('Évaluation MATCH');
    await act(async () => {
      fireEvent.click(matchButton);
    });
    
    // Vérifier que la navigation a été effectuée
    expect(window.location.href).toBe('/evaluation-match/123');
  });
});