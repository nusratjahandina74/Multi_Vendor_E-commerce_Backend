require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const dbConfig = require('./config/dbConfig');
const swaggerSpecs = require('./config/swagger');
const { apiLimiter } = require('./middlewares/rateLimiterMiddleware');

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(cookieParser());

// Database Connection
dbConfig();

// Routes
app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth', authRoutes);

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
    swaggerSpecs(app, PORT);
});