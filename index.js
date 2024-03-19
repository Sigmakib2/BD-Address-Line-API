const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Load JSON data
const addressData = require('./addressData.json');

// Route for suggesting division name
app.get('/suggestions/divisions/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    const suggestions = addressData.divisions.filter(division =>
        division.name.toLowerCase().startsWith(query)
    );
    res.json(suggestions);
});

// Route for suggesting Zila name
app.get('/suggestions/zilas/:division/:query', (req, res) => {
    const { division, query } = req.params;
    const divisionData = addressData.divisions.find(div => div.name === division);
    if (!divisionData) return res.status(404).json({ error: 'Division not found' });

    const suggestions = divisionData.zilas.filter(zila =>
        zila.toLowerCase().startsWith(query.toLowerCase())
    );
    res.json(suggestions);
});

// Route for suggesting Upazila name
app.get('/suggestions/upazilas/:division/:zila/:query', (req, res) => {
    const { division, zila, query } = req.params;
    const divisionData = addressData.divisions.find(div => div.name === division);
    if (!divisionData) return res.status(404).json({ error: 'Division not found' });

    const zilaData = divisionData.zilas.find(z => z === zila);
    if (!zilaData) return res.status(404).json({ error: 'Zila not found' });

    const suggestions = divisionData.upazilas.filter(upazila =>
        upazila.toLowerCase().startsWith(query.toLowerCase())
    );
    res.json(suggestions);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});