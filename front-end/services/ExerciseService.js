import axios from 'axios';
// import { SERVER_BASE_URL } from '@env';

// const serverURL = SERVER_BASE_URL || "http://localhost:5000";
const serverURL = "http://localhost:5000";

const ExerciseService = {
  fetchExercises: async function () {
    try {
      const response = await axios.get(`${serverURL}/api/exercises`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createExercise: async function (exerciseName) {
    try {
      const newExercise = {
          "name": "Exercise de test",
          "description": "Description de l'exercise de test",
          "numberRepetitionsMin": 5,
          "numberRepetitionsMax": 10,
          "url": "http://example.com/exercise/test"
      }
      const response = await axios.post(`${serverURL}/api/exercises`, newExercise);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
};

export default ExerciseService;






































// import axios from 'axios';
// //import { SERVER_BASE_URL } from "@env";

// const serverURL = "http://localhost:5000";

// const ExerciseService = {
//   fetchExercises: async function () {
//     try {
//       const response = await axios.get(`${serverURL}/api/exercises`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
//   fetchStepsForExercise: async (exerciseId) => {
//     const response = await fetch(`${serverURL}/api/steps/${exerciseId}`);
//     const data = await response.json();
//     return data;
//   },
//   fetchAllSteps: async () => {
//     const response = await fetch(`${serverURL}/api/steps`);
//     const data = await response.json();
//     return data;
//   },
//   createExercise: async function (exerciseName) {
//     try {
//       const response = await axios.post(`${serverURL}/api/exercises`, { name: exerciseName });
//       return response.data; 
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// export default ExerciseService;
