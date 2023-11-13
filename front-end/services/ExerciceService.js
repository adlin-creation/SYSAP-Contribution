import axios from 'axios';

const serverURL = 'http://localhost:5000'; // ou l'URL de votre backend en production

const ExerciseService = {
  fetchExercises: async function () {
    try {
      const response = await axios.get(`${serverURL}/api/exercises`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Autres méthodes de service 
};

export default ExerciseService;
