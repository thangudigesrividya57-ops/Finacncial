require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, ''))); // Serve files from the root project directory

app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: { message: 'API key is not configured on the server. Please check your .env file.' } });
    }

    try {
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body) // Forward the request body from the frontend
        });

        const data = await openRouterResponse.json();

        if (!openRouterResponse.ok) {
            // Forward the error from OpenRouter to the client
            return res.status(openRouterResponse.status).json(data);
        }

        // Send back just the content part for simplicity
        res.json({ content: data.choices[0].message.content });

    } catch (error) {
        console.error('Error proxying to OpenRouter:', error);
        res.status(500).json({ error: { message: 'An internal server error occurred.' } });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running. Open http://localhost:${PORT} in your browser.`);
});