import getFetch from "./getFetch";

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

async function ajouterMarche(minute) {
    const idPatient = 1;
    try {
        const body = {
            "idPatient": idPatient,
            "Marche": minute,
        }
        return await postFetch(`http://localhost:3000/api/progress/updateMarche`, body);

    } catch (err) {
        console.error("Update marche failed " + err);
    }
}

export default ajouterMarche;