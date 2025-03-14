import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateProgram from '../components/Program/CreateProgram';  // Assurez-vous que le chemin du composant est correct
import { BrowserRouter as Router } from 'react-router-dom';  // Si votre app utilise React Router
import axios from 'axios';

// Mock de l'appel axios
jest.mock('axios');

describe('CreateProgram Component', () => {
  it('should render form and handle form submission', async () => {
    // Mock axios pour simuler la réponse
    axios.post.mockResolvedValue({ data: { message: 'Program created successfully' } });

    render(
      <Router>
        <CreateProgram refetchPrograms={jest.fn()} />
      </Router>
    );

    // Vérifier si le formulaire est affiché
    expect(screen.getByLabelText(/Please enter the name of the program/)).toBeInTheDocument();

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Please enter the name of the program/), {
      target: { value: 'Test Program' },
    });

    fireEvent.change(screen.getByLabelText(/Please enter the description of the program/), {
      target: { value: 'A program for testing' },
    });

    fireEvent.change(screen.getByLabelText(/Please enter the duration of the program/), {
      target: { value: '30' },
    });

    fireEvent.change(screen.getByLabelText(/Please select the unit of the duration/), {
      target: { value: 'days' },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('SUBMIT'));

    // Attendre que l'appel API soit terminé
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Vérifier si le message de succès est affiché
    expect(screen.getByText(/Program created successfully/)).toBeInTheDocument();
  });

  it('should show an error message when the API fails', async () => {
    // Mock axios pour simuler une erreur
    axios.post.mockRejectedValue({ response: { data: { message: 'Failed to create program' } } });

    render(
      <Router>
        <CreateProgram refetchPrograms={jest.fn()} />
      </Router>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Please enter the name of the program/), {
      target: { value: 'Test Program' },
    });

    fireEvent.change(screen.getByLabelText(/Please enter the description of the program/), {
      target: { value: 'A program for testing' },
    });

    fireEvent.change(screen.getByLabelText(/Please enter the duration of the program/), {
      target: { value: '30' },
    });

    fireEvent.change(screen.getByLabelText(/Please select the unit of the duration/), {
      target: { value: 'days' },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('SUBMIT'));

    // Attendre que l'appel API soit terminé
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Vérifier si le message d'erreur est affiché
    expect(screen.getByText(/Failed to create program/)).toBeInTheDocument();
  });
});
