const REACT_APP_API_URL = process.env.REACT_APP_API_URL;



export const fetchServerData = async (path) => {
    try {
        const response = await fetch(`${REACT_APP_API_URL}${path}`);
        const data = response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.error('With path:', path);
        throw error;
    }
};

export const putData = async (path, body) => {
    try {
        const response = await fetch(`${REACT_APP_API_URL}${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Handle the response data
        console.log('Data saved successfully:', data);
    } catch (error) {
        console.error('There was an error saving the data:', error);
    }
}
