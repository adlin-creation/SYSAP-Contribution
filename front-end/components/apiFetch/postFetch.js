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

export default postFetch;