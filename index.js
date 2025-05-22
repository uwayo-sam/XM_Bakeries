//imports

const express = require('express');
const cors = require('cors');
const app = express();



require('dotenv').config();

// middleware

app.use(cors());


//routes

app.get('/', (req, res) => {
    res.send('Hello World');
});


//server listerning on port 3000

app.listen(process.env.PORT, () => {
    console.log(`server is started on port ${process.env.PORT}`);
    
});