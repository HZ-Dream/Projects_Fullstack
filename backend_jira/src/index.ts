import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server Jira run with port: http://localhost:${PORT}`);
});
