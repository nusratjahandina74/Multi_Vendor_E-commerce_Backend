require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const app = express()

app.use(express.json({ limit: '10kb' }))
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http:localhost:5173',
    credentials: true
}))
app.use(cookieParser())

//Routes
app.use('/api/v1/auth/', authRoutes)

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    })

//Server
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})