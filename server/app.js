const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
// const authJwt = require('./helper/jwt');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(express.json());
// app.use(authJwt());

// Routes
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const prouctReviewRoutes = require('./routes/productReviews');
const myListRoutes = require('./routes/myLists');
const orderRoutes = require('./routes/orders');
const homeBannerRoutes = require('./routes/homeBanners');
const searchRouters = require('./routes/search');

app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/productReview', prouctReviewRoutes);
app.use('/api/myList', myListRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/homeBanner', homeBannerRoutes);
app.use('/api/search', searchRouters);

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
