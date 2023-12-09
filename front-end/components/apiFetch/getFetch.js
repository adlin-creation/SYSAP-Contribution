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
        return await response.json();
    } catch (error) {
        console.error('Erreur Fetch:', error);
        throw error;
    }
}

export default getFetch;
