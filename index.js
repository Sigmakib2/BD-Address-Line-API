const express = require('express');
const app = express();
const fs = require('fs');

// Read postal data from JSON file
const postalData = JSON.parse(fs.readFileSync('data.json'));

// Endpoint for suggestions
app.get('/suggestions', (req, res) => {
    const userInput = req.query.input.toLowerCase(); // Assuming input is provided as a query parameter

    // Filter postal data based on user input
    const suggestions = postalData.filter(location =>
        location.District.toLowerCase().includes(userInput) ||
        location.Upozila.toLowerCase().includes(userInput) ||
        location.Post_Office.toLowerCase().includes(userInput) ||
        location.Post_Code.includes(userInput)
    );

    res.json(suggestions);
});

// Helper function to get unique values from an array
function getUniqueValues(array) {
    return Array.from(new Set(array));
}

// Endpoint for unique districts
app.get('/districts', (req, res) => {
    const districts = getUniqueValues(postalData.map(location => location.District));
    res.json(districts);
});

// Endpoint for unique divisions
app.get('/divisions', (req, res) => {
    const divisions = getUniqueValues(postalData.map(location => location.Division));
    res.json(divisions);
});

// Endpoint for unique upazilas
app.get('/upazilas', (req, res) => {
    const upazilas = getUniqueValues(postalData.map(location => location.Upozila));
    res.json(upazilas);
});

// Endpoint for specific division
app.get('/division/:divisionName', (req, res) => {
    const divisionName = req.params.divisionName.toLowerCase();

    // Filter postal data based on division name
    const divisionLocations = postalData.filter(location =>
        location.Division.toLowerCase() === divisionName
    );

    // Extract unique districts, upazilas, post offices, and postal codes
    const districts = getUniqueValues(divisionLocations.map(location => location.District));
    const upazilas = getUniqueValues(divisionLocations.map(location => location.Upozila));
    const postOffices = getUniqueValues(divisionLocations.map(location => location.Post_Office));
    const postalCodes = getUniqueValues(divisionLocations.map(location => location.Post_Code));

    // Construct response object
    const divisionInfo = {
        division: divisionName,
        districts: districts,
        upazilas: upazilas,
        postOffices: postOffices,
        postalCodes: postalCodes
    };

    res.json(divisionInfo);
});

// Endpoint for districts under a specific division
app.get('/division/:divisionName/districts', (req, res) => {
    const divisionName = req.params.divisionName.toLowerCase();

    // Filter postal data based on division name
    const divisionLocations = postalData.filter(location =>
        location.Division.toLowerCase() === divisionName
    );

    // Extract unique districts from the filtered locations
    const districts = getUniqueValues(divisionLocations.map(location => location.District));

    res.json(districts);
});

// Endpoint for upazilas under a specific district within a division
app.get('/division/:divisionName/district/:districtName/upazilas', (req, res) => {
    const divisionName = req.params.divisionName.toLowerCase();
    const districtName = req.params.districtName.toLowerCase();

    // Filter postal data based on division and district names
    const filteredLocations = postalData.filter(location =>
        location.Division.toLowerCase() === divisionName &&
        location.District.toLowerCase() === districtName
    );

    // Extract unique upazilas from the filtered locations
    const upazilas = getUniqueValues(filteredLocations.map(location => location.Upozila));

    res.json(upazilas);
});

// Endpoint for post offices under a specific upazila
app.get('/division/:divisionName/district/:districtName/upazila/:upazilaName/postoffices', (req, res) => {
    const divisionName = req.params.divisionName.toLowerCase();
    const districtName = req.params.districtName.toLowerCase();
    const upazilaName = req.params.upazilaName.toLowerCase();

    // Filter postal data based on division, district, and upazila names
    const filteredLocations = postalData.filter(location =>
        location.Division.toLowerCase() === divisionName &&
        location.District.toLowerCase() === districtName &&
        location.Upozila.toLowerCase() === upazilaName
    );

    // Extract post offices and their postal codes from the filtered locations
    const postOffices = filteredLocations.map(location => {
        return {
            postOffice: location.Post_Office,
            postCode: location.Post_Code
        };
    });

    res.json(postOffices);
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
