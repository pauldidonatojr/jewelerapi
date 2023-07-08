const express = require('express');
const data = require('./data');
const singleData = require('./single-data');

const app = express();

app.get('/api/data', (req, res) => {
    res.json(data);
});

app.get('/api/single-data', (req, res) => {
    const { id } = req.query;
    if (id) {
        const item = singleData.find((d) => d.id === id);
        if (!item) {
            res.status(404).json({ error: "Item not found" });
        } else {
            res.json(item);
        }
    } else {
        res.status(400).json({ error: "Missing id in query parameters" });
    }
});

module.exports = app;
