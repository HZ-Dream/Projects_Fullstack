const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const port = 4000;

app.use(cors());
app.options('*', cors());

// Connect to DB
const db = require('./config/db');
db.connect();

// Middleware
app.use(bodyParser.json());

// Routes
const route = require('./routes');
route(app);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
