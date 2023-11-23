import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL; // ou l'URL de votre backend en production

const ExerciseService = {
  fetchExercises: async function () {
    try {
      const response = await axios.get(`${apiUrl}/api/exercises`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  fetchExerciseById: async function (idExercise) {
    try {
      const response = await axios.get(`${apiUrl}/api/exercises/${idExercise}`);
      //console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Autres méthodes de service 
};

export default ExerciseService;
