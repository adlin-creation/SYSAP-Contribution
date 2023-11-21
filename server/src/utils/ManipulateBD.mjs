import 'node-fetch';

// URL de l'API que vous souhaitez interroger
const api = 'http://localhost:3000/api/progress/getAllMarche';

// Options de la requête (ici, une requête GET sans paramètres)

// Effectuer la requête Fetch avec node-fetch


async function getFetch(apiUrl) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        return  await response.json();
    } catch (error) {
        console.error('Erreur Fetch:', error);
        throw error;
    }
}

async function postFetch(apiUrl, data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(data)
    };
    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);

        return  await response.json();
    } catch (error) {
        console.error('Erreur Fetch:', error);
        throw error;
    }
}

export default getFetch;


