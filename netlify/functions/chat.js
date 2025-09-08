const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    try {
        // Parse the request body
        const { messages } = JSON.parse(event.body);

        // Get the API key from environment variables
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        // Check if the API key is available
        if (!GROQ_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API key is not configured.' })
            };
        }

        // Call the Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: messages
            })
        });

        const data = await response.json();

        // Return the AI's response to the client
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error in function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};