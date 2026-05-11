require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send("Done")
})
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})