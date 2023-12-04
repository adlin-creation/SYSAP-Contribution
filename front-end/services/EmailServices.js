const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const postData = async (path, body) => {
    try {
        const response = await fetch(`${REACT_APP_API_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.json();
        // Handle the response data
        console.log('Data successfully sent :', data);
        return data;
    } catch (error) {
        console.error('Error while sending data:', error);
    }
}