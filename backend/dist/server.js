"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const cors = require('cors');
// // const { Pool } = require('pg');
// require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const salaries_1 = __importDefault(require("./routes/salaries"));
// const salariesRouter = require('./routes/salaries');
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use('/salaries', salaries_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
