const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());

// Routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');

app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);

// Database
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database Connection is ready...');

        // Server
        app.listen(process.env.PORT, () => {
            console.log(`PORT SERVER is ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
